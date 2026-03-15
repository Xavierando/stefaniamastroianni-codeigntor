<?php

namespace App\Controllers\Api;

use CodeIgniter\RESTful\ResourceController;
use App\Models\ServiceOfferingModel;

class ServiceController extends ResourceController
{
    protected $modelName = ServiceOfferingModel::class;
    protected $format    = 'json';

    public function index()
    {
        $category = $this->request->getGet('category');
        $isEvent = $this->request->getGet('isEvent');
        $limit = $this->request->getGet('limit');

        if ($category !== null && $category !== '') {
            $this->model->where('category', $category);
        }
        if ($isEvent !== null && $isEvent !== '') {
            $this->model->where('isEvent', $isEvent);
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
            $data = json_decode($this->request->getBody(), true);
        }

        if ($this->model->insert($data)) {
            return $this->respondCreated(['success' => true, 'data' => $data]);
        }

        return $this->failValidationErrors($this->model->errors());
    }

    public function update($id = null)
    {
        $data = $this->request->getRawInput();
        if (empty($data)) {
            $data = json_decode($this->request->getBody(), true);
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
