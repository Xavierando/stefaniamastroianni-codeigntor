<?php

namespace App\Filters;

use App\Libraries\AuthTokens;
use CodeIgniter\Filters\FilterInterface;
use CodeIgniter\HTTP\RequestInterface;
use CodeIgniter\HTTP\ResponseInterface;
use Config\Services;

/**
 * Requires a valid signed admin token (Authorization: Bearer <token>) before
 * the request reaches the controller. Applied to admin/privileged routes in
 * Config\Routes.
 */
class AuthFilter implements FilterInterface
{
    public function before(RequestInterface $request, $arguments = null)
    {
        $header = trim($request->getHeaderLine('Authorization'));

        $token = null;
        if (preg_match('/^Bearer\s+(.+)$/i', $header, $matches)) {
            $token = trim($matches[1]);
        }

        if (AuthTokens::validate($token) === null) {
            return Services::response()
                ->setStatusCode(ResponseInterface::HTTP_UNAUTHORIZED)
                ->setJSON([
                    'status'  => ResponseInterface::HTTP_UNAUTHORIZED,
                    'error'   => ResponseInterface::HTTP_UNAUTHORIZED,
                    'message' => 'Autenticazione richiesta.',
                ]);
        }
    }

    public function after(RequestInterface $request, ResponseInterface $response, $arguments = null)
    {
        // No post-processing required.
    }
}
