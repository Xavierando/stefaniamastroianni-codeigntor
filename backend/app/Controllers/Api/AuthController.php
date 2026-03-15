<?php

namespace App\Controllers\Api;

use CodeIgniter\RESTful\ResourceController;

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

        $envUsername = getenv('ADMIN_USERNAME');
        $envPassword = getenv('ADMIN_PASSWORD');

        if ($username === $envUsername && $password === $envPassword) {
            // Generate a simple mock token for now. In a real production app we'd use a real JWT library
            $token = base64_encode(json_encode(['user' => $username, 'exp' => time() + 3600 * 24]));
            
            return $this->respond([
                'status' => 'success',
                'message' => 'Login successful',
                'token' => $token
            ]);
        }

        return $this->failUnauthorized('Credenziali non valide');
    }
}
