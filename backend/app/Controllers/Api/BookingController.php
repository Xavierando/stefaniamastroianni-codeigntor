<?php

namespace App\Controllers\Api;

use CodeIgniter\RESTful\ResourceController;
use App\Models\BookingModel;
use App\Models\BookingSettingsModel;
use App\Models\ServiceModel;
use App\Models\EventModel;
use App\Libraries\GoogleCalendarLibrary;
use App\Libraries\Emails\BookingVerificationEmail;
use App\Libraries\Emails\BookingConfirmationEmail;
use App\Libraries\Emails\BookingCancellationEmail;
use DateTime;
use DateInterval;

class BookingController extends ResourceController
{
    protected $modelName = BookingModel::class;
    protected $format    = 'json';
    protected $settingsModel;
    protected $serviceModel;
    protected $eventModel;
    protected $googleLibrary;

    public function __construct()
    {
        $this->settingsModel = new BookingSettingsModel();
        $this->serviceModel = new ServiceModel();
        $this->eventModel = new \App\Models\EventModel();
        $this->googleLibrary = new GoogleCalendarLibrary();
    }

    /**
     * GET /api/bookings/available-slots?service_id=X&date=YYYY-MM-DD
     */
    public function getPublicSettings()
    {
        $settings = $this->settingsModel->getAllSettings();
        return $this->respond([
            'booking_start_offset_days' => (int)($settings['booking_start_offset_days'] ?? 2),
            'daily_start_time' => $settings['daily_start_time'] ?? '09:00',
            'daily_end_time' => $settings['daily_end_time'] ?? '18:00',
            'workday_mon' => (int)($settings['workday_mon'] ?? 1),
            'workday_tue' => (int)($settings['workday_tue'] ?? 1),
            'workday_wed' => (int)($settings['workday_wed'] ?? 1),
            'workday_thu' => (int)($settings['workday_thu'] ?? 1),
            'workday_fri' => (int)($settings['workday_fri'] ?? 1),
            'workday_sat' => (int)($settings['workday_sat'] ?? 1),
            'workday_sun' => (int)($settings['workday_sun'] ?? 1),
        ]);
    }

