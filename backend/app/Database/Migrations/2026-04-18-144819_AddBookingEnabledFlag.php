<?php

namespace App\Database\Migrations;

use CodeIgniter\Database\Migration;

class AddBookingEnabledFlag extends Migration
{
    public function up()
    {
        $fields = [
            'is_booking_enabled' => [
                'type'       => 'TINYINT',
                'constraint' => 1,
                'default'    => 1,
                'null'       => false,
            ],
        ];

        $this->forge->addColumn('events', $fields);
        $this->forge->addColumn('services', $fields);
    }

    public function down()
    {
        $this->forge->dropColumn('events', 'is_booking_enabled');
        $this->forge->dropColumn('services', 'is_booking_enabled');
    }
}
