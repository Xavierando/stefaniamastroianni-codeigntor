<?php

namespace App\Controllers\Api;

use CodeIgniter\RESTful\ResourceController;
use App\Models\BookingModel;
use App\Models\BookingSettingsModel;
use App\Models\ServiceModel;
use App\Libraries\GoogleCalendarLibrary;
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
                                 ->where('status', 'confirmed')
                                 ->findAll();

        $dPart = substr($dateStr, 0, 10);
        
        // Fetch busy slots from Google Calendar
        $busySlots = [];
        if ($this->googleLibrary->isConnected()) {
            $busySlots = $this->googleLibrary->getFreeBusy(
                "{$dPart}T{$startTimeStr}:00Z", 
                "{$dPart}T{$endTimeStr}:00Z"
            );
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
            
            // Capacity check
            $max = (int)($event['max_capacity'] ?? 0);
            if ($max > 0) {
                $count = $this->model->where('event_id', $eventId)
                                     ->where('status', 'confirmed')
                                     ->countAllResults();
                if ($count >= $max) {
                    return $this->fail('Questo evento è al completo. Non è possibile accettare altre prenotazioni.');
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
            'status'          => 'confirmed'
        ];

        // 1. Save to DB
        $bookingId = $this->model->insert($bookingData);
        if (!$bookingId) {
            return $this->fail('Failed to save booking');
        }

        $booking = $this->model->find($bookingId);

        // 2. Add to Google Calendar
        if ($this->googleLibrary->isConnected()) {
            $eventIdGoogle = $this->googleLibrary->createEvent([
                'summary'      => "Booking: {$title} - {$booking['name']}",
                'description'  => "Client: {$booking['name']}\nEmail: {$booking['email']}\nPhone: {$booking['phone']}\nItem: {$title}\n\nClient sees: {$startTime->format('H:i')} - {$endTime->format('H:i')}\nAdmin blocked: {$startTime->format('H:i')} - {$blockedEndTime->format('H:i')}",
                'start'        => $startTime->format(DateTime::RFC3339),
                'end'          => $blockedEndTime->format(DateTime::RFC3339),
                'client_email' => $booking['email']
            ]);
            
            $this->model->update($bookingId, ['google_event_id' => $eventIdGoogle]);
        }

        // 3. Send Emails
        $this->sendConfirmationEmails($booking, $title, $startTime, $endTime);

        return $this->respondCreated(['success' => true, 'booking_id' => $bookingId]);
    }

    protected function sendConfirmationEmails($booking, $title, $startTime, $endTime)
    {
        $email = \Config\Services::email();
        $settings = $this->settingsModel->getAllSettings();
        
        $cancelLink = site_url("api/bookings/cancel/{$booking['cancellation_token']}");
        
        $message = "Ciao {$booking['name']},\n\n";
        $message .= "La tua prenotazione per '{$title}' è confermata.\n";
        $message .= "Data: " . $startTime->format('d/m/Y') . "\n";
        $message .= "Ora: " . $startTime->format('H:i') . " - " . $endTime->format('H:i') . "\n\n";
        $message .= "Puoi cancellare la prenotazione cliccando qui (fino a {$settings['cancellation_limit_days']} giorni prima): {$cancelLink}\n";
        
        // Final email system implementation will use HTML templates

        // Email to user
        $email->setTo($booking['email']);
        $email->setSubject("Conferma Prenotazione - Stefania Mastroianni");
        $email->setMessage($message);
        $email->send();

        // Email to admin
        $adminEmail = config('Email')->fromEmail;
        $email->setTo($adminEmail);
        $email->setSubject("Nuova Prenotazione: {$booking['name']} - {$title}");
        $email->setMessage("Nuova prenotazione ricevuta:\n\n" . $message);
        $email->send();
    }

    /**
     * GET /api/bookings/cancel/{token}
     */
    public function cancel($token = null)
    {
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
        $this->model->update($booking['id'], ['status' => 'cancelled']);

        // 2. Remove from Google Calendar
        if ($booking['google_event_id'] && $this->googleLibrary->isConnected()) {
            $this->googleLibrary->deleteEvent($booking['google_event_id']);
        }

        // 3. Send Notification to Admin
        $email = \Config\Services::email();
        $adminEmail = config('Email')->fromEmail;
        $email->setTo($adminEmail);
        $email->setSubject("Prenotazione Cancellata: {$booking['name']}");
        $email->setMessage("La prenotazione di {$booking['name']} per il " . $startTime->format('d/m/Y H:i') . " è stata cancellata dal cliente.");
        $email->send();

        return $this->respond(['success' => true, 'message' => 'Booking cancelled successfully']);
    }
}
