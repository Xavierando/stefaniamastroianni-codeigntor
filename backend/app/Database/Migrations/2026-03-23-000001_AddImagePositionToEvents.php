<?php

namespace App\Database\Migrations;

use CodeIgniter\Database\Migration;

class AddImagePositionToEvents extends Migration
{
    public function up()
    {
        $this->forge->addColumn('events', [
            'imagePosition' => [
                'type' => 'ENUM',
                'constraint' => ['alto', 'centrato', 'basso'],
                'default' => 'centrato',
                'after' => 'imageUrl'
            ]
        ]);
    }

    public function down()
    {
        $this->forge->dropColumn('events', 'imagePosition');
    }
}