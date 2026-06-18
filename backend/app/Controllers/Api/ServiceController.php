<?php

namespace App\Controllers\Api;

use CodeIgniter\RESTful\ResourceController;
use App\Models\ServiceModel;
use App\Controllers\Api\Concerns\HandlesImageUploads;

class ServiceController extends ResourceController
{
    use HandlesImageUploads;

    protected $modelName = ServiceModel::class;
    protected $format    = 'json';

    public function index()
    {
        $category = $this->request->getGet('category');
        $limit = $this->request->getGet('limit');

        if ($category !== null && $category !== '') {
            $this->model->where('category', $category);
        }

        $this->model->orderBy('createdAt', 'DESC');

        if ($limit !== null && is_numeric($limit)) {
            return $this->respond($this->model->findAll((int)$limit));
        }

        return $this->respond($this->model->findAll());
    }

    public function show($id = null)
    {
        $service = $this->model->find($id);
        if (!$service) {
            // fallback to slug search
            $service = $this->model->where('slug', $id)->first();
        }

        if ($service) {
            return $this->respond($service);
        }

        return $this->failNotFound('Service not found');
    }

    public function create()
    {
        $data = $this->request->getPost();
        if (empty($data)) {
            $data = json_decode($this->request->getBody(), true) ?? [];
        }

        if (empty($data['title'])) {
            return $this->failValidationErrors(['title' => 'Title is required']);
        }

        $data['slug'] = strtolower(trim(preg_replace('/[^A-Za-z0-9-]+/', '-', $data['title'])));

        $upload = $this->storeUploadedImage($this->request->getFile('image'), 'services');
        if (!$upload['ok']) {
            return $this->failValidationErrors(['image' => $upload['error']]);
        }
        if ($upload['url'] !== null) {
            $data['imageUrl'] = $upload['url'];
        }

        if ($this->model->insert($data)) {
            return $this->respondCreated(['success' => true, 'data' => $data]);
        }

        return $this->failValidationErrors($this->model->errors());
    }

    public function update($id = null)
    {
        $data = $this->request->getPost(); // Support multipart form data with _method=PUT from frontend
        if (empty($data)) {
            $data = $this->request->getRawInput();
        }
        if (empty($data)) {
            $data = json_decode($this->request->getBody(), true) ?? [];
        }

        if (isset($data['title'])) {
            $data['slug'] = strtolower(trim(preg_replace('/[^A-Za-z0-9-]+/', '-', $data['title'])));
        }

        $upload = $this->storeUploadedImage($this->request->getFile('image'), 'services');
        if (!$upload['ok']) {
            return $this->failValidationErrors(['image' => $upload['error']]);
        }
        if ($upload['url'] !== null) {
            $data['imageUrl'] = $upload['url'];
        }

        if ($this->model->update($id, $data)) {
            return $this->respond(['success' => true]);
        }

        return $this->failValidationErrors($this->model->errors());
    }

    public function delete($id = null)
    {
        if ($this->model->delete($id)) {
            return $this->respondDeleted(['success' => true]);
        }

        return $this->failNotFound('Service not found');
    }
}
