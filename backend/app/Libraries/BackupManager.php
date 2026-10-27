<?php

namespace App\Libraries;

use CodeIgniter\Database\BaseConnection;
use Config\Database;
use Config\Services;
use ZipArchive;

/**
 * Backup e ripristino completi del sito: database + immagini caricate.
 *
 * Ogni backup e uno zip con:
 *   - manifest.json  metadati (data, numero di tabelle e immagini)
 *   - database.sql   dump generato in PHP (niente mysqldump, che su Aruba
 *                    non e disponibile), importabile anche da phpMyAdmin
 *   - uploads/...    copia di public/uploads, solo file immagine
 *
 * Gli zip stanno in writable/backups, che non e raggiungibile dal web: i nomi
 * contengono comunque una parte casuale e la cartella riceve un proprio
 * .htaccess, perche il deploy FTP non carica i file .htaccess.
 */
class BackupManager
{
    /** Prefissi dei nomi file: backup manuale, automatico prima di un ripristino, caricato dall'admin. */
    public const KIND_MANUAL      = 'backup';
    public const KIND_PRE_RESTORE = 'pre-ripristino';
    public const KIND_UPLOADED    = 'caricato';

    private const NAME_PATTERN = '/^(backup|pre-ripristino|caricato)-(\d{8})-(\d{6})-[a-f0-9]{12}\.zip$/';

    /** Estensioni ripristinabili dentro uploads/: le stesse ammesse da HandlesImageUploads. */
    private const IMAGE_EXTENSIONS = ['jpg', 'jpeg', 'png', 'webp', 'gif'];

    /** Le uniche istruzioni SQL eseguite in un ripristino. */
    private const ALLOWED_STATEMENTS = '/^(SET\s+(NAMES|FOREIGN_KEY_CHECKS)\b|DROP\s+TABLE\s|CREATE\s+TABLE\s|INSERT\s+INTO\s)/i';

    /** Righe per singola INSERT multipla nel dump. */
    private const INSERT_BATCH_ROWS = 100;

    private string $backupDir;
    private string $uploadsDir;
    private BaseConnection $db;

    public function __construct(?string $backupDir = null, ?string $uploadsDir = null)
    {
        $this->backupDir  = rtrim($backupDir ?? WRITEPATH . 'backups', '/') . '/';
        $this->uploadsDir = rtrim($uploadsDir ?? FCPATH . 'uploads', '/') . '/';
        $this->db         = Database::connect();
    }

    public static function isAvailable(): bool
    {
        return class_exists(ZipArchive::class);
    }

    /**
     * @return list<array{name: string, kind: string, createdAt: string, size: int}>
     */
    public function list(): array
    {
        $this->ensureBackupDir();

        $items = [];
        foreach (scandir($this->backupDir) ?: [] as $name) {
            if (! preg_match(self::NAME_PATTERN, $name, $m)) {
                continue;
            }
            $items[] = [
                'name'      => $name,
                'kind'      => $m[1],
                'createdAt' => \DateTime::createFromFormat('YmdHis', $m[2] . $m[3])->format('c'),
                'size'      => (int) filesize($this->backupDir . $name),
            ];
        }

        usort($items, static fn ($a, $b) => strcmp($b['createdAt'], $a['createdAt']));

        return $items;
    }

    /**
     * Percorso assoluto di un backup esistente, o null se il nome non e valido.
     */
    public function path(string $name): ?string
    {
        if (! preg_match(self::NAME_PATTERN, $name)) {
            return null;
        }
        $path = $this->backupDir . $name;

        return is_file($path) ? $path : null;
    }

    public function delete(string $name): bool
    {
        $path = $this->path($name);

        return $path !== null && unlink($path);
    }

    /**
     * Crea un nuovo backup e ne restituisce il nome.
     */
    public function create(string $kind = self::KIND_MANUAL): string
    {
        $this->ensureBackupDir();

        return $this->withLock(fn () => $this->createUnlocked($kind));
    }

    /**
     * Sposta nella cartella dei backup uno zip caricato dall'admin, dopo averne
     * verificato la struttura. Restituisce il nome assegnato.
     */
    public function import(string $tmpPath): string
    {
        $this->ensureBackupDir();
        $this->assertValidArchive($tmpPath);

        $name = $this->newName(self::KIND_UPLOADED);
        if (! rename($tmpPath, $this->backupDir . $name) && ! copy($tmpPath, $this->backupDir . $name)) {
            throw new BackupException('Impossibile salvare il file caricato.');
        }

        return $name;
    }

