<?php

namespace App\Database\Migrations;

use CodeIgniter\Database\Migration;

class GalleryImage extends Migration
{
    public function up()
    {
        $this->forge->addField([
            'id' => [
                'type'       => 'VARCHAR',
                'constraint' => '255',
            ],
            'url' => [
                'type'       => 'VARCHAR',
                'constraint' => '255',
            ],
            'alt' => [
                'type'       => 'VARCHAR',
                'constraint' => '255',
                'null'       => true,
            ],
            'createdAt' => [
                'type' => 'DATETIME',
                'null' => true,
            ],
        ]);
        $this->forge->addKey('id', true);
        $this->forge->createTable('GalleryImage');
    }

    public function down()
    {
        $this->forge->dropTable('GalleryImage');
    }
}
