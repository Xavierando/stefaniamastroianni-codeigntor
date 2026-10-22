<?php

namespace App\Controllers\Api;

use CodeIgniter\RESTful\ResourceController;
use App\Models\EventModel;
use App\Models\BookingModel;
use App\Controllers\Api\Concerns\HandlesImageUploads;
use App\Controllers\Api\Concerns\GeneratesSlug;

class EventController extends ResourceController
{
    use HandlesImageUploads;
    use GeneratesSlug;

    protected $modelName = EventModel::class;
    protected $format = 'json';

    public function index()
    {
        $category = $this->request->getGet('category');
        $limit = $this->request->getGet('limit');
        $upcoming = $this->request->getGet('upcoming');

        if ($category !== null && $category !== '') {
            $this->model->where('category', $category);
        }

        // Il sito pubblico chiede ?upcoming=1 per non mostrare eventi scaduti.
        // La soglia parte da 3 giorni fa cosi un evento non sparisce mentre e
        // ancora in corso; gli eventi senza data ("Da definire") restano, e
        // cosi le serie ricorrenti non ancora concluse.
        // L'admin non passa il parametro e continua a vedere tutto.
        if ($upcoming !== null && $upcoming !== '' && $upcoming !== '0') {
            $this->model->groupStart()
                ->where('date >=', date('Y-m-d H:i:s', strtotime('-3 days')))
                ->orWhere('date', null)
                ->orGroupStart()
                    ->where('recurrence_interval_days >', 0)
                    ->groupStart()
                        ->where('recurrence_end_date >=', date('Y-m-d'))
                        ->orWhere('recurrence_end_date', null)
                    ->groupEnd()
                ->groupEnd()
            ->groupEnd();
        }

        $events = array_map(
            fn ($event) => $this->withBookingStatus(EventModel::resolveOccurrence($event)),
            $this->model->findAll()
        );

        // Ordinamento e limite dopo aver risolto le ricorrenze: la data utile di
        // una serie e la prossima occorrenza, non la prima. Senza data in testa,
        // come faceva l'ORDER BY di MySQL.
        usort($events, static function ($a, $b) {
            if ($a['date'] === null || $b['date'] === null) {
                return ($a['date'] === null ? 0 : 1) - ($b['date'] === null ? 0 : 1);
            }
            return strcmp($a['date'], $b['date']);
        });

        if ($limit !== null && is_numeric($limit)) {
            $events = array_slice($events, 0, (int) $limit);
        }

        return $this->respond($events);
    }

    public function show($id = null)
    {
        $event = $this->model->find($id);
        if (!$event) {
            // fallback to slug search
            $event = $this->model->where('slug', $id)->first();
        }

        if ($event) {
            return $this->respond($this->withBookingStatus(EventModel::resolveOccurrence($event)));
        }

        return $this->failNotFound('Event not found');
    }

    /**
     * Posti e stato dell'evento. Per le serie ricorrenti conta solo le
     * prenotazioni della prossima occorrenza (stesso start_time).
     */
    private function withBookingStatus(array $event): array
    {
        $bookingModel = new BookingModel();
        // Pending bookings only hold capacity for a limited window (mirrors BookingController).
        $pendingCutoff = date('Y-m-d H:i:s', time() - 30 * 60);

        $scoped = function () use ($bookingModel, $event) {
            $bookingModel->where('event_id', $event['id']);
            if ($event['is_recurring']) {
                $bookingModel->where('start_time', $event['date']);
            }
            return $bookingModel;
        };

        $confirmedCount = $scoped()->where('status', 'confirmed')->countAllResults();
        $pendingCount = $scoped()->where('status', 'pending')
            ->where('created_at >=', $pendingCutoff)
            ->countAllResults();

        $max = (int) ($event['max_capacity'] ?? 0);
        $event['is_full'] = ($max > 0 && ($confirmedCount + $pendingCount) >= $max);
        $event['remaining_capacity'] = $max > 0 ? max(0, $max - $confirmedCount - $pendingCount) : null;
        $event['bookings_count'] = $confirmedCount; // Keep this for backward compatibility if needed, though mostly using the fields above
        $event['is_past'] = (new \DateTime($event['date'])) < (new \DateTime());

        return $event;
    }

    public function create()
    {
        $data = $this->request->getPost();
        if (empty($data)) {
            $data = json_decode($this->request->getBody(), true) ?? [];
        }

        if (empty($data['title'])) {
            return $this->failValidationErrors(['title' => 'Title is required']);
        }

        $recurrenceError = $this->normalizeRecurrence($data);
        if ($recurrenceError !== null) {
            return $this->failValidationErrors(['recurrence_end_date' => $recurrenceError]);
        }

        $data['slug'] = $this->uniqueSlug($this->model, $data['title']);

        $upload = $this->storeUploadedImage($this->request->getFile('image'), 'events');
        if (!$upload['ok']) {
            return $this->failValidationErrors(['image' => $upload['error']]);
        }
        if ($upload['url'] !== null) {
            $data['imageUrl'] = $upload['url'];
        }

        if ($this->model->insert($data)) {
            return $this->respondCreated(['success' => true, 'data' => $data]);
        }

        return $this->failValidationErrors($this->model->errors());
    }

    public function update($id = null)
    {
        $data = $this->request->getPost(); // Support multipart form data with _method=PUT from frontend
        if (empty($data)) {
            $data = $this->request->getRawInput();
        }
        if (empty($data)) {
            $data = json_decode($this->request->getBody(), true) ?? [];
        }

        $recurrenceError = $this->normalizeRecurrence($data);
        if ($recurrenceError !== null) {
            return $this->failValidationErrors(['recurrence_end_date' => $recurrenceError]);
        }

        if (isset($data['title'])) {
            $data['slug'] = $this->uniqueSlug($this->model, $data['title'], $id);
        }

        $upload = $this->storeUploadedImage($this->request->getFile('image'), 'events');
        if (!$upload['ok']) {
            return $this->failValidationErrors(['image' => $upload['error']]);
        }
        if ($upload['url'] !== null) {
            $data['imageUrl'] = $upload['url'];
        }

        if ($this->model->update($id, $data)) {
            return $this->respond(['success' => true]);
        }

        return $this->failValidationErrors($this->model->errors());
    }

    public function delete($id = null)
    {
        if ($this->model->delete($id)) {
            return $this->respondDeleted(['success' => true]);
        }

        return $this->failNotFound('Event not found');
    }

    /**
     * I campi vuoti del form diventano NULL (evento singolo). Una serie
     * ricorrente richiede la data di fine, non precedente alla prima data.
     */
    private function normalizeRecurrence(array &$data): ?string
    {
        if (!array_key_exists('recurrence_interval_days', $data)) {
            return null;
        }

        $interval = (int) $data['recurrence_interval_days'];
        if ($interval <= 0) {
            $data['recurrence_interval_days'] = null;
            $data['recurrence_end_date'] = null;
            return null;
        }

        $data['recurrence_interval_days'] = $interval;
        $end = trim((string) ($data['recurrence_end_date'] ?? ''));
        if ($end === '') {
            return 'Indica la data di fine della ricorrenza.';
        }
        if (!empty($data['date']) && $end < substr($data['date'], 0, 10)) {
            return 'La data di fine ricorrenza non puo precedere la prima data.';
        }
        $data['recurrence_end_date'] = $end;

        return null;
    }
}
