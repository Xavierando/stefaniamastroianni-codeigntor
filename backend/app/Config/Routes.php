<?php

use CodeIgniter\Router\RouteCollection;

/**
 * @var RouteCollection $routes
 */
$routes->get('/', 'Home::index');

$routes->group('api', ['namespace' => 'App\Controllers\Api'], static function ($routes) {
    $routes->resource('contacts', ['controller' => 'ContactController']);
    $routes->resource('newsletter', ['controller' => 'NewsletterController', 'only' => ['index', 'create', 'delete']]);
    $routes->resource('services', ['controller' => 'ServiceController']);
    $routes->resource('reviews', ['controller' => 'ReviewController']);
    $routes->resource('gallery', ['controller' => 'GalleryController', 'only' => ['index', 'create', 'delete']]);
});
