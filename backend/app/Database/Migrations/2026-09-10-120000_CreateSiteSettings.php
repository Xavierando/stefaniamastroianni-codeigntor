<?php

namespace App\Database\Migrations;

use CodeIgniter\Database\Migration;

class CreateSiteSettings extends Migration
{
    public function up()
    {
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
        $this->forge->createTable('site_settings');

        // Valori iniziali allineati al comportamento attuale del sito, cosi il
        // deploy della migrazione non cambia nulla per chi visita le pagine.
        $now = date('Y-m-d H:i:s');
        $this->db->table('site_settings')->insertBatch([
            ['setting_key' => 'whatsapp_enabled', 'setting_value' => '1', 'updated_at' => $now],
            ['setting_key' => 'whatsapp_handle', 'setting_value' => 'xprot', 'updated_at' => $now],
        ]);
    }

    public function down()
    {
        $this->forge->dropTable('site_settings');
    }
}
