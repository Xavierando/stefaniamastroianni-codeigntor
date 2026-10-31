<?php

namespace App\Controllers\Api\Concerns;

use CodeIgniter\HTTP\Files\UploadedFile;

/**
 * Caricamento delle locandine degli eventi: PDF o immagine, salvati cosi come
 * sono (niente ricompressione) perche vanno scaricati e stampati.
 *
 * Stesse regole di HandlesImageUploads: tipo verificato sul contenuto reale,
 * estensione decisa dal server, nome casuale.
 */
trait HandlesPosterUploads
{
    /** Tipi ammessi per la locandina, con l'estensione salvata. */
    protected array $allowedPosterMimes = [
        'application/pdf' => 'pdf',
        'image/jpeg'      => 'jpg',
        'image/png'       => 'png',
        'image/webp'      => 'webp',
    ];

    /** Dimensione massima della locandina, in kilobyte. */
    protected int $maxPosterKb = 10240; // 10 MB

    /**
     * Valida la locandina e la sposta in FCPATH/uploads/$subDir.
     * Nessun file inviato = successo con `url` null.
     *
     * @return array{ok: bool, url: string|null, error: string|null}
     */
    protected function storeUploadedPoster(?UploadedFile $file, string $subDir = ''): array
    {
        if ($file === null || $file->getError() === UPLOAD_ERR_NO_FILE) {
            return ['ok' => true, 'url' => null, 'error' => null];
        }

        if (! $file->isValid() || $file->hasMoved()) {
            return ['ok' => false, 'url' => null, 'error' => $file->getErrorString()];
        }

        $mime = $file->getMimeType();
        if (! isset($this->allowedPosterMimes[$mime])) {
            return ['ok' => false, 'url' => null, 'error' => 'Tipo di file non consentito. La locandina puo essere un PDF o un\'immagine JPEG, PNG o WebP.'];
        }

        if ($mime === 'application/pdf') {
            $handle = fopen($file->getTempName(), 'rb');
            $header = $handle !== false ? fread($handle, 5) : false;
            if ($handle !== false) {
                fclose($handle);
            }
            if ($header !== '%PDF-') {
                return ['ok' => false, 'url' => null, 'error' => 'Il file caricato non e un PDF valido.'];
            }
        } elseif (@getimagesize($file->getTempName()) === false) {
            return ['ok' => false, 'url' => null, 'error' => 'Il file caricato non è un\'immagine valida.'];
        }

        if ($file->getSizeByUnit('kb') > $this->maxPosterKb) {
            return ['ok' => false, 'url' => null, 'error' => 'Locandina troppo grande (massimo 10 MB).'];
        }

        $newName = bin2hex(random_bytes(16)) . '.' . $this->allowedPosterMimes[$mime];

        $subDir     = trim($subDir, '/');
        $targetPath = rtrim(FCPATH . 'uploads/' . $subDir, '/');

        $file->move($targetPath, $newName);

        $url = '/uploads/' . ($subDir !== '' ? $subDir . '/' : '') . $newName;

        return ['ok' => true, 'url' => $url, 'error' => null];
    }
}
