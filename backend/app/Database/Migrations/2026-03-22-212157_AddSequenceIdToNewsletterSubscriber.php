<?php

namespace App\Database\Migrations;

use CodeIgniter\Database\Migration;

class AddSequenceIdToNewsletterSubscriber extends Migration
{
    public function up()
    {
        // Add an auto-increment sequence ID for sequential processing
        $this->forge->addColumn('NewsletterSubscriber', [
            'sequence_id' => [
                'type'           => 'INT',
                'constraint'     => 11,
                'unsigned'       => true,
                'auto_increment' => true,
                'unique'         => true,
            ],
        ]);
    }

    public function down()
    {
        $this->forge->dropColumn('NewsletterSubscriber', 'sequence_id');
    }
}
