<?php

namespace App\Controllers\Api;

use CodeIgniter\RESTful\ResourceController;
use App\Models\EventModel;

class EventController extends ResourceController
{
    protected $modelName = EventModel::class;
    protected $format    = 'json';

    public function index()
    {
        $category = $this->request->getGet('category');
        $limit = $this->request->getGet('limit');

        if ($category !== null && $category !== '') {
            $this->model->where('category', $category);
        }

        $this->model->orderBy('date', 'ASC');

        if ($limit !== null && is_numeric($limit)) {
            return $this->respond($this->model->findAll((int)$limit));
        }

        return $this->respond($this->model->findAll());
    }

    public function show($id = null)
    {
        $event = $this->model->find($id);
        if (!$event) {
            // fallback to slug search
            $event = $this->model->where('slug', $id)->first();
        }

        if ($event) {
            return $this->respond($event);
        }

        return $this->failNotFound('Event not found');
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

        $image = $this->request->getFile('image');
        if ($image && $image->isValid() && !$image->hasMoved()) {
            $newName = $image->getRandomName();
            $image->move(FCPATH . 'uploads/events', $newName);
            $data['imageUrl'] = '/uploads/events/' . $newName;
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

        $image = $this->request->getFile('image');
        if ($image && $image->isValid() && !$image->hasMoved()) {
            $newName = $image->getRandomName();
            $image->move(FCPATH . 'uploads/events', $newName);
            $data['imageUrl'] = '/uploads/events/' . $newName;
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

        return $this->failNotFound('Event not found');
    }
}
