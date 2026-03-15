<?php

namespace App\Controllers\Api;

use CodeIgniter\RESTful\ResourceController;
use App\Models\GalleryImageModel;

class GalleryController extends ResourceController
{
    protected $modelName = GalleryImageModel::class;
    protected $format    = 'json';

    public function index()
    {
        return $this->respond($this->model->orderBy('createdAt', 'DESC')->findAll());
    }

    public function create()
    {
        $file = $this->request->getFile('image');
        $alt  = $this->request->getPost('alt') ?? '';

        if (!$file || !$file->isValid()) {
            return $this->failValidationErrors(['image' => 'Invalid or missing image file.']);
        }

        if ($file->hasMoved() || !$file->isValid()) {
            return $this->failValidationErrors(['image' => $file->getErrorString()]);
        }

        $newName = $file->getRandomName();
        $file->move(FCPATH . 'uploads', $newName);

        $url = base_url('uploads/' . $newName);

        $data = [
            'url' => $url,
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
