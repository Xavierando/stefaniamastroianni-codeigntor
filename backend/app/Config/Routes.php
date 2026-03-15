<?php

use CodeIgniter\Router\RouteCollection;

/**
 * @var RouteCollection $routes
 */
$routes->get('/', 'Home::index');

$routes->group('api', ['namespace' => 'App\Controllers\Api'], static function ($routes) {
    // Handle CORS Preflight completely only in development
    if (ENVIRONMENT === 'development') {
        $routes->options('(:any)', static function () {
            return response()->setStatusCode(200);
        });
    }

    $routes->post('auth/login', 'AuthController::login');
    $routes->resource('contacts', ['controller' => 'ContactController']);
    $routes->resource('newsletter', ['controller' => 'NewsletterController', 'only' => ['index', 'create', 'delete']]);
    $routes->post('services/(:segment)', 'ServiceController::update/$1');
    $routes->resource('services', ['controller' => 'ServiceController']);
    $routes->post('reviews/(:segment)', 'ReviewController::update/$1');
    $routes->resource('reviews', ['controller' => 'ReviewController']);
    $routes->resource('gallery', ['controller' => 'GalleryController', 'only' => ['index', 'create', 'delete']]);
});
