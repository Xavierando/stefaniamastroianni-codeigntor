<?php

namespace App\Database\Migrations;

use CodeIgniter\Database\Migration;

class AddMaxCapacityToEventsMigration extends Migration
{
    public function up()
    {
        $this->forge->addColumn('events', [
            'max_capacity' => [
                'type'       => 'INT',
                'constraint' => 11,
                'null'       => true,
                'after'      => 'duration',
            ],
        ]);
    }

    public function down()
    {
        $this->forge->dropColumn('events', 'max_capacity');
    }
}