    /**
     * GET /api/bookings/available-slots?service_id=X&date=YYYY-MM-DD
     */
    public function availableSlots()
    {
        $serviceId = $this->request->getGet('service_id');
        $eventId = $this->request->getGet('event_id');
        $dateStr = $this->request->getGet('date');

        if ($eventId) {
            $event = $this->eventModel->find($eventId);
            if (!$event) return $this->failNotFound('Event not found');
            
            $eDate = new DateTime($event['date']);
            $duration = (int)($event['duration'] ?? 60);
            $eEnd = (clone $eDate)->add(new DateInterval("PT{$duration}M"));

            return $this->respond(['slots' => [[
                'start' => $eDate->format('H:i'),
                'end'   => $eEnd->format('H:i'),
                'date'  => $eDate->format('Y-m-d')
            ]]]);
        }

        if (!$serviceId || !$dateStr) {
            return $this->fail('Service ID and Date are required');
        }

        $service = $this->serviceModel->find($serviceId);
        if (!$service) {
            return $this->failNotFound('Service not found');
        }

        $settings = $this->settingsModel->getAllSettings();

        // Check if the weekday is available
        $dayOfWeek = (new DateTime($dateStr))->format('N'); // 1 (Mon) to 7 (Sun)
        $dayMap = [
            1 => 'workday_mon', 2 => 'workday_tue', 3 => 'workday_wed', 
            4 => 'workday_thu', 5 => 'workday_fri', 6 => 'workday_sat', 7 => 'workday_sun'
        ];
        $isAvailable = (int)($settings[$dayMap[$dayOfWeek]] ?? 1);
        if (!$isAvailable) {
            return $this->respond(['slots' => [], 'message' => "Servizio non disponibile in questo giorno della settimana"]);
        }

        $duration = (int)($service['duration'] ?? 60);
        
        $offsetDays = (int)($settings['booking_start_offset_days'] ?? 2);
        $minDate = (new DateTime())->add(new DateInterval("P{$offsetDays}D"))->format('Y-m-d');

        if ($dateStr < $minDate) {
            return $this->respond(['slots' => [], 'message' => "Bookings only available from {$minDate}"]);
        }

        $startTimeStr = $settings['daily_start_time'] ?? '09:00';
        $endTimeStr = $settings['daily_end_time'] ?? '18:00';
        $buffer = (int)($settings['buffer_time'] ?? 15);

        // Fetch existing bookings from DB for this day
        $dbBookings = $this->model->where('DATE(start_time)', $dateStr)
                                 ->whereIn('status', ['confirmed', 'pending'])
                                 ->findAll();

        $dPart = substr($dateStr, 0, 10);
        
        // Fetch busy slots from Google Calendar
        $busySlots = [];
        if ($this->googleLibrary->isConnected()) {
            try {
                $tz = new \DateTimeZone('Europe/Rome');
                $startObj = new DateTime("{$dPart} {$startTimeStr}", $tz);
                $endObj = new DateTime("{$dPart} {$endTimeStr}", $tz);

                $busySlots = $this->googleLibrary->getFreeBusy(
                    $startObj->format(DateTime::RFC3339), 
                    $endObj->format(DateTime::RFC3339)
                );
            } catch (\Exception $e) {
                log_message('error', '[BookingController] Error fetching free/busy: ' . $e->getMessage());
                // Continue with empty busy slots rather than failing the whole request
                $busySlots = [];
            }
        }

        $availableSlots = [];
        $current = new DateTime("{$dPart} {$startTimeStr}");
        $endDay = new DateTime("{$dPart} {$endTimeStr}");

        while ($current < $endDay) {
            $slotStart = clone $current;
            $slotEnd = (clone $current)->add(new DateInterval("PT{$duration}M"));
            
            // The "actual" blocked time for the admin
            $blockedEnd = (clone $slotEnd)->add(new DateInterval("PT{$buffer}M"));

            if ($slotEnd > $endDay) {
                break;
            }

            $isBusy = false;

            // Check against DB bookings
            foreach ($dbBookings as $b) {
                $bStart = new DateTime($b['start_time']);
                $bEnd = new DateTime($b['end_time']);
                // Overlap check: max(start1, start2) < min(end1, end2)
                if (max($slotStart->getTimestamp(), $bStart->getTimestamp()) < min($blockedEnd->getTimestamp(), $bEnd->getTimestamp())) {
                    $isBusy = true;
                    break;
                }
            }

            // Check against Google Calendar busy slots
            if (!$isBusy) {
                foreach ($busySlots as $busy) {
                    $busyStart = new DateTime($busy->getStart());
                    $busyEnd = new DateTime($busy->getEnd());
                    if (max($slotStart->getTimestamp(), $busyStart->getTimestamp()) < min($blockedEnd->getTimestamp(), $busyEnd->getTimestamp())) {
                        $isBusy = true;
                        break;
                    }
                }
            }

            if (!$isBusy) {
                $availableSlots[] = [
                    'start' => $slotStart->format('H:i'),
                    'end'   => $slotEnd->format('H:i')
                ];
            }

            // Increment by 30 mins to offer more choices, or by duration+buffer if you want strictly consecutive
            // Let's use 30 mins interval for better UX unless requested otherwise
            $current->add(new DateInterval("PT30M"));
        }

        return $this->respond(['slots' => $availableSlots]);
    }

