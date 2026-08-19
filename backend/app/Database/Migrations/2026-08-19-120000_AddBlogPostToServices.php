<?php

namespace App\Database\Migrations;

use CodeIgniter\Database\Migration;

class AddBlogPostToServices extends Migration
{
    public function up()
    {
        $this->forge->addColumn('services', [
            'blog_post_id' => [
                'type'       => 'INT',
                'constraint' => 11,
                'unsigned'   => true,
                'null'       => true,
                'after'      => 'is_booking_enabled',
            ],
        ]);
    }

    public function down()
    {
        $this->forge->dropColumn('services', 'blog_post_id');
    }
}
