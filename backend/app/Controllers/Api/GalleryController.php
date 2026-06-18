<?php

namespace App\Controllers\Api;

use CodeIgniter\RESTful\ResourceController;
use App\Models\GalleryImageModel;
use App\Controllers\Api\Concerns\HandlesImageUploads;

class GalleryController extends ResourceController
{
    use HandlesImageUploads;

    protected $modelName = GalleryImageModel::class;
    protected $format    = 'json';

    public function index()
    {
        $limit = $this->request->getGet('limit');

        $this->model->orderBy('createdAt', 'DESC');

        if ($limit !== null && is_numeric($limit)) {
            return $this->respond($this->model->findAll((int)$limit));
        }

        return $this->respond($this->model->findAll());
    }

    public function create()
    {
        $file = $this->request->getFile('image');
        $alt  = $this->request->getPost('alt') ?? '';

        $upload = $this->storeUploadedImage($file);
        if (!$upload['ok']) {
            return $this->failValidationErrors(['image' => $upload['error']]);
        }
        if ($upload['url'] === null) {
            return $this->failValidationErrors(['image' => 'Invalid or missing image file.']);
        }

        $data = [
            'url' => $upload['url'],
            'alt' => $alt
        ];

        if ($this->model->insert($data)) {
            return $this->respondCreated(['success' => true, 'data' => $data]);
        }

        return $this->failValidationErrors($this->model->errors());
    }

    public function delete($id = null)
    {
        $image = $this->model->find($id);
        if (!$image) {
            return $this->failNotFound('Image not found');
        }

        // Delete from filesystem
        $filename = basename($image['url']);
        $filePath = FCPATH . 'uploads/' . $filename;
        if (file_exists($filePath)) {
            unlink($filePath);
        }

        if ($this->model->delete($id)) {
            return $this->respondDeleted(['success' => true]);
        }

        return $this->failNotFound('Error deleting image');
    }
}
