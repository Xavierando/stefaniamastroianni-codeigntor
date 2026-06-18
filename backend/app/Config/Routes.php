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

    /* -----------------------------------------------------------------
     * PUBLIC routes (no auth) — reads for the public site + public form
     * submissions. Mutations and private data are protected below.
     * ----------------------------------------------------------------- */

    // Public content reads
    $routes->get('services', 'ServiceController::index');
    $routes->get('services/(:segment)', 'ServiceController::show/$1');
    $routes->get('events', 'EventController::index');
    $routes->get('events/(:segment)', 'EventController::show/$1');
    $routes->get('reviews', 'ReviewController::index');
    $routes->get('reviews/(:segment)', 'ReviewController::show/$1');
    $routes->get('posts', 'PostController::index');
    $routes->get('posts/(:segment)', 'PostController::show/$1');
    $routes->get('gallery', 'GalleryController::index');

    // Public comments: list approved + submit (submissions default to unapproved)
    $routes->get('comments', 'CommentController::index');
    $routes->post('comments', 'CommentController::create');

    // Public contact form submission
    $routes->post('contacts', 'ContactController::create');

    // Public newsletter: subscribe + unsubscribe (by unguessable random token)
    $routes->post('newsletter', 'NewsletterController::create');
    $routes->delete('newsletter/(:segment)', 'NewsletterController::delete/$1');

    // Booking System (public; sensitive actions are guarded by per-booking tokens)
    $routes->get('bookings/available-slots', 'BookingController::availableSlots');
    $routes->get('bookings/settings', 'BookingController::getPublicSettings');
    $routes->post('bookings', 'BookingController::create');
    $routes->get('bookings/details/(:segment)', 'BookingController::getByToken/$1');
    $routes->post('bookings/confirm/(:segment)', 'BookingController::confirm/$1');
    $routes->get('bookings/cancel-details/(:segment)', 'BookingController::getByCancellationToken/$1');
    $routes->match(['get', 'post'], 'bookings/cancel/(:segment)', 'BookingController::cancel/$1');

    // Google OAuth callback: reached via a browser redirect from Google (no
    // Bearer header), so it stays public and is guarded by the OAuth code exchange.
    $routes->get('admin/bookings/google-callback', 'AdminBookingController::googleCallback');

    /* -----------------------------------------------------------------
     * PROTECTED routes — require a valid admin Bearer token (AuthFilter).
     * ----------------------------------------------------------------- */
    $routes->group('', ['filter' => 'auth'], static function ($routes) {
        // Services
        $routes->post('services', 'ServiceController::create');
        $routes->post('services/(:segment)', 'ServiceController::update/$1');
        $routes->delete('services/(:segment)', 'ServiceController::delete/$1');

        // Events
        $routes->post('events', 'EventController::create');
        $routes->post('events/(:segment)', 'EventController::update/$1');
        $routes->delete('events/(:segment)', 'EventController::delete/$1');

        // Reviews
        $routes->post('reviews', 'ReviewController::create');
        $routes->post('reviews/(:segment)', 'ReviewController::update/$1');
        $routes->delete('reviews/(:segment)', 'ReviewController::delete/$1');

        // Blog posts
        $routes->post('posts', 'PostController::create');
        $routes->post('posts/(:segment)', 'PostController::update/$1');
        $routes->delete('posts/(:segment)', 'PostController::delete/$1');

        // Gallery
        $routes->post('gallery', 'GalleryController::create');
        $routes->delete('gallery/(:segment)', 'GalleryController::delete/$1');

        // Comment moderation
        $routes->put('comments/(:segment)', 'CommentController::update/$1');
        $routes->delete('comments/(:segment)', 'CommentController::delete/$1');

        // Contact submissions (private)
        $routes->get('contacts', 'ContactController::index');
        $routes->put('contacts/(:segment)', 'ContactController::update/$1');
        $routes->delete('contacts/(:segment)', 'ContactController::delete/$1');

        // Newsletter subscriber list (private PII)
        $routes->get('newsletter', 'NewsletterController::index');
    });

    // Admin Newsletter & Subscribers + Admin Booking System (auth required)
    $routes->group('admin', ['filter' => 'auth'], static function ($routes) {
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
        $routes->post('bookings/reject/(:num)', 'AdminBookingController::reject/$1');
    });

    // Migrations (guarded by its own MIGRATION_TOKEN secret, used by deploy tooling)
    $routes->post('migrations/run', 'MigrationController::run');
});
