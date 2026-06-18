<?php

namespace App\Controllers\Api\Concerns;

use CodeIgniter\HTTP\Files\UploadedFile;

/**
 * Shared, hardened image-upload handling for the API controllers.
 *
 * Replaces the previous pattern of trusting getRandomName() (which keeps the
 * client-supplied extension) with strict server-side content validation and a
 * server-derived, allow-listed extension. This prevents uploading executable
 * files (e.g. a .php web shell) into the web-served uploads directory.
 */
trait HandlesImageUploads
{
    /** Allowed image MIME types mapped to the canonical extension we store. */
    protected array $allowedImageMimes = [
        'image/jpeg' => 'jpg',
        'image/png'  => 'png',
        'image/webp' => 'webp',
        'image/gif'  => 'gif',
    ];

    /** Maximum accepted image size, in kilobytes. */
    protected int $maxImageKb = 5120; // 5 MB

    /**
     * Validate an uploaded image and move it under FCPATH/uploads/$subDir.
     *
     * When no file was supplied this is a no-op success (uploads are optional on
     * most endpoints). Callers that require a file should treat a null `url`
     * with `ok === true` as "no image provided".
     *
     * @return array{ok: bool, url: string|null, error: string|null}
     */
    protected function storeUploadedImage(?UploadedFile $file, string $subDir = ''): array
    {
        if ($file === null || $file->getError() === UPLOAD_ERR_NO_FILE) {
            return ['ok' => true, 'url' => null, 'error' => null];
        }

        if (! $file->isValid() || $file->hasMoved()) {
            return ['ok' => false, 'url' => null, 'error' => $file->getErrorString()];
        }

        // Server-side content type (finfo on the real file), never the client header.
        $mime = $file->getMimeType();
        if (! isset($this->allowedImageMimes[$mime])) {
            return ['ok' => false, 'url' => null, 'error' => 'Tipo di file non consentito. Sono ammesse solo immagini JPEG, PNG, WebP o GIF.'];
        }

        // Confirm the bytes really are a decodable image.
        if (@getimagesize($file->getTempName()) === false) {
            return ['ok' => false, 'url' => null, 'error' => 'Il file caricato non è un\'immagine valida.'];
        }

        if ($file->getSizeByUnit('kb') > $this->maxImageKb) {
            return ['ok' => false, 'url' => null, 'error' => 'Immagine troppo grande (massimo 5 MB).'];
        }

        $extension = $this->allowedImageMimes[$mime];
        $newName   = bin2hex(random_bytes(16)) . '.' . $extension;

        $subDir     = trim($subDir, '/');
        $targetPath = rtrim(FCPATH . 'uploads/' . $subDir, '/');

        $file->move($targetPath, $newName);

        $url = '/uploads/' . ($subDir !== '' ? $subDir . '/' : '') . $newName;

        return ['ok' => true, 'url' => $url, 'error' => null];
    }
}
