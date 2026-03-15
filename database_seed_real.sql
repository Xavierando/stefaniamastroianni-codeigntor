-- --------------------------------------------------------
-- Real Seeding Data for Stefania Mastroianni Holistic Site
-- Generated to provide a consistent base data set
-- --------------------------------------------------------

-- Clear existing data
SET FOREIGN_KEY_CHECKS = 0;
TRUNCATE TABLE `ServiceOffering`;
TRUNCATE TABLE `Review`;
TRUNCATE TABLE `GalleryImage`;
SET FOREIGN_KEY_CHECKS = 1;

-- --------------------------------------------------------
-- ServiceOffering
-- --------------------------------------------------------
INSERT INTO `ServiceOffering` (`id`, `slug`, `title`, `description`, `category`, `price`, `duration`, `imageUrl`, `isEvent`, `eventDate`, `eventLocation`, `isFull`, `createdAt`, `updatedAt`) VALUES

-- Maternità
('mat-001', 'accompagnamento-dolce-attesa', 'Accompagnamento in Dolce Attesa', 'Un percorso individuale dedicato alle future mamme per vivere la gravidanza con serenità, maggiore consapevolezza e una profonda connessione con il proprio corpo e il bambino che cresce.', 'MATERNITA', '60.00', '60', '/images/maternita/Servizi-maternita-2.webp', 0, NULL, NULL, 0, NOW(), NOW()),
('mat-002', 'cerchio-delle-mamme', 'Il Cerchio delle Mamme', 'Incontro di gruppo per condividere esperienze, dubbi, paure e gioie della maternità in uno spazio protetto, accogliente e non giudicante. Aperto a donne in dolce attesa e neo-mamme.', 'MATERNITA', '25.00', '120', '/images/home/Servizi-maternita-1.webp', 1, '2026-05-15 18:00:00', 'Studio Olistico Mastroianni, Via Roma 15', 0, NOW(), NOW()),

-- Trattamenti
('tra-001', 'massaggio-rilassante-olistico', 'Massaggio Rilassante Olistico', 'Un trattamento total body avvolgente che unisce diverse tecniche manuali dolci per sciogliere le tensioni muscolari profonde, favorire il drenaggio linfatico e riequilibrare le energie del corpo.', 'TRATTAMENTI', '70.00', '90', '/images/trattamenti/trattamenti-olistici-1.webp', 0, NULL, NULL, 0, NOW(), NOW()),
('tra-002', 'trattamento-reiki', 'Trattamento Energetico Reiki', 'Sessione individuale focalizzata sul riequilibrio dei chakra e dei centri energetici. Aiuta a rilasciare blocchi emotivi, ridurre lo stress e stimolare la naturale capacità di autoguarigione del corpo.', 'TRATTAMENTI', '50.00', '60', '/images/trattamenti/trattamenti-olistici-1.webp', 0, NULL, NULL, 0, NOW(), NOW()),

-- Yoga
('yog-001', 'hatha-yoga-flow', 'Hatha Yoga Flow', 'Pratica dolce e fluida adatta a tutti i livelli. Lavoreremo sulla consapevolezza del respiro, sull\'allungamento e sulla forza interiore per ritrovare equilibrio e centratura dopo una giornata intensa.', 'YOGA', '15.00', '60', '/images/home/Pratiche-di-Yoga.webp', 0, NULL, NULL, 0, NOW(), NOW()),
('yog-002', 'ritiro-yoga-natura', 'Ritiro Yoga immersi nella Natura', 'Un intero fine settimana dedicato alla pratica intensiva, alla meditazione camminata e all\'alimentazione consapevole, lontani dai ritmi frenetici della città.', 'YOGA', '250.00', NULL, '/images/home/home-hero-yoga.png', 1, '2026-06-20 09:00:00', 'Agriturismo La Quercia, Colline Toscane', 0, NOW(), NOW()),

-- Consulenze
('con-001', 'consulenza-fiori-di-bach', 'Consulenza Fiori di Bach', 'Colloquio naturopatico individuale per individuare i rimedi floreali più adatti a supportare il benessere emotivo, superare paure, ansie, momenti di transizione e riscoprire la propria forza interiore.', 'CONSULENZE', '50.00', '60', '/images/consulenze/consulenze-2.webp', 0, NULL, NULL, 0, NOW(), NOW());

-- --------------------------------------------------------
-- Review
-- --------------------------------------------------------
INSERT INTO `Review` (`id`, `name`, `description`, `category`, `imageUrl`, `createdAt`) VALUES
('rev-001', 'Giulia R.', 'Un\'esperienza meravigliosa che mi ha aiutato ad affrontare l\'ultimo trimestre e il parto con molta più sicurezza e serenità. La dolcezza di Stefania è impagabile, grazie di cuore!', 'MATERNITA', NULL, NOW()),
('rev-002', 'Marco T.', 'Soffrivo di tensioni croniche al collo e alle spalle da mesi. Dopo un paio di sedute di massaggio olistico mi sento completamente rinato e ho ripreso a dormire bene. Super consigliato.', 'TRATTAMENTI', NULL, NOW()),
('rev-003', 'Elena S.', 'Le lezioni di yoga sono diventate il mio appuntamento fisso per ricaricarmi. L\'atmosfera dello studio è stupenda e la pratica è sempre adattata e rispettosa dei limiti di ciascuno.', 'YOGA', NULL, NOW()),
('rev-004', 'Francesca M.', 'Grazie alla consulenza sui Fiori di Bach sono riuscita a superare un momento di stallo lavorativo che mi bloccava. Un supporto invisibile ma davvero potente.', 'CONSULENZE', NULL, NOW()),
('rev-005', 'Paolo e Sara', 'Abbiamo partecipato agli incontri di coppia per l\'attesa e abbiamo scoperto strumenti di connessione fortissimi. Ci siamo sentiti guidati e mai giudicati in questo viaggio.', 'MATERNITA', NULL, NOW()),
('rev-006', 'Chiara B.', 'L\'energia che si respira durante i trattamenti è unica. Si esce dallo studio leggeri e con un sorriso spontaneo.', 'TRATTAMENTI', NULL, NOW());

-- --------------------------------------------------------
-- GalleryImage
-- --------------------------------------------------------
INSERT INTO `GalleryImage` (`id`, `url`, `alt`, `createdAt`) VALUES
('gal-001', '/images/home/home-hero-yoga.png', 'Pratica Yoga al tramonto', NOW()),
('gal-002', '/images/maternita/Servizi-maternita-1.webp', 'Rituale del grembo', NOW()),
('gal-003', '/images/trattamenti/trattamenti-olistici-1.webp', 'Dettaglio trattamento olistico mani', NOW()),
('gal-004', '/images/consulenze/consulenze-1.webp', 'Colloquio e ascolto', NOW()),
('gal-005', '/images/home/Pratiche-di-Yoga.webp', 'Meditazione in natura', NOW()),
('gal-006', '/images/consulenze/consulenze-2.webp', 'Dettaglio Fiori di Bach', NOW()),
('gal-007', '/images/maternita/Servizi-maternita-2.webp', 'Cerchio di condivisione e ascolto', NOW());
