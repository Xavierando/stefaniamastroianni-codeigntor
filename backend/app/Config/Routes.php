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
    $routes->post('events/(:segment)', 'EventController::update/$1');
    $routes->resource('events', ['controller' => 'EventController']);
    $routes->post('reviews/(:segment)', 'ReviewController::update/$1');
    $routes->resource('reviews', ['controller' => 'ReviewController']);
    $routes->resource('gallery', ['controller' => 'GalleryController', 'only' => ['index', 'create', 'delete']]);
    
    // Booking System
    $routes->get('bookings/available-slots', 'BookingController::availableSlots');
    $routes->get('bookings/settings', 'BookingController::getPublicSettings');
    $routes->post('bookings', 'BookingController::create');
    $routes->get('bookings/cancel/(:segment)', 'BookingController::cancel/$1');

    // Blog feature
    $routes->post('posts/(:segment)', 'PostController::update/$1');
    $routes->resource('posts', ['controller' => 'PostController']);
    $routes->resource('comments', ['controller' => 'CommentController']);

    // Admin Newsletter & Subscribers
    $routes->group('admin', static function ($routes) {
        $routes->get('subscribers', 'AdminNewsletterController::getSubscribers');
        $routes->delete('subscribers/(:segment)', 'AdminNewsletterController::deleteSubscriber/$1');

        $routes->get('newsletters', 'AdminNewsletterController::getNewsletters');
        $routes->get('newsletters/(:num)', 'AdminNewsletterController::getNewsletter/$1');
        $routes->post('newsletters', 'AdminNewsletterController::createNewsletter');
        $routes->put('newsletters/(:num)', 'AdminNewsletterController::updateNewsletter/$1');
        $routes->delete('newsletters/(:num)', 'AdminNewsletterController::deleteNewsletter/$1');

        $routes->post('newsletters/start_sending/(:num)', 'AdminNewsletterController::startSending/$1');
        $routes->post('newsletters/send_next/(:num)', 'AdminNewsletterController::sendNext/$1');
        $routes->post('newsletters/test_send/(:num)', 'AdminNewsletterController::testSend/$1');

        // Admin Booking System
        $routes->get('bookings', 'AdminBookingController::index');
        $routes->get('bookings/settings', 'AdminBookingController::getSettings');
        $routes->post('bookings/settings', 'AdminBookingController::updateSettings');
        $routes->get('bookings/google-auth', 'AdminBookingController::getGoogleAuthUrl');
        $routes->get('bookings/google-callback', 'AdminBookingController::googleCallback');
    });

    // Migrations
    $routes->post('migrations/run', 'MigrationController::run');
});