    /**
     * Ripristina database e immagini dal backup indicato. Prima di toccare
     * qualunque cosa salva lo stato attuale in un backup "pre-ripristino"; se
     * l'import del database fallisce a meta, riporta il database a quello stato.
     *
     * @return array{safetyBackup: string, tables: int, files: int}
     */
    public function restore(string $name): array
    {
        $path = $this->path($name);
        if ($path === null) {
            throw new BackupException('Backup non trovato.');
        }

        $this->assertValidArchive($path);

        return $this->withLock(function () use ($path) {
            $safety = $this->createUnlocked(self::KIND_PRE_RESTORE);

            try {
                $tables = $this->restoreDatabase($path);
            } catch (\Throwable $e) {
                log_message('error', '[Backup] ripristino database fallito: ' . $e->getMessage());
                try {
                    $this->restoreDatabase($this->backupDir . $safety);
                } catch (\Throwable $rollbackError) {
                    log_message('critical', '[Backup] anche il rollback e fallito: ' . $rollbackError->getMessage());
                    throw new BackupException(
                        "Ripristino fallito e database non riportato allo stato precedente. Ripristina manualmente il backup {$safety}."
                    );
                }
                throw new BackupException('Ripristino fallito: il database e stato riportato allo stato precedente.');
            }

            $files = $this->restoreUploads($path);

            return ['safetyBackup' => $safety, 'tables' => $tables, 'files' => $files];
        });
    }

    // ---------------------------------------------------------------------
    // Creazione
    // ---------------------------------------------------------------------

    private function createUnlocked(string $kind): string
    {
        $name    = $this->newName($kind);
        $zipPath = $this->backupDir . $name;
        $sqlPath = $this->backupDir . '.dump-' . bin2hex(random_bytes(6)) . '.sql';

        try {
            $tables = $this->dumpDatabase($sqlPath);

            $zip = new ZipArchive();
            if ($zip->open($zipPath, ZipArchive::CREATE | ZipArchive::EXCL) !== true) {
                throw new BackupException('Impossibile creare il file di backup.');
            }

            $zip->addFile($sqlPath, 'database.sql');
            $files = $this->addUploadsToZip($zip);

            $zip->addFromString('manifest.json', json_encode([
                'app'       => 'stefaniamastroianni',
                'createdAt' => date('c'),
                'kind'      => $kind,
                'tables'    => $tables,
                'files'     => $files,
            ], JSON_PRETTY_PRINT));

            if (! $zip->close()) {
                throw new BackupException('Impossibile completare il file di backup.');
            }
        } catch (\Throwable $e) {
            if (is_file($zipPath)) {
                unlink($zipPath);
            }
            throw $e;
        } finally {
            if (is_file($sqlPath)) {
                unlink($sqlPath);
            }
        }

        return $name;
    }

    /**
     * Scrive il dump su file e restituisce il numero di tabelle. Ogni INSERT
     * sta su una sola riga (l'escape di mysqli trasforma gli a capo in \n), cosi
     * il ripristino puo leggere il file riga per riga senza un parser SQL.
     */
    private function dumpDatabase(string $sqlPath): int
    {
        $fh = fopen($sqlPath, 'wb');
        if ($fh === false) {
            throw new BackupException('Impossibile scrivere il dump del database.');
        }

        try {
            fwrite($fh, "-- Backup Stefania Mastroianni del " . date('Y-m-d H:i:s') . "\n");
            fwrite($fh, "SET NAMES utf8mb4;\nSET FOREIGN_KEY_CHECKS=0;\n\n");

            $tables = $this->baseTables();
            foreach ($tables as $table) {
                $quoted = $this->quoteIdentifier($table);
                $create = $this->db->query("SHOW CREATE TABLE {$quoted}")->getRowArray();

                fwrite($fh, "DROP TABLE IF EXISTS {$quoted};\n");
                fwrite($fh, $create['Create Table'] . ";\n\n");

                $query = $this->db->query("SELECT * FROM {$quoted}");
                $batch = [];
                $columns = null;
                while ($row = $query->getUnbufferedRow('array')) {
                    $columns ??= '(' . implode(', ', array_map([$this, 'quoteIdentifier'], array_keys($row))) . ')';
                    $batch[] = '(' . implode(', ', array_map([$this, 'sqlValue'], $row)) . ')';

                    if (count($batch) >= self::INSERT_BATCH_ROWS) {
                        fwrite($fh, "INSERT INTO {$quoted} {$columns} VALUES " . implode(', ', $batch) . ";\n");
                        $batch = [];
                    }
                }
                if ($batch !== []) {
                    fwrite($fh, "INSERT INTO {$quoted} {$columns} VALUES " . implode(', ', $batch) . ";\n");
                }
                $query->freeResult();
                fwrite($fh, "\n");
            }

            fwrite($fh, "SET FOREIGN_KEY_CHECKS=1;\n");
        } finally {
            fclose($fh);
        }

        return count($tables);
    }

