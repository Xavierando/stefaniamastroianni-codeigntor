<?php

namespace App\Controllers\Api;

use CodeIgniter\RESTful\ResourceController;
use App\Models\ContactSubmissionModel;

class ContactController extends ResourceController
{
    protected $modelName = ContactSubmissionModel::class;
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
        $data = is_array($data) ? $data : [];

        // Whitelist client-settable fields: a submitter must not be able to set
        // id or the admin-only `read` flag (mass assignment).
        $clean = [
            'name'    => trim((string) ($data['name'] ?? '')),
            'email'   => trim((string) ($data['email'] ?? '')),
            'message' => trim((string) ($data['message'] ?? '')),
        ];

        if ($clean['name'] === '' || $clean['email'] === '' || $clean['message'] === '') {
            return $this->failValidationErrors(['error' => 'Nome, email e messaggio sono obbligatori.']);
        }
        if (!filter_var($clean['email'], FILTER_VALIDATE_EMAIL)) {
            return $this->failValidationErrors(['email' => 'Indirizzo email non valido.']);
        }

        if ($this->model->insert($clean)) {
            return $this->respondCreated(['success' => true]);
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

        return $this->failNotFound('Contact not found');
    }
}
