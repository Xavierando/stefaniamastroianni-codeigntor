<?php

namespace App\Controllers\Api;

use CodeIgniter\RESTful\ResourceController;
use App\Libraries\AuthTokens;

class AuthController extends ResourceController
{
    protected $format = 'json';

    public function login()
    {
        $rules = [
            'username' => 'required',
            'password' => 'required'
        ];

        if (!$this->validate($rules)) {
            return $this->failValidationErrors($this->validator->getErrors());
        }

        $username = $this->request->getVar('username');
        $password = $this->request->getVar('password');

        $envUsername = $_ENV['ADMIN_USERNAME'] ?? getenv('ADMIN_USERNAME') ?: 'admin';
        $envPassword = $_ENV['ADMIN_PASSWORD'] ?? getenv('ADMIN_PASSWORD') ?: 'admin';

        if (hash_equals($envUsername, $username) && hash_equals($envPassword, $password)) {
            // Signed, expiring token (HMAC-SHA256). See App\Libraries\AuthTokens.
            $token = AuthTokens::issue($username);

            return $this->respond([
                'status' => 'success',
                'message' => 'Login successful',
                'token' => $token
            ]);
        }

        return $this->failUnauthorized('Credenziali non valide');
    }
}
