# Deploy in produzione (Aruba)

Runbook essenziale, basato su `build_aruba.sh`, `.github/workflows/deploy-aruba.yml`
e `docker/dev/docker.md`. Non contiene passaggi non verificabili da questi file.

## Due percorsi esistenti nel repo

### 1. Automatico (GitHub Actions, push su `main`)

Il workflow `.github/workflows/deploy-aruba.yml`:

1. Build del frontend (`npm run build` in `frontend/`).
2. Build del backend (`composer install --no-dev --optimize-autoloader`).
3. Prepara `aruba_deploy/` (frontend in root, backend sotto `aruba_deploy/api/`),
   patcha `Routes.php` per il deploy in sottocartella.
4. Sincronizza `aruba_deploy/` via FTP su Aruba (esclude `.env`, `.env.example`,
   `.htaccess`, file `.git*`).
5. Chiama `POST <SITE_URL>/api/migrations/run` con header
   `X-Migration-Token: <secrets.MIGRATION_TOKEN>`.

ATTENZIONE: questo passo di migrazione ha `continue-on-error: true`. Se fallisce
(token non configurato sul server, endpoint non raggiungibile, errore SQL), il
workflow risulta comunque verde: l'unico segnale e' la riga "Migrations failed"
nei log dello step, che nessuno controlla di routine. Un fallimento silenzioso
qui lascia il database senza le tabelle/colonne nuove.

### 2. Manuale (`build_aruba.sh` + upload FTP a mano)

`build_aruba.sh`:

1. Build del frontend (`npm run build`).
2. Crea `aruba_deploy/` con frontend in root e backend (app, public, vendor,
   writable, spark) sotto `aruba_deploy/api/`.
3. Patcha `Routes.php` per il deploy in sottocartella (Aruba toglie `/api/`
   dalla REQUEST_URI).
4. NON copia `.env` ne' genera `.htaccess`: la configurazione live resta quella
   impostata a mano su Aruba.
5. Stampa che la cartella e' pronta per l'upload FTP.

Questo script **non chiama mai** l'endpoint di migrazione. Chi lo usa deve
caricare `aruba_deploy/` via FTP e poi eseguire il passo 3 sotto a mano.

## Passi ordinati per un deploy che include migrazioni di database

1. Merge/push su `main` (innesca il workflow automatico) oppure esegui
   `bash build_aruba.sh` e carica `aruba_deploy/` via FTP a mano.
2. Se il deploy e' manuale, o se il workflow automatico ha segnalato
   "Migrations failed" nei log, esegui la migrazione a mano:

   ```
   curl -X POST https://www.arpelux.it/api/migrations/run \
     -H "X-Migration-Token: <MIGRATION_TOKEN del server>" \
     -H "Content-Type: application/json"
   ```

   `MIGRATION_TOKEN` e' definito solo nel `.env` del server di produzione
   (non e' nel repo) e nei secrets del workflow GitHub Actions per il percorso
   automatico.
3. Verifica che il sito pubblico sia effettivamente a posto, es.
   `curl https://www.arpelux.it/api/settings` deve rispondere 200 con le
   impostazioni attese, non 500.

ATTENZIONE: se il passo 2 viene saltato (o fallisce senza che nessuno se ne
accorga), le tabelle introdotte dalle migrazioni piu' recenti non esistono.
Per `site_settings` questo significa che `GET /api/settings` va in errore 500;
il frontend, per design, interpreta l'assenza di impostazioni come tutto
spento. Risultato concreto: WhatsApp risulta spento su tutto il sito pubblico,
senza nessun errore visibile ne' in admin ne' per i visitatori.

## Nota sui dump SQL nel repo

`database_seed_real.sql` e `database_export.sql` non contengono la tabella
`site_settings`: un ambiente ripristinato da questi dump ha lo stesso problema
finche' non viene eseguita la migrazione.

## Ambiente di sviluppo (Docker)

Per lo sviluppo locale vedi `docker/dev/docker.md`. Il container backend di
sviluppo esegue `php spark migrate` automaticamente all'avvio: questo runbook
riguarda solo l'ambiente di produzione su Aruba, dove tale automatismo non
esiste.
