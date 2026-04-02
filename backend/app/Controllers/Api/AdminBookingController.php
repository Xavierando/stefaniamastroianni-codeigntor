<?php

namespace App\Controllers\Api;

use CodeIgniter\RESTful\ResourceController;
use App\Models\BookingModel;
use App\Models\BookingSettingsModel;
use App\Libraries\GoogleCalendarLibrary;

class AdminBookingController extends ResourceController
{
    protected $modelName = BookingModel::class;
    protected $format    = 'json';
    protected $settingsModel;
    protected $googleLibrary;

    public function __construct()
    {
        $this->settingsModel = new BookingSettingsModel();
        $this->googleLibrary = new GoogleCalendarLibrary();
    }

    /**
     * GET /api/admin/bookings
     */
    public function index()
    {
        $bookings = $this->model->orderBy('start_time', 'DESC')->findAll();
        return $this->respond($bookings);
    }

    /**
     * GET /api/admin/bookings/settings
     */
    public function getSettings()
    {
        $settings = $this->settingsModel->getAllSettings();
        $settings['google_is_connected'] = $this->googleLibrary->isConnected();
        
        // Provide defaults for workdays
        foreach (['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'] as $day) {
            $key = "workday_{$day}";
            if (!isset($settings[$key])) {
                $settings[$key] = 1;
            }
        }

        // Hide sensitive token from response if needed, although it's admin only
        unset($settings['google_oauth_token']);
        
        return $this->respond($settings);
    }

    /**
     * POST /api/admin/bookings/settings
     */
    public function updateSettings()
    {
        $data = $this->request->getPost();
        if (empty($data)) {
            $data = json_decode($this->request->getBody(), true) ?? [];
        }

        foreach ($data as $key => $value) {
            // Only allow updating known settings
            if (in_array($key, [
                'booking_start_offset_days', 'daily_start_time', 
                'daily_end_time', 'buffer_time', 'cancellation_limit_days', 
                'google_calendar_id', 'workday_mon', 'workday_tue', 
                'workday_wed', 'workday_thu', 'workday_fri', 
                'workday_sat', 'workday_sun'
            ])) {
                $this->settingsModel->setSetting($key, $value);
            }
        }

        return $this->respond(['success' => true]);
    }

    /**
     * GET /api/admin/bookings/google-auth
     */
    public function getGoogleAuthUrl()
    {
        try {
            return $this->respond(['url' => $this->googleLibrary->getAuthUrl()]);
        } catch (\Exception $e) {
            return $this->fail('Google configuration missing or invalid: ' . $e->getMessage(), 400);
        }
    }

    /**
     * GET /api/admin/bookings/google-callback?code=...
     */
    public function googleCallback()
    {
        $code = $this->request->getGet('code');
        if (!$code) {
            return $this->fail('No code provided');
        }

        try {
            $this->googleLibrary->authenticate($code);
            // Redirect back to admin dashboard booking settings
            return redirect()->to(env('FRONTEND_URL', 'http://localhost:5173') . '/admin/bookings?auth_success=1');
        } catch (\Exception $e) {
            return $this->fail('Authentication failed: ' . $e->getMessage());
        }
    }
}
