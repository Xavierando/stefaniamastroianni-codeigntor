<?php

namespace App\Database\Migrations;

use CodeIgniter\Database\Migration;

class ContactSubmission extends Migration
{
    public function up()
    {
        $this->forge->addField([
            'id' => [
                'type'       => 'VARCHAR',
                'constraint' => '255',
            ],
            'name' => [
                'type'       => 'VARCHAR',
                'constraint' => '255',
            ],
            'email' => [
                'type'       => 'VARCHAR',
                'constraint' => '255',
            ],
            'message' => [
                'type' => 'TEXT',
            ],
            'read' => [
                'type' => 'BOOLEAN',
                'default' => false,
            ],
            'createdAt' => [
                'type' => 'DATETIME',
                'null' => true,
            ],
        ]);
        $this->forge->addKey('id', true);
        $this->forge->createTable('ContactSubmission');
    }

    public function down()
    {
        $this->forge->dropTable('ContactSubmission');
    }
}
