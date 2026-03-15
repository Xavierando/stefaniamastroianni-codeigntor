<?php

namespace App\Controllers\Api;

use CodeIgniter\RESTful\ResourceController;
use App\Models\ReviewModel;

class ReviewController extends ResourceController
{
    protected $modelName = ReviewModel::class;
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
        $review = $this->model->find($id);
        if (!$review) {
            return $this->failNotFound('Review not found');
        }
        return $this->respond($review);
    }

    public function create()
    {
        $data = $this->request->getPost();
        if (empty($data)) {
            $data = json_decode($this->request->getBody(), true) ?? [];
        }

        if (empty($data['name']) || empty($data['description'])) {
            return $this->failValidationErrors(['name' => 'Name and description are required']);
        }

        $image = $this->request->getFile('image');
        if ($image && $image->isValid() && !$image->hasMoved()) {
            $newName = $image->getRandomName();
            $image->move(FCPATH . 'uploads/reviews', $newName);
            $data['imageUrl'] = '/uploads/reviews/' . $newName;
        }

        if ($this->model->insert($data)) {
            return $this->respondCreated(['success' => true, 'data' => $data]);
        }

        return $this->failValidationErrors($this->model->errors());
    }

    public function update($id = null)
    {
        $data = $this->request->getPost();
        if (empty($data)) {
            $data = $this->request->getRawInput();
        }
        if (empty($data)) {
            $data = json_decode($this->request->getBody(), true) ?? [];
        }

        $image = $this->request->getFile('image');
        if ($image && $image->isValid() && !$image->hasMoved()) {
            $newName = $image->getRandomName();
            $image->move(FCPATH . 'uploads/reviews', $newName);
            $data['imageUrl'] = '/uploads/reviews/' . $newName;
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

        return $this->failNotFound('Review not found');
    }
}
