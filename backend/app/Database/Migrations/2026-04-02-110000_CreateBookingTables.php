<?php

namespace App\Database\Migrations;

use CodeIgniter\Database\Migration;

class CreateBookingTables extends Migration
{
    public function up()
    {
        // 1. Create `booking_settings` table
        $this->forge->addField([
            'id' => [
                'type'           => 'INT',
                'constraint'     => 11,
                'unsigned'       => true,
                'auto_increment' => true,
            ],
            'setting_key' => [
                'type'       => 'VARCHAR',
                'constraint' => '50',
                'unique'     => true,
            ],
            'setting_value' => [
                'type' => 'TEXT',
                'null' => true,
            ],
            'updated_at' => [
                'type' => 'DATETIME',
                'null' => true,
            ],
        ]);
        $this->forge->addKey('id', true);
        $this->forge->createTable('booking_settings');

        // 2. Create `bookings` table
        $this->forge->addField([
            'id' => [
                'type'           => 'INT',
                'constraint'     => 11,
                'unsigned'       => true,
                'auto_increment' => true,
            ],
            'service_id' => [
                'type'       => 'VARCHAR',
                'constraint' => '255',
                'null'       => true,
            ],
            'name' => [
                'type'       => 'VARCHAR',
                'constraint' => '255',
            ],
            'email' => [
                'type'       => 'VARCHAR',
                'constraint' => '255',
            ],
            'phone' => [
                'type'       => 'VARCHAR',
                'constraint' => '20',
                'null'       => true,
            ],
            'start_time' => [
                'type' => 'DATETIME',
            ],
            'end_time' => [
                'type' => 'DATETIME',
            ],
            'google_event_id' => [
                'type'       => 'VARCHAR',
                'constraint' => '255',
                'null'       => true,
            ],
            'status' => [
                'type'       => 'ENUM',
                'constraint' => ['confirmed', 'cancelled'],
                'default'    => 'confirmed',
            ],
            'cancellation_token' => [
                'type'       => 'VARCHAR',
                'constraint' => '64',
                'null'       => true,
            ],
            'created_at' => [
                'type' => 'DATETIME',
                'null' => true,
            ],
            'updated_at' => [
                'type' => 'DATETIME',
                'null' => true,
            ],
        ]);
        $this->forge->addKey('id', true);
        $this->forge->createTable('bookings');

        // 3. Seed default settings
        $db = \Config\Database::connect();
        $builder = $db->table('booking_settings');
        $builder->insertBatch([
            ['setting_key' => 'booking_start_offset_days', 'setting_value' => '2'],
            ['setting_key' => 'daily_start_time', 'setting_value' => '09:00'],
            ['setting_key' => 'daily_end_time', 'setting_value' => '18:00'],
            ['setting_key' => 'buffer_time', 'setting_value' => '15'],
            ['setting_key' => 'cancellation_limit_days', 'setting_value' => '2'],
            ['setting_key' => 'google_calendar_id', 'setting_value' => 'primary'],
            ['setting_key' => 'google_oauth_token', 'setting_value' => null],
        ]);
    }

    public function down()
    {
        $this->forge->dropTable('bookings');
        $this->forge->dropTable('booking_settings');
    }
}