    private function addUploadsToZip(ZipArchive $zip): int
    {
        if (! is_dir($this->uploadsDir)) {
            return 0;
        }

        $count    = 0;
        $iterator = new \RecursiveIteratorIterator(
            new \RecursiveDirectoryIterator($this->uploadsDir, \FilesystemIterator::SKIP_DOTS)
        );
        foreach ($iterator as $file) {
            if (! $file->isFile() || ! $this->isImageName($file->getFilename())) {
                continue;
            }
            $relative = substr($file->getPathname(), strlen($this->uploadsDir));
            $zip->addFile($file->getPathname(), 'uploads/' . str_replace('\\', '/', $relative));
            $count++;
        }

        return $count;
    }

    // ---------------------------------------------------------------------
    // Ripristino
    // ---------------------------------------------------------------------

    /**
     * Controlla che lo zip sia un nostro backup e che il dump contenga solo
     * istruzioni ammesse, prima di cancellare qualunque dato.
     */
    private function assertValidArchive(string $path): void
    {
        $zip = new ZipArchive();
        if ($zip->open($path, ZipArchive::RDONLY) !== true) {
            throw new BackupException('Il file non e un archivio zip valido.');
        }

        try {
            $manifest = json_decode((string) $zip->getFromName('manifest.json'), true);
            if (! is_array($manifest) || ($manifest['app'] ?? null) !== 'stefaniamastroianni') {
                throw new BackupException('Il file non e un backup di questo sito.');
            }

            $stream = $zip->getStream('database.sql');
            if ($stream === false) {
                throw new BackupException('Il backup non contiene il database.');
            }
            try {
                $creates = 0;
                foreach ($this->readStatements($stream) as $statement) {
                    if (! preg_match(self::ALLOWED_STATEMENTS, $statement)) {
                        throw new BackupException('Il database nel backup contiene istruzioni non ammesse.');
                    }
                    if (stripos($statement, 'CREATE TABLE') === 0) {
                        $creates++;
                    }
                }
                if ($creates === 0) {
                    throw new BackupException('Il database nel backup e vuoto.');
                }
            } finally {
                fclose($stream);
            }
        } finally {
            $zip->close();
        }
    }

    /**
     * Svuota il database e lo ricrea dal dump, poi applica le migrazioni piu
     * recenti del backup (un backup vecchio torna allo schema attuale).
     */
    private function restoreDatabase(string $zipPath): int
    {
        $zip = new ZipArchive();
        if ($zip->open($zipPath, ZipArchive::RDONLY) !== true) {
            throw new BackupException('Impossibile aprire il backup.');
        }

        $tables = 0;
        try {
            $stream = $zip->getStream('database.sql');
            if ($stream === false) {
                throw new BackupException('Il backup non contiene il database.');
            }

            $this->execute('SET FOREIGN_KEY_CHECKS=0');
            try {
                foreach ($this->baseTables() as $table) {
                    $this->execute('DROP TABLE IF EXISTS ' . $this->quoteIdentifier($table));
                }

                foreach ($this->readStatements($stream) as $statement) {
                    $this->execute($statement);
                    if (stripos($statement, 'CREATE TABLE') === 0) {
                        $tables++;
                    }
                }
            } finally {
                fclose($stream);
                $this->execute('SET FOREIGN_KEY_CHECKS=1');
            }
        } finally {
            $zip->close();
        }

        $this->db->resetDataCache();
        Services::migrations(null, $this->db, false)->latest();

        return $tables;
    }

