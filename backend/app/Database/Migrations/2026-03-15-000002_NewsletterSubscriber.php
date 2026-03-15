<?php

namespace App\Database\Migrations;

use CodeIgniter\Database\Migration;

class NewsletterSubscriber extends Migration
{
    public function up()
    {
        $this->forge->addField([
            'id' => [
                'type'       => 'VARCHAR',
                'constraint' => '255',
            ],
            'email' => [
                'type'       => 'VARCHAR',
                'constraint' => '255',
                'unique'     => true,
            ],
            'createdAt' => [
                'type' => 'DATETIME',
                'null' => true,
            ],
        ]);
        $this->forge->addKey('id', true);
        $this->forge->createTable('NewsletterSubscriber');
    }

    public function down()
    {
        $this->forge->dropTable('NewsletterSubscriber');
    }
}
