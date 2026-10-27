<?php

namespace App\Controllers\Api;

use App\Libraries\BackupException;
use App\Libraries\BackupManager;
use CodeIgniter\RESTful\ResourceController;

/**
 * Backup e ripristino dal pannello admin (database + immagini caricate).
 * Tutte le rotte sono protette dal filtro auth.
 */
class BackupController extends ResourceController
{
    protected $format = 'json';

    /** Dimensione massima di uno zip caricato per il ripristino, in kilobyte. */
    private const MAX_UPLOAD_KB = 512000; // 500 MB

    public function index()
    {
        if (! BackupManager::isAvailable()) {
            return $this->failServerError("L'estensione PHP zip non e disponibile sul server.");
        }

        return $this->respond((new BackupManager())->list());
    }

    public function create()
    {
        if (! BackupManager::isAvailable()) {
            return $this->failServerError("L'estensione PHP zip non e disponibile sul server.");
        }

        $this->extendLimits();

        try {
            $name = (new BackupManager())->create();
        } catch (\Throwable $e) {
            log_message('error', '[Backup] creazione fallita: ' . $e->getMessage());

            return $this->failServerError($this->publicMessage($e, 'Creazione del backup non riuscita.'));
        }

        return $this->respondCreated(['name' => $name]);
    }

    public function download($name = null)
    {
        $path = (new BackupManager())->path((string) $name);
        if ($path === null) {
            return $this->failNotFound('Backup non trovato.');
        }

        return $this->response->download($path, null)->setFileName(basename($path));
    }

    public function restore($name = null)
    {
        if (! BackupManager::isAvailable()) {
            return $this->failServerError("L'estensione PHP zip non e disponibile sul server.");
        }

        $this->extendLimits();

        try {
            $result = (new BackupManager())->restore((string) $name);
        } catch (\Throwable $e) {
            log_message('error', '[Backup] ripristino fallito: ' . $e->getMessage());

            return $this->failServerError($this->publicMessage($e, 'Ripristino non riuscito.'));
        }

        return $this->respond($result);
    }

    /**
     * Carica uno zip di backup (ad esempio scaricato in precedenza) e lo
     * aggiunge all'elenco. Il ripristino resta un passaggio separato.
     */
    public function upload()
    {
        if (! BackupManager::isAvailable()) {
            return $this->failServerError("L'estensione PHP zip non e disponibile sul server.");
        }

        $file   = $this->request->getFile('backup');
        $tooBig = 'File troppo grande per i limiti del server (massimo ' . ini_get('upload_max_filesize') . '). Ripristina il backup da una copia gia presente nell\'elenco.';

        // Oltre post_max_size PHP scarta l'intera richiesta: il file risulta
        // semplicemente assente anche se il browser l'ha inviato.
        if ($file === null && (int) $this->request->getServer('CONTENT_LENGTH') > 0) {
            return $this->failValidationErrors($tooBig);
        }
        if ($file === null || $file->getError() === UPLOAD_ERR_NO_FILE) {
            return $this->failValidationErrors('Nessun file selezionato.');
        }
        if (in_array($file->getError(), [UPLOAD_ERR_INI_SIZE, UPLOAD_ERR_FORM_SIZE], true)) {
            return $this->failValidationErrors($tooBig);
        }
        if (! $file->isValid()) {
            return $this->failValidationErrors($file->getErrorString());
        }
        if (strtolower($file->getClientExtension()) !== 'zip') {
            return $this->failValidationErrors('Il file deve essere uno zip di backup.');
        }
        if ($file->getSizeByUnit('kb') > self::MAX_UPLOAD_KB) {
            return $this->failValidationErrors('File troppo grande.');
        }

        $this->extendLimits();

        try {
            $name = (new BackupManager())->import($file->getTempName());
        } catch (\Throwable $e) {
            log_message('error', '[Backup] caricamento fallito: ' . $e->getMessage());

            return $this->failValidationErrors($this->publicMessage($e, 'Caricamento del backup non riuscito.'));
        }

        return $this->respondCreated(['name' => $name]);
    }

    public function delete($name = null)
    {
        if (! (new BackupManager())->delete((string) $name)) {
            return $this->failNotFound('Backup non trovato.');
        }

        return $this->respondDeleted(['success' => true]);
    }

    /**
     * Backup e ripristino possono durare piu del limite standard e non devono
     * interrompersi a meta se il browser chiude la connessione.
     */
    private function extendLimits(): void
    {
        ignore_user_abort(true);
        @set_time_limit(600);
    }

    /**
     * I messaggi di BackupException sono scritti per l'admin; qualunque altro
     * errore resta nel log.
     */
    private function publicMessage(\Throwable $e, string $fallback): string
    {
        return $e instanceof BackupException ? $e->getMessage() : $fallback;
    }
}
