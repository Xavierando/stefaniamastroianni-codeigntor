<?php

namespace App\Database\Migrations;

use CodeIgniter\Database\Migration;

/**
 * Locandina facoltativa dell'evento (PDF o immagine), scaricabile dal sito.
 * NULL = nessuna locandina.
 */
class AddPosterToEvents extends Migration
{
    public function up()
    {
        $this->forge->addColumn('events', [
            'posterUrl' => [
                'type'       => 'VARCHAR',
                'constraint' => 255,
                'null'       => true,
                'after'      => 'imagePosition',
            ],
        ]);
    }

    public function down()
    {
        $this->forge->dropColumn('events', 'posterUrl');
    }
}
