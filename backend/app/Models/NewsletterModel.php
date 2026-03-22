<?php

namespace App\Models;

use CodeIgniter\Model;

class NewsletterModel extends Model
{
    protected $table            = 'newsletters';
    protected $primaryKey       = 'id';
    protected $useAutoIncrement = true;
    protected $returnType       = 'array';
    protected $useSoftDeletes   = false;
    protected $protectFields    = true;
    protected $allowedFields    = [
        'subject',
        'content',
        'status',
        'total_subscribers',
        'sent_count',
        'last_sent_sequence_id'
    ];

    // Dates
    protected $useTimestamps = true;
    protected $dateFormat    = 'datetime';
    protected $createdField  = 'created_at';
    protected $updatedField  = 'updated_at';
}
