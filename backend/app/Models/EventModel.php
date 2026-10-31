<?php

namespace App\Models;

use CodeIgniter\Model;

class EventModel extends Model
{
    protected $table            = 'events';
    protected $primaryKey       = 'id';
    protected $useAutoIncrement = true;
    protected $returnType       = 'array';
    protected $useSoftDeletes   = false;
    protected $protectFields    = true;
    protected $allowedFields    = [
        'title', 'description', 'shortDescription', 'slug', 'category', 'date', 
        'location', 'price', 'imageUrl', 'imagePosition', 'duration', 'max_capacity',
        'is_booking_enabled', 'recurrence_interval_days', 'recurrence_end_date', 'posterUrl'
    ];

    protected bool $allowEmptyInserts = false;

    // Dates
    protected $useTimestamps = true;
    protected $dateFormat    = 'datetime';
    protected $createdField  = 'createdAt';
    protected $updatedField  = 'updatedAt';

    /**
     * Per un evento ricorrente sostituisce `date` con la prossima occorrenza
     * (quella in corso finche non e iniziata), senza superare la data di fine:
     * a serie conclusa resta l'ultima occorrenza, cosi l'evento risulta passato.
     * La prima data della serie resta in `series_start` (serve al form admin).
     * Gli eventi singoli tornano invariati, con `is_recurring` = false.
     */
    public static function resolveOccurrence(array $event, ?\DateTimeInterface $now = null): array
    {
        $interval = (int) ($event['recurrence_interval_days'] ?? 0);
        $event['series_start'] = $event['date'] ?? null;
        $event['is_recurring'] = $interval > 0 && !empty($event['date']);

        if (!$event['is_recurring']) {
            return $event;
        }

        $now   = $now ? \DateTimeImmutable::createFromInterface($now) : new \DateTimeImmutable();
        $start = new \DateTimeImmutable($event['date']);
        $end   = !empty($event['recurrence_end_date'])
            ? new \DateTimeImmutable($event['recurrence_end_date'] . ' 23:59:59')
            : null;

        $occurrence = $start;
        if ($occurrence < $now) {
            // Salti di N giorni con modify(), che mantiene l'orario anche a cavallo
            // del cambio ora legale.
            $daysElapsed = (int) $start->setTime(0, 0)->diff($now->setTime(0, 0))->days;
            $steps       = intdiv($daysElapsed, $interval);
            $occurrence  = $start->modify('+' . ($steps * $interval) . ' days');
            if ($occurrence < $now) {
                $occurrence = $occurrence->modify("+{$interval} days");
            }
        }

        if ($end !== null && $occurrence > $end) {
            $occurrence = $start;
            if ($end > $start) {
                $totalDays  = (int) $start->setTime(0, 0)->diff($end->setTime(0, 0))->days;
                $occurrence = $start->modify('+' . (intdiv($totalDays, $interval) * $interval) . ' days');
            }
        }

        $event['date'] = $occurrence->format('Y-m-d H:i:s');

        return $event;
    }
}
