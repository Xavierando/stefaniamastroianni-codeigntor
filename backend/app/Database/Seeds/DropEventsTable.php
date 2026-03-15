<?php

namespace App\Database\Seeds;

use CodeIgniter\Database\Seeder;

class DropEventsTable extends Seeder
{
    public function run()
    {
        $this->db->query("DROP TABLE IF EXISTS events");
    }
}