    /**
     * Copia le immagini del backup in public/uploads, sovrascrivendo quelle con
     * lo stesso nome. Le immagini presenti ma assenti dal backup restano: il
     * database ripristinato non le referenzia e non fanno danno. Si estraggono
     * solo file immagine con nomi semplici, mai percorsi con "..".
     */
    private function restoreUploads(string $zipPath): int
    {
        $zip = new ZipArchive();
        if ($zip->open($zipPath, ZipArchive::RDONLY) !== true) {
            throw new BackupException('Impossibile aprire il backup.');
        }

        $count = 0;
        try {
            for ($i = 0; $i < $zip->numFiles; $i++) {
                $entry = (string) $zip->getNameIndex($i);
                if (! str_starts_with($entry, 'uploads/') || str_ends_with($entry, '/')) {
                    continue;
                }

                $relative = substr($entry, strlen('uploads/'));
                $segments = explode('/', $relative);
                foreach ($segments as $segment) {
                    if (! preg_match('/^[A-Za-z0-9_-][A-Za-z0-9._-]*$/', $segment)) {
                        continue 2;
                    }
                }
                if (! $this->isImageName(end($segments))) {
                    continue;
                }

                $target = $this->uploadsDir . $relative;
                $dir    = dirname($target);
                if (! is_dir($dir) && ! mkdir($dir, 0755, true)) {
                    throw new BackupException('Impossibile creare la cartella delle immagini.');
                }

                $in  = $zip->getStream($entry);
                $out = fopen($target, 'wb');
                if ($in === false || $out === false) {
                    throw new BackupException('Impossibile ripristinare le immagini.');
                }
                stream_copy_to_stream($in, $out);
                fclose($in);
                fclose($out);
                $count++;
            }
        } finally {
            $zip->close();
        }

        return $count;
    }

    /**
     * Legge le istruzioni del dump: le righe si accumulano finche una non
     * termina con ";". I commenti "--" e le righe vuote tra un'istruzione e
     * l'altra vengono saltati.
     *
     * @param resource $stream
     *
     * @return \Generator<string>
     */
    private function readStatements($stream): \Generator
    {
        $buffer = '';
        while (($line = fgets($stream)) !== false) {
            $trimmed = rtrim($line, "\r\n");
            if ($buffer === '' && (trim($trimmed) === '' || str_starts_with(ltrim($trimmed), '--'))) {
                continue;
            }

            $buffer .= ($buffer === '' ? '' : "\n") . $trimmed;
            if (str_ends_with(rtrim($trimmed), ';')) {
                yield rtrim(rtrim($buffer), ';');
                $buffer = '';
            }
        }

        if (trim($buffer) !== '') {
            throw new BackupException('Il database nel backup e incompleto.');
        }
    }

    // ---------------------------------------------------------------------
    // Utilita
    // ---------------------------------------------------------------------

    /** @return list<string> */
    private function baseTables(): array
    {
        $rows = $this->db->query("SHOW FULL TABLES WHERE Table_type = 'BASE TABLE'")->getResultArray();

        return array_map(static fn ($row) => (string) reset($row), $rows);
    }

    private function execute(string $sql): void
    {
        if ($this->db->simpleQuery($sql) === false) {
            $error = $this->db->error();
            throw new BackupException('Errore SQL: ' . ($error['message'] ?? 'sconosciuto'));
        }
    }

    private function quoteIdentifier(string $name): string
    {
        return '`' . str_replace('`', '``', $name) . '`';
    }

    private function sqlValue($value): string
    {
        return $value === null ? 'NULL' : (string) $this->db->escape((string) $value);
    }

    private function isImageName(string $filename): bool
    {
        return in_array(strtolower(pathinfo($filename, PATHINFO_EXTENSION)), self::IMAGE_EXTENSIONS, true);
    }

    private function newName(string $kind): string
    {
        return $kind . '-' . date('Ymd-His') . '-' . bin2hex(random_bytes(6)) . '.zip';
    }

    private function ensureBackupDir(): void
    {
        if (! is_dir($this->backupDir) && ! mkdir($this->backupDir, 0755, true)) {
            throw new BackupException('Impossibile creare la cartella dei backup.');
        }

        $htaccess = $this->backupDir . '.htaccess';
        if (! is_file($htaccess)) {
            file_put_contents($htaccess, "<IfModule authz_core_module>\n\tRequire all denied\n</IfModule>\n<IfModule !authz_core_module>\n\tDeny from all\n</IfModule>\n");
        }
        if (! is_file($this->backupDir . 'index.html')) {
            file_put_contents($this->backupDir . 'index.html', '');
        }
    }

    /**
     * Un solo backup o ripristino alla volta: due operazioni sovrapposte
     * (doppio clic, due schede) produrrebbero dump incoerenti.
     *
     * @template T
     *
     * @param callable(): T $callback
     *
     * @return T
     */
    private function withLock(callable $callback)
    {
        $lock = fopen($this->backupDir . '.lock', 'c');
        if ($lock === false || ! flock($lock, LOCK_EX | LOCK_NB)) {
            throw new BackupException("C'e gia un backup o un ripristino in corso. Riprova tra qualche minuto.");
        }

        try {
            return $callback();
        } finally {
            flock($lock, LOCK_UN);
            fclose($lock);
        }
    }
}
