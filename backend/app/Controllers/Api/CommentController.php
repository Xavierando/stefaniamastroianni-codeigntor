<?php

namespace App\Controllers\Api;

use CodeIgniter\RESTful\ResourceController;
use App\Models\CommentModel;

class CommentController extends ResourceController
{
    protected $modelName = CommentModel::class;
    protected $format    = 'json';

    public function index()
    {
        $postId = $this->request->getGet('postId');
        $status = $this->request->getGet('status'); // 'approved', 'pending', or 'all'

        if ($postId !== null && $postId !== '') {
            $this->model->where('postId', $postId);
        }

        if ($status === 'approved') {
            $this->model->where('isApproved', 1);
        } else if ($status === 'pending') {
            $this->model->where('isApproved', 0);
        }

        $this->model->orderBy('createdAt', 'DESC');

        return $this->respond($this->model->findAll());
    }

    public function create()
    {
        $data = json_decode($this->request->getBody(), true);
        if (empty($data)) {
            $data = $this->request->getPost();
        }

        if (empty($data['postId']) || empty($data['name']) || empty($data['message'])) {
            return $this->failValidationErrors(['error' => 'PostId, Name and Message are required']);
        }

        // By default, comments are not approved
        $data['isApproved'] = 0;

        if ($this->model->insert($data)) {
            return $this->respondCreated(['success' => true, 'message' => 'Comment submitted and awaiting approval']);
        }

        return $this->failValidationErrors($this->model->errors());
    }

    public function update($id = null)
    {
        $data = json_decode($this->request->getBody(), true);
        if (empty($data)) {
            $data = $this->request->getRawInput();
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

        return $this->failNotFound('Comment not found');
    }
}
