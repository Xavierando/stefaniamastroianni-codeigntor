<?php

namespace App\Database\Migrations;

use CodeIgniter\Database\Migration;

/**
 * Eventi ricorrenti: `date` resta la prima data della serie, l'intervallo in
 * giorni e la data di fine definiscono le ripetizioni. Intervallo NULL = evento
 * singolo (comportamento di prima).
 */
class AddRecurrenceToEvents extends Migration
{
    public function up()
    {
        $this->forge->addColumn('events', [
            'recurrence_interval_days' => [
                'type'       => 'INT',
                'constraint' => 11,
                'unsigned'   => true,
                'null'       => true,
                'after'      => 'date',
            ],
            'recurrence_end_date' => [
                'type'  => 'DATE',
                'null'  => true,
                'after' => 'recurrence_interval_days',
            ],
        ]);
    }

    public function down()
    {
        $this->forge->dropColumn('events', ['recurrence_interval_days', 'recurrence_end_date']);
    }
}
