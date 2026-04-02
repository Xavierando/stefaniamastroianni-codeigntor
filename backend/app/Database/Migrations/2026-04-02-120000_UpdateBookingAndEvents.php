<?php

namespace App\Database\Migrations;

use CodeIgniter\Database\Migration;

class UpdateBookingAndEvents extends Migration
{
    public function up()
    {
        // 1. Add `event_id` to `bookings` table
        $this->forge->addColumn('bookings', [
            'event_id' => [
                'type'       => 'INT',
                'constraint' => 11,
                'unsigned'   => true,
                'null'       => true,
                'after'      => 'service_id',
            ],
        ]);

        // 2. Add `duration` to `events` table
        $this->forge->addColumn('events', [
            'duration' => [
                'type'       => 'INT',
                'constraint' => 11,
                'null'       => true,
                'after'      => 'price',
            ],
        ]);
    }

    public function down()
    {
        $this->forge->dropColumn('bookings', 'event_id');
        $this->forge->dropColumn('events', 'duration');
    }
}
