<?php

namespace App\Controllers\Api;

use CodeIgniter\RESTful\ResourceController;

class MigrationController extends ResourceController
{
    protected $format = 'json';

    public function run()
    {
        // Require a secret token to prevent unauthorized access
        // It can be passed via header or json body
        $token = $this->request->getHeaderLine('X-Migration-Token') 
            ?: $this->request->getJsonVar('token');

        // You should configure a secure secret on the server or use an env variable
        $expectedToken = getenv('MIGRATION_TOKEN') ?: 'aruba_deploy_secret_2026';

        if ($token !== $expectedToken) {
            return $this->failUnauthorized('Invalid migration token.');
        }

        try {
            $migrate = \Config\Services::migrations();

            // Run all new migrations
            if ($migrate->latest()) {
                return $this->respond([
                    'success' => true,
                    'message' => 'Migrations run successfully.',
                ]);
            } else {
                return $this->respond([
                    'success' => true,
                    'message' => 'No new migrations to run.',
                ]);
            }
        } catch (\Throwable $e) {
            return $this->failServerError('Migration failed: ' . $e->getMessage());
        }
    }
}
