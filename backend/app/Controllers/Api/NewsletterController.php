<?php

namespace App\Controllers\Api;

use CodeIgniter\RESTful\ResourceController;
use App\Models\NewsletterSubscriberModel;

class NewsletterController extends ResourceController
{
    protected $modelName = NewsletterSubscriberModel::class;
    protected $format    = 'json';

    public function index()
    {
        return $this->respond($this->model->orderBy('createdAt', 'DESC')->findAll());
    }

    public function create()
    {
        $data = $this->request->getPost();
        if (empty($data)) {
            $data = json_decode($this->request->getBody(), true);
        }

        // Check if exists
        $existing = $this->model->where('email', $data['email'] ?? '')->first();
        if ($existing) {
            return $this->failResourceExists('Email already subscribed');
        }

        if ($this->model->insert($data)) {
            return $this->respondCreated(['success' => true, 'data' => $data]);
        }

        return $this->failValidationErrors($this->model->errors());
    }

    public function delete($id = null)
    {
        if ($this->model->delete($id)) {
            return $this->respondDeleted(['success' => true]);
        }

        return $this->failNotFound('Subscriber not found');
    }
}
