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

        $expectedToken = getenv('MIGRATION_TOKEN') ?: (env('MIGRATION_TOKEN') ?: null);

        // Fail closed: no hardcoded fallback. If no token is configured on the
        // server the endpoint is disabled rather than protected by a guessable secret.
        if (empty($expectedToken)) {
            log_message('error', '[Migration] MIGRATION_TOKEN is not configured; refusing to run.');
            return $this->failForbidden('Migrations are disabled.');
        }

        // Constant-time comparison to avoid timing side-channels.
        if (!is_string($token) || !hash_equals($expectedToken, $token)) {
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
            // Log internally; do not leak schema/DB details to the client.
            log_message('error', '[Migration] failed: ' . $e->getMessage());
            return $this->failServerError('Migration failed.');
        }
    }
}
