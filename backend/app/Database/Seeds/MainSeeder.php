<?php

namespace App\Database\Seeds;

use CodeIgniter\Database\Seeder;

class MainSeeder extends Seeder
{
    public function run()
    {
        // 1. SERVICES
        $services = [
            [
                'id' => uniqid('srv_'),
                'title' => 'Yoga in Gravidanza',
                'slug' => 'yoga-in-gravidanza',
                'description' => 'Un percorso dolce e consapevole per accompagnare la donna durante la gestazione, lavorando sul respiro, sulla flessibilità e sulla connessione profonda con il proprio bambino.',
                'category' => 'YOGA',
                'duration' => '60',
                'price' => '45.00',
                'imageUrl' => '/images/yoga/Pratiche-di-Yoga.webp',
                'createdAt' => date('Y-m-d H:i:s'),
                'updatedAt' => date('Y-m-d H:i:s'),
            ],
            [
                'id' => uniqid('srv_'),
                'title' => 'Massaggio Ayurvedico in Gravidanza',
                'slug' => 'massaggio-ayurvedico-gravidanza',
                'description' => 'Trattamento dolce, avvolgente e rilassante, specifico per alleviare le tensioni muscolari, migliorare la circolazione e donare un profondo senso di benessere alla futura mamma.',
                'category' => 'MATERNITA',
                'duration' => '90',
                'price' => '70.00',
                'imageUrl' => '/images/maternita/Servizi-maternita-2.webp',
                'createdAt' => date('Y-m-d H:i:s'),
                'updatedAt' => date('Y-m-d H:i:s'),
            ],
            [
                'id' => uniqid('srv_'),
                'title' => 'Trattamento Olistico Ribilanciante',
                'slug' => 'trattamento-olistico-ribilanciante',
                'description' => 'Un massaggio profondo che unisce diverse tecniche per sciogliere i blocchi fisici ed energetici, ripristinando l\'armonia tra corpo, mente e spirito.',
                'category' => 'TRATTAMENTI',
                'duration' => '60',
                'price' => '60.00',
                'imageUrl' => '/images/trattamenti/trattamenti-olistici-1.webp',
                'createdAt' => date('Y-m-d H:i:s'),
                'updatedAt' => date('Y-m-d H:i:s'),
            ],
            [
                'id' => uniqid('srv_'),
                'title' => 'Consulenza Fiori di Bach',
                'slug' => 'consulenza-fiori-di-bach',
                'description' => 'Colloquio individuale per individuare i rimedi floreali più adatti a supportare il riequilibrio emozionale e superare momenti di stress, ansia o cambiamento.',
                'category' => 'CONSULENZE',
                'duration' => '60',
                'price' => '50.00',
                'imageUrl' => '/images/consulenze/consulenze-2.webp',
                'createdAt' => date('Y-m-d H:i:s'),
                'updatedAt' => date('Y-m-d H:i:s'),
            ],
            [
                'id' => uniqid('srv_'),
                'title' => 'Lettura Astrologica Evolutiva',
                'slug' => 'lettura-astrologica-evolutiva',
                'description' => 'Un\'analisi profonda del tema natale per comprendere i propri talenti, le sfide karmiche e il percorso di crescita personale, in un\'ottica di evoluzione spirituale.',
                'category' => 'CONSULENZE',
                'duration' => '90',
                'price' => '80.00',
                'imageUrl' => '/images/consulenze/consulenze-1.webp',
                'createdAt' => date('Y-m-d H:i:s'),
                'updatedAt' => date('Y-m-d H:i:s'),
            ],
            [
                'id' => uniqid('srv_'),
                'title' => 'Accompagnamento al Parto',
                'slug' => 'accompagnamento-al-parto',
                'description' => 'Incontri informativi ed esperienziali per prepararsi fisicamente ed emotivamente al momento della nascita, acquisendo strumenti pratici per la gestione del dolore.',
                'category' => 'MATERNITA',
                'duration' => '120',
                'price' => '80.00',
                'imageUrl' => '/images/maternita/Servizi-maternita-1.webp',
                'createdAt' => date('Y-m-d H:i:s'),
                'updatedAt' => date('Y-m-d H:i:s'),
            ],
            [
                'id' => uniqid('srv_'),
                'title' => 'Yoga Post Parto con Bebè',
                'slug' => 'yoga-post-parto-bebe',
                'description' => 'Un corso dolce per recuperare il tono muscolare del pavimento pelvico e dell\'addome, rafforzando contemporaneamente il legame con il proprio bambino in uno spazio accogliente.',
                'category' => 'MATERNITA',
                'duration' => '60',
                'price' => '45.00',
                'imageUrl' => '/images/maternita/Servizi-maternita-2.webp',
                'createdAt' => date('Y-m-d H:i:s'),
                'updatedAt' => date('Y-m-d H:i:s'),
            ],
            [
                'id' => uniqid('srv_'),
                'title' => 'Hatha Yoga Tradizionale',
                'slug' => 'hatha-yoga-tradizionale',
                'description' => 'Lezioni di yoga adatte a tutti i livelli per ritrovare equilibrio, flessibilità e forza attraverso asana classiche e tecniche di respirazione pranayama.',
                'category' => 'YOGA',
                'duration' => '75',
                'price' => '50.00',
                'imageUrl' => '/images/home/Pratiche-di-Yoga.webp',
                'createdAt' => date('Y-m-d H:i:s'),
                'updatedAt' => date('Y-m-d H:i:s'),
            ],
            [
                'id' => uniqid('srv_'),
                'title' => 'Trattamento Sonoro con Campane Tibetane',
                'slug' => 'trattamento-sonoro-campane-tibetane',
                'description' => 'Un massaggio vibrazionale profondo in cui le frequenze sonore avvolgono il corpo, sciogliendo tensioni e inducendo uno stato meditativo di profondo rilassamento.',
                'category' => 'TRATTAMENTI',
                'duration' => '60',
                'price' => '60.00',
                'imageUrl' => '/images/trattamenti/trattamenti-olistici-1.webp',
                'createdAt' => date('Y-m-d H:i:s'),
                'updatedAt' => date('Y-m-d H:i:s'),
            ]
        ];

        foreach ($services as $service) {
            $this->db->table('services')->insert($service);
        }

        // 2. EVENTS
        $events = [
            [
                'title' => 'Cerchio di Luna Nuova',
                'slug' => 'cerchio-luna-nuova',
                'shortDescription' => 'Celebriamo l\'energia della luna nuova con meditazione e condivisione.',
                'description' => 'Un incontro speciale tra donne per celebrare l\'energia della luna nuova, condividere, meditare e piantare i semi delle nostre nuove intenzioni in un ambiente protetto e accogliente.',
                'category' => 'TRATTAMENTI',
                'price' => 25.00,
                'date' => date('Y-m-d H:i:s', strtotime('+14 days 20:30:00')),
                'location' => 'Studio di Roma',
                'imageUrl' => '/images/home/Pratiche-di-Yoga.webp',
                'createdAt' => date('Y-m-d H:i:s'),
                'updatedAt' => date('Y-m-d H:i:s'),
            ],
            [
                'title' => 'Ritiro Yoga di Primavera',
                'slug' => 'ritiro-yoga-primavera',
                'shortDescription' => 'Un weekend nella natura per ritrovare l\'equilibrio con pratiche di yoga e meditazione.',
                'description' => 'Un weekend immersi nella natura per risvegliare il corpo e la mente dopo l\'inverno. Pratiche di yoga, meditazione, passeggiate consapevoli e cibo sano.',
                'category' => 'YOGA',
                'price' => 250.00,
                'date' => date('Y-m-d H:i:s', strtotime('+45 days 10:00:00')),
                'location' => 'Agriturismo nel Bosco',
                'imageUrl' => '/images/home/home-hero-yoga.png',
                'createdAt' => date('Y-m-d H:i:s'),
                'updatedAt' => date('Y-m-d H:i:s'),
            ],
            [
                'title' => 'Workshop: Il Massaggio del Neonato',
                'slug' => 'workshop-massaggio-neonato',
                'shortDescription' => 'Tecniche base di massaggio infantile per neo-genitori in un ambiente sereno.',
                'description' => 'Un incontro pratico per neo-genitori per imparare le tecniche base del massaggio infantile, favorendo il rilassamento del bebè e rafforzando il legame affettivo.',
                'category' => 'MATERNITA',
                'price' => 40.00,
                'date' => date('Y-m-d H:i:s', strtotime('+7 days 10:00:00')),
                'location' => 'Studio di Roma',
                'imageUrl' => '/images/maternita/Servizi-maternita-2.webp',
                'createdAt' => date('Y-m-d H:i:s'),
                'updatedAt' => date('Y-m-d H:i:s'),
            ]
        ];

        foreach ($events as $event) {
            $this->db->table('events')->insert($event);
        }

        // 3. REVIEWS
        $reviews = [
            [
                'id' => uniqid('rev_'),
                'name' => 'Chiara M.',
                'description' => 'Ho frequentato il corso di yoga in gravidanza con Stefania. È stata un\'esperienza meravigliosa che mi ha aiutato ad arrivare al parto serena e centrata. La consiglio di cuore!',
                'category' => 'MATERNITA',
                'imageUrl' => null,
                'createdAt' => date('Y-m-d H:i:s', strtotime('-2 months')),
            ],
            [
                'id' => uniqid('rev_'),
                'name' => 'Martina D.',
                'description' => 'L\'accompagnamento al parto mi ha fornito strumenti pratici e una grande consapevolezza. Grazie a Stefania ho vissuto il momento più importante della mia vita con forza e senza paura.',
                'category' => 'MATERNITA',
                'imageUrl' => null,
                'createdAt' => date('Y-m-d H:i:s', strtotime('-3 months')),
            ],
            [
                'id' => uniqid('rev_'),
                'name' => 'Valentina R.',
                'description' => 'I massaggi ayurvedici durante l\'ottavo mese sono stati fondamentali per alleviare il mal di schiena e la pesantezza alle gambe. Un vero momento di coccola solo per me.',
                'category' => 'MATERNITA',
                'imageUrl' => null,
                'createdAt' => date('Y-m-d H:i:s', strtotime('-1 months')),
            ],
            [
                'id' => uniqid('rev_'),
                'name' => 'Alessia S.',
                'description' => 'Il corso post-parto con il mio bambino è diventato il nostro momento preferito della settimana. È bellissimo poter riprendere contatto col proprio corpo in un ambiente così dolce e non giudicante.',
                'category' => 'MATERNITA',
                'imageUrl' => null,
                'createdAt' => date('Y-m-d H:i:s', strtotime('-15 days')),
            ],
            [
                'id' => uniqid('rev_'),
                'name' => 'Sara B.',
                'description' => 'I trattamenti di Stefania sono un vero toccasana. Riesce sempre a capire di cosa ha bisogno il mio corpo e dopo ogni seduta mi sento rinata, leggera e piena di energia positiva.',
                'category' => 'TRATTAMENTI',
                'imageUrl' => null,
                'createdAt' => date('Y-m-d H:i:s', strtotime('-15 days')),
            ],
            [
                'id' => uniqid('rev_'),
                'name' => 'Elena F.',
                'description' => 'Le consulenze sui fiori di Bach mi hanno aiutato a superare un periodo di forte ansia lavorativa. Stefania ascolta senza giudicare e sa guidarti con grande empatia.',
                'category' => 'CONSULENZE',
                'imageUrl' => null,
                'createdAt' => date('Y-m-d H:i:s', strtotime('-5 days')),
            ],
            [
                'id' => uniqid('rev_'),
                'name' => 'Francesca L.',
                'description' => 'Il cerchio di donne è stato potente e trasformativo. Un momento magico di condivisione autentica. Grazie Stefania per creare questi spazi sicuri e necessari.',
                'category' => 'YOGA',
                'imageUrl' => null,
                'createdAt' => date('Y-m-d H:i:s', strtotime('-1 months')),
            ]
        ];

        foreach ($reviews as $review) {
            $this->db->table('Review')->insert($review);
        }

        // 4. NEWSLETTERS
        $newsletters = [
            ['id' => uniqid('nl_'), 'email' => 'chiara.rossi@email.it', 'createdAt' => date('Y-m-d H:i:s', strtotime('-10 days'))],
            ['id' => uniqid('nl_'), 'email' => 'mario.bianchi@email.it', 'createdAt' => date('Y-m-d H:i:s', strtotime('-5 days'))],
            ['id' => uniqid('nl_'), 'email' => 'elisa.verdi@email.it', 'createdAt' => date('Y-m-d H:i:s', strtotime('-2 days'))],
        ];

        foreach ($newsletters as $newsletter) {
            $this->db->table('NewsletterSubscriber')->insert($newsletter);
        }

        // 5. CONTACTS
        $contacts = [
            [
                'id' => uniqid('c_'),
                'name' => 'Anna Giorgi',
                'email' => 'anna.g@email.it',
                'message' => 'Buongiorno Stefania, vorrei avere maggiori informazioni sul corso di massaggio infantile. Quando inizierà il prossimo ciclo?',
                'read' => false,
                'createdAt' => date('Y-m-d H:i:s', strtotime('-1 hours')),
            ],
            [
                'id' => uniqid('c_'),
                'name' => 'Giulia Ferri',
                'email' => 'g.ferri@email.it',
                'message' => 'Ciao! Ho visto che organizzi dei cerchi di donne per la luna nuova. Ci sono ancora posti disponibili per il prossimo evento del 15?',
                'read' => true,
                'createdAt' => date('Y-m-d H:i:s', strtotime('-2 days')),
            ]
        ];

        foreach ($contacts as $contact) {
            $this->db->table('ContactSubmission')->insert($contact);
        }
    }
}
