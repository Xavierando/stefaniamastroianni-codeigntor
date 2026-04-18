<?php

namespace App\Models;

use CodeIgniter\Model;

class BookingModel extends Model
{
    protected $table            = 'bookings';
    protected $primaryKey       = 'id';
    protected $useAutoIncrement = true;
    protected $returnType       = 'array';
    protected $useSoftDeletes   = false;
    protected $protectFields    = true;
    protected $allowedFields    = [
        'service_id', 'event_id', 'name', 'email', 'phone', 
        'start_time', 'end_time', 'google_event_id', 
        'status', 'cancellation_token', 'confirmation_token', 'notes'
    ];

    // Dates
    protected $useTimestamps = true;
    protected $dateFormat    = 'datetime';
    protected $createdField  = 'created_at';
    protected $updatedField  = 'updated_at';
    protected $deletedField  = '';

    // Callbacks
    protected $allowCallbacks = true;
    protected $beforeInsert   = ['generateRegistrationTokens'];

    protected function generateRegistrationTokens(array $data)
    {
        if (!isset($data['data']['cancellation_token'])) {
            $data['data']['cancellation_token'] = bin2hex(random_bytes(32));
        }
        if (!isset($data['data']['confirmation_token'])) {
            $data['data']['confirmation_token'] = bin2hex(random_bytes(32));
        }
        return $data;
    }
}
