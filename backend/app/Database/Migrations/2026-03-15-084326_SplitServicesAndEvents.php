<?php

namespace App\Database\Migrations;

use CodeIgniter\Database\Migration;

class SplitServicesAndEvents extends Migration
{
    public function up()
    {
        // 1. Create the `events` table based on `service_offerings` structure
        $this->forge->addField([
            'id' => [
                'type'           => 'INT',
                'constraint'     => 11,
                'unsigned'       => true,
                'auto_increment' => true,
            ],
            'title' => [
                'type'       => 'VARCHAR',
                'constraint' => '255',
            ],
            'description' => [
                'type' => 'TEXT',
            ],
            'slug' => [
                'type'       => 'VARCHAR',
                'constraint' => '255',
                'unique'     => true,
            ],
            'category' => [
                'type'       => 'VARCHAR',
                'constraint' => '100',
            ],
            'date' => [
                'type' => 'DATETIME',
                'null' => true,
            ],
            'location' => [
                'type'       => 'VARCHAR',
                'constraint' => '255',
                'null'       => true,
            ],
            'price' => [
                'type'       => 'DECIMAL',
                'constraint' => '10,2',
                'null'       => true,
            ],
            'imageUrl' => [
                'type'       => 'VARCHAR',
                'constraint' => '255',
                'null'       => true,
            ],
            'createdAt' => [
                'type' => 'DATETIME',
                'null' => true,
            ],
            'updatedAt' => [
                'type' => 'DATETIME',
                'null' => true,
            ],
        ]);
        $this->forge->addKey('id', true);
        $this->forge->createTable('events');

        // 2. Migrate existing event data from `ServiceOffering` to `events`
        $db = \Config\Database::connect();
        $builder = $db->table('ServiceOffering');
        $eventsToMigrate = $builder->where('isEvent', 1)->get()->getResultArray();

        if (!empty($eventsToMigrate)) {
            $eventBuilder = $db->table('events');
            foreach ($eventsToMigrate as $event) {
                // Map the old columns to the new columns
                $eventData = [
                    'id'          => $event['id'],
                    'title'       => $event['title'],
                    'description' => $event['description'],
                    'slug'        => $event['slug'],
                    'category'    => $event['category'],
                    'date'        => $event['eventDate'], // map old eventDate to new date
                    'location'    => $event['eventLocation'],
                    'price'       => $event['price'],
                    'imageUrl'    => $event['imageUrl'],
                    'createdAt'   => $event['createdAt'],
                    'updatedAt'   => $event['updatedAt'],
                ];
                $eventBuilder->insert($eventData);
            }

            // 3. Delete the migrated records from `service_offerings`
            $builder->where('isEvent', 1)->delete();
        }

        // 4. Drop the event-specific columns from `ServiceOffering`
        $this->forge->dropColumn('ServiceOffering', ['isEvent', 'eventDate', 'eventLocation', 'isFull']);
        
        // 5. Rename table from `ServiceOffering` to `services`
        $this->forge->renameTable('ServiceOffering', 'services');
    }

    public function down()
    {
        // 1. Rename table back from `services` to `ServiceOffering`
        $this->forge->renameTable('services', 'ServiceOffering');

        // 2. Add back the dropped columns to `ServiceOffering`
        $this->forge->addColumn('ServiceOffering', [
            'isEvent' => [
                'type'       => 'TINYINT',
                'constraint' => 1,
                'default'    => 0,
            ],
            'eventDate' => [
                'type' => 'DATETIME',
                'null' => true,
            ],
            'eventLocation' => [
                'type'       => 'VARCHAR',
                'constraint' => '255',
                'null'       => true,
            ],
            'isFull' => [
                'type' => 'BOOLEAN',
                'default' => false,
            ],
        ]);

        // 3. Migrate data from `events` back to `ServiceOffering`
        $db = \Config\Database::connect();
        $eventBuilder = $db->table('events');
        $eventsToRevert = $eventBuilder->get()->getResultArray();

        if (!empty($eventsToRevert)) {
            $builder = $db->table('ServiceOffering');
            foreach ($eventsToRevert as $event) {
                $serviceData = [
                    'id'            => $event['id'],
                    'title'         => $event['title'],
                    'description'   => $event['description'],
                    'slug'          => $event['slug'],
                    'category'      => $event['category'],
                    'isEvent'       => 1,
                    'eventDate'     => $event['date'], // map back
                    'eventLocation' => $event['location'],
                    'isFull'        => 0,
                    'price'         => $event['price'],
                    'imageUrl'      => $event['imageUrl'],
                    'createdAt'     => $event['createdAt'],
                    'updatedAt'     => $event['updatedAt'],
                ];
                $builder->insert($serviceData);
            }
        }

        // 4. Drop the `events` table
        $this->forge->dropTable('events');
    }
}
