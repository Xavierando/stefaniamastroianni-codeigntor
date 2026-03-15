<?php

namespace App\Database\Seeds;

use CodeIgniter\Database\Seeder;

class MainSeeder extends Seeder
{
    public function run()
    {
        $faker = \Faker\Factory::create('it_IT');
        
        $categories = ['YOGA', 'MATERNITA', 'TRATTAMENTI', 'CONSULENZE'];

        // Seeding Services & Events (ServiceOffering table)
        for ($i = 0; $i < 20; $i++) {
            $isEvent = $faker->boolean(30); // 30% chance is event
            
            $data = [
                'id' => $faker->uuid,
                'title' => $faker->sentence(3),
                'slug' => $faker->slug(),
                'description' => $faker->paragraph(3),
                'category' => $faker->randomElement($categories),
                'duration' => $isEvent ? null : $faker->randomElement(['60', '90', '120']),
                'price' => $isEvent ? null : $faker->randomFloat(2, 40, 150),
                'isEvent' => $isEvent,
                'eventDate' => $isEvent ? date('Y-m-d H:i:s', strtotime('+' . rand(1, 60) . ' days')) : null,
                'eventLocation' => $isEvent ? $faker->address : null,
                'isFull' => $isEvent ? $faker->boolean(20) : false,
                'imageUrl' => null,
                'createdAt' => date('Y-m-d H:i:s'),
                'updatedAt' => date('Y-m-d H:i:s'),
            ];

            // Specific default images based on category
            if ($data['category'] === 'YOGA') $data['imageUrl'] = '/images/yoga/Pratiche-di-Yoga.webp';
            elseif ($data['category'] === 'MATERNITA') $data['imageUrl'] = '/images/maternita/Servizi-maternita-2.webp';
            elseif ($data['category'] === 'TRATTAMENTI') $data['imageUrl'] = '/images/trattamenti/trattamenti-olistici-1.webp';
            elseif ($data['category'] === 'CONSULENZE') $data['imageUrl'] = '/images/consulenze/consulenze-2.webp';
            
            if ($isEvent) $data['imageUrl'] = '/images/eventi/intermediate-workshop-featured.webp';

            $this->db->table('ServiceOffering')->insert($data);
        }

        // Seeding Reviews (Review table)
        for ($i = 0; $i < 15; $i++) {
            $data = [
                'id' => $faker->uuid,
                'name' => $faker->name,
                'description' => $faker->paragraph(2),
                'category' => $faker->randomElement($categories),
                'imageUrl' => null,
                'createdAt' => date('Y-m-d H:i:s'),
            ];
            $this->db->table('Review')->insert($data);
        }

        // Seeding Newsletters (NewsletterSubscriber table)
        for ($i = 0; $i < 10; $i++) {
            $data = [
                'id' => $faker->uuid,
                'email' => $faker->unique()->safeEmail,
                'createdAt' => date('Y-m-d H:i:s'),
            ];
            $this->db->table('NewsletterSubscriber')->insert($data);
        }

        // Seeding Contacts (ContactSubmission table)
        for ($i = 0; $i < 10; $i++) {
            $data = [
                'id' => $faker->uuid,
                'name' => $faker->name,
                'email' => $faker->safeEmail,
                'message' => $faker->paragraph(4),
                'read' => $faker->boolean(50),
                'createdAt' => date('Y-m-d H:i:s'),
            ];
            $this->db->table('ContactSubmission')->insert($data);
        }
    }
}