    /**
     * POST /api/bookings
     */
    public function create()
    {
        $data = $this->request->getPost();
        if (empty($data)) {
            $data = json_decode($this->request->getBody(), true) ?? [];
        }

        $rules = [
            'name'       => 'required',
            'email'      => 'required|valid_email',
            'date'       => 'required',
            'time'       => 'required'
        ];

        if (!$this->validate($rules)) {
            return $this->failValidationErrors($this->validator->getErrors());
        }

        $serviceId = $data['service_id'] ?? null;
        $eventId = $data['event_id'] ?? null;

        if (!$serviceId && !$eventId) {
            return $this->fail('Service ID or Event ID is required');
        }

        $title = "";
        $duration = 60;
        if ($serviceId) {
            $service = $this->serviceModel->find($serviceId);
            $title = $service['title'];
            $duration = (int)($service['duration'] ?? 60);
        } else {
            $event = $this->eventModel->find($eventId);
            
            // Past event check
            if (new \DateTime($event['date']) < new \DateTime()) {
                return $this->fail('Questo evento è già passato. Non è possibile effettuare prenotazioni.');
            }
            
            // Capacity check (including pending to avoid overbooking)
            $max = (int)($event['max_capacity'] ?? 0);
            if ($max > 0) {
                $count = $this->model->where('event_id', $eventId)
                                     ->whereIn('status', ['confirmed', 'pending'])
                                     ->countAllResults();
                if ($count >= $max) {
                    return $this->fail('Questo evento è al completo. Non è possibile accettare altre prenotazioni (alcune richieste sono in attesa di conferma).');
                }
            }

            $title = $event['title'];
            $duration = (int)($event['duration'] ?? 60);
        }

        $settings = $this->settingsModel->getAllSettings();
        $buffer = (int)($settings['buffer_time'] ?? 15);

        $datePart = substr($data['date'], 0, 10);
        $startTime = new DateTime("{$datePart} {$data['time']}");
        $endTime = (clone $startTime)->add(new DateInterval("PT{$duration}M"));
        
        // This is the end time we store and block in the calendar
        $blockedEndTime = (clone $endTime)->add(new DateInterval("PT{$buffer}M"));

        $bookingData = [
            'service_id'      => $serviceId,
            'event_id'        => $eventId,
            'name'            => $data['name'],
            'email'           => $data['email'],
            'phone'           => $data['phone'] ?? null,
            'start_time'      => $startTime->format('Y-m-d H:i:s'),
            'end_time'        => $blockedEndTime->format('Y-m-d H:i:s'),
            'status'          => 'pending' // Start as pending
        ];

        // 1. Save to DB
        $bookingId = $this->model->insert($bookingData);
        if (!$bookingId) {
            return $this->fail('Failed to save booking');
        }

        $booking = $this->model->find($bookingId);

        // 2. Add to Google Calendar as "PENDING"
        if ($this->googleLibrary->isConnected()) {
            $tz = new \DateTimeZone('Europe/Rome');
            $startTime->setTimezone($tz);
            $blockedEndTime->setTimezone($tz);

            $eventIdGoogle = $this->googleLibrary->createEvent([
                'summary'      => "(IN ATTESA) {$title} - {$booking['name']}",
                'description'  => "Richiesta in attesa di conferma.\n\nClient: {$booking['name']}\nEmail: {$booking['email']}\nPhone: {$booking['phone']}\nItem: {$title}\n\nClient sees: {$startTime->format('H:i')} - {$endTime->format('H:i')}\nAdmin blocked: {$startTime->format('H:i')} - {$blockedEndTime->format('H:i')}",
                'start'        => $startTime->format(DateTime::RFC3339),
                'end'          => $blockedEndTime->format(DateTime::RFC3339),
                'client_email' => $booking['email']
            ]);
            
            if ($eventIdGoogle) {
                $this->model->update($bookingId, ['google_event_id' => $eventIdGoogle]);
            } else {
                log_message('error', "[BookingController] Failed to create Google event for booking $bookingId");
            }
        }

        // 3. Send Emails (Verification Request)
        $this->sendVerificationEmail($booking, $title, $startTime, $endTime);

        return $this->respondCreated(['success' => true, 'booking_id' => $bookingId]);
    }

    /**
     * GET /api/bookings/details/{token}
     */
    public function getByToken($token = null)
    {
        $booking = $this->model->where('confirmation_token', $token)->first();
        if (!$booking) {
            return $this->failNotFound('Prenotazione non trovata');
        }

        $title = "";
        if ($booking['service_id']) {
            $service = $this->serviceModel->find($booking['service_id']);
            $title = $service['title'];
        } else {
            $event = $this->eventModel->find($booking['event_id']);
            $title = $event['title'];
        }

        return $this->respond([
            'id'    => $booking['id'],
            'name'  => $booking['name'],
            'email' => $booking['email'],
            'title' => $title,
            'start' => $booking['start_time'],
            'status' => $booking['status']
        ]);
    }

