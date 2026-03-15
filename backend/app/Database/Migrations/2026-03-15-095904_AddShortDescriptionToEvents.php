<?php

namespace App\Database\Migrations;

use CodeIgniter\Database\Migration;

class AddShortDescriptionToEvents extends Migration
{
    public function up()
    {
        $this->forge->addColumn('events', [
            'shortDescription' => [
                'type' => 'TEXT',
                'null' => true,
                'after' => 'description'
            ]
        ]);
    }

    public function down()
    {
        $this->forge->dropColumn('events', 'shortDescription');
    }
}
