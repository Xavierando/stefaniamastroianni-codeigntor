<?php

namespace App\Database\Migrations;

use CodeIgniter\Database\Migration;

class UpdateBookingsForConfirmation extends Migration
{
    public function up()
    {
        // 1. Add confirmation_token and notes columns
        $this->forge->addColumn('bookings', [
            'confirmation_token' => [
                'type'       => 'VARCHAR',
                'constraint' => '64',
                'null'       => true,
                'after'      => 'cancellation_token',
            ],
            'notes' => [
                'type' => 'TEXT',
                'null' => true,
                'after' => 'status',
            ],
        ]);

        // 2. Change status enum to include 'pending' and set as default
        // In CodeIgniter 4, we might need a manual query to change an ENUM column 
        // since modifyColumn syntax for ENUMs can be tricky.
        $this->db->query("ALTER TABLE `bookings` MODIFY COLUMN `status` ENUM('pending', 'confirmed', 'cancelled') DEFAULT 'pending'");
    }

    public function down()
    {
        $this->forge->dropColumn('bookings', 'confirmation_token');
        $this->forge->dropColumn('bookings', 'notes');
        
        // Revert status enum (be careful with existing data)
        $this->db->query("ALTER TABLE `bookings` MODIFY COLUMN `status` ENUM('confirmed', 'cancelled') DEFAULT 'confirmed'");
    }
}