    /**
     * POST /api/bookings/confirm/{token}
     */
    public function confirm($token = null)
    {
        $data = $this->request->getPost();
        if (empty($data)) {
            $data = json_decode($this->request->getBody(), true) ?? [];
        }

        $booking = $this->model->where('confirmation_token', $token)->first();
        if (!$booking) {
            return $this->failNotFound('Prenotazione non trovata');
        }

        if ($booking['status'] === 'confirmed') {
            return $this->respond(['success' => true, 'message' => 'Prenotazione già confermata']);
        }

        $notes = $data['notes'] ?? null;
        $title = "";
        if ($booking['service_id']) {
            $service = $this->serviceModel->find($booking['service_id']);
            $title = $service['title'];
        } else {
            $event = $this->eventModel->find($booking['event_id']);
            $title = $event['title'];
        }

        $startTime = new DateTime($booking['start_time']);
        $endTime = new DateTime($booking['end_time']); 
        // Note: end_time in DB includes buffer. For display we might want to subtract it or just use it.
        // Let's assume for now we just show the range.

        // 1. Update DB
        $this->model->update($booking['id'], [
            'status' => 'confirmed',
            'notes'  => $notes
        ]);

        // 2. Update Google Calendar
        if ($booking['google_event_id'] && $this->googleLibrary->isConnected()) {
            $this->googleLibrary->updateEvent($booking['google_event_id'], [
                'summary'     => "{$title} - {$booking['name']}",
                'description' => "CONFERMATA\nNote del cliente: " . ($notes ?? 'Nessuna') . "\n\nClient: {$booking['name']}\nEmail: {$booking['email']}\nPhone: {$booking['phone']}\nItem: {$title}"
            ]);
        }

        // 3. Send Confirmation Emails
        $this->sendConfirmationEmails($booking, $title, $startTime, $endTime);

        return $this->respond(['success' => true, 'message' => 'Prenotazione confermata con successo']);
    }

    protected function sendVerificationEmail($booking, $title, $startTime, $endTime)
    {
        $email = new BookingVerificationEmail();
        $email->sendVerification($booking, $title, $startTime);
    }

    protected function sendConfirmationEmails($booking, $title, $startTime, $endTime)
    {
        $settings = $this->settingsModel->getAllSettings();
        
        // Send to client
        $clientEmail = new BookingConfirmationEmail();
        $clientEmail->sendConfirmation($booking, $title, $startTime, $settings);
        
        // Notify admin
        $clientEmail->notifyAdmin($booking, $title, $startTime);
    }

    /**
     * GET /api/bookings/cancel-details/{token}
     */
    public function getByCancellationToken($token = null)
    {
        $booking = $this->model->where('cancellation_token', $token)->first();
        if (!$booking) {
            return $this->failNotFound('Prenotazione non trovata');
        }

        $title = "";
        if ($booking['service_id']) {
            $service = $this->serviceModel->find($booking['service_id']);
            $title = $service['title'];
        } else {
            $event = $this->eventModel->find($booking['event_id']);
            $title = $event['title'];
        }

        return $this->respond([
            'id'    => $booking['id'],
            'name'  => $booking['name'],
            'title' => $title,
            'start' => $booking['start_time'],
            'status' => $booking['status']
        ]);
    }

    /**
     * GET /api/bookings/cancel/{token}
     */
    public function cancel($token = null)
    {
        $data = $this->request->getPost();
        if (empty($data)) {
            $data = json_decode($this->request->getBody(), true) ?? [];
        }
        $notes = $data['notes'] ?? null;

        $booking = $this->model->where('cancellation_token', $token)->first();
        if (!$booking) {
            return $this->failNotFound('Booking not found');
        }

        if ($booking['status'] === 'cancelled') {
            return $this->respond(['message' => 'Booking already cancelled']);
        }

        $settings = $this->settingsModel->getAllSettings();
        $limitDays = (int)($settings['cancellation_limit_days'] ?? 2);
        
        $startTime = new DateTime($booking['start_time']);
        $now = new DateTime();
        $diff = $now->diff($startTime);

        if ($diff->invert || $diff->days < $limitDays) {
            return $this->fail('Cancellation time limit exceeded');
        }

        // 1. Update DB
        $updateData = ['status' => 'cancelled'];
        if ($notes) {
            $updateData['notes'] = $notes;
        }
        $this->model->update($booking['id'], $updateData);

        // 2. Remove from Google Calendar
        if ($booking['google_event_id'] && $this->googleLibrary->isConnected()) {
            $this->googleLibrary->deleteEvent($booking['google_event_id']);
        }

        // 3. Send Notification to Admin
        $title = "";
        if ($booking['service_id']) {
            $service = $this->serviceModel->find($booking['service_id']);
            $title = $service['title'];
        } else {
            $event = $this->eventModel->find($booking['event_id']);
            $title = $event['title'];
        }

        $email = new BookingCancellationEmail();
        $email->notifyAdmin($booking, $title, $startTime, $notes);
        $email->sendCancellationToClient($booking, $title, $startTime);

        return $this->respond(['success' => true, 'message' => 'Booking cancelled successfully']);
    }
}
