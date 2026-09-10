# Configurazione contatti: toggle WhatsApp e fallback sul modulo

Data: 2026-09-10

## Obiettivo

Rendere il canale di contatto configurabile dal pannello admin, senza rebuild
del frontend:

1. Un interruttore WhatsApp sì/no.
2. Un campo per cambiare l'username WhatsApp.
3. Con WhatsApp attivo, il sito si comporta esattamente come oggi.
4. Con WhatsApp spento, la sezione WhatsApp sparisce dalla pagina Contatti e
   tutti i CTA che oggi aprono WhatsApp rimandano al modulo di contatto,
   conservando il contesto di provenienza (nome del servizio o dell'evento).

In più, indipendente dal resto: un bottone discreto in `/admin/events` che
mostra anche gli eventi passati, per poterli modificare.

## Contesto accertato

Fatti verificati sul codice, non assunzioni:

- `WHATSAPP_HANDLE` è una costante compilata in `frontend/src/config/site.ts`.
  `whatsappUrl(message)` la usa ed è chiamata in **7 punti**:
  `ServiceOverview` attraverso le 4 pagine categoria (Yoga, Trattamenti,
  Maternità, Consulenze), `ServiceCard`, `EventDetail`, e la sezione WhatsApp
  di `Contatti`.
- Il sito in produzione è **HTML statico servito da Apache**. `build_aruba.sh`
  copia `frontend/dist/*` nella root del deploy e mette CodeIgniter sotto
  `api/`. L'`.htaccess` di root instrada a PHP solo ciò che inizia per `/api/`.
- L'`.htaccess` di produzione è gestito **a mano** su Aruba: `build_aruba.sh`
  dichiara esplicitamente di non generarlo. Qualsiasi soluzione che richieda
  di cambiarlo introduce un passo manuale in produzione.
- Il prerender **non** cuoce contenuto dinamico. `entry-server.tsx` lo dichiara
  ("Data-fetching useEffects do not run during SSR") ed è confermato
  dall'output: `dist/yoga-e-meditazione/index.html` non contiene nessuna
  sezione servizio, `dist/index.html` non contiene il carosello eventi. Servizi
  ed eventi arrivano dopo l'idratazione, ed è per questo che quelle pagine
  hanno lo spinner a schermo intero.
- Di conseguenza 6 dei 7 punti WhatsApp vivono in markup assente dall'HTML
  statico. Solo la sezione di `Contatti` è nell'HTML prerenderizzato, perché
  quella pagina non fetcha nulla.
- Esiste già il pattern chiave/valore: tabella `booking_settings` e
  `BookingSettingsModel` con `getSetting`/`setSetting`/`getAllSettings`.
- `useHashScroll(ready)` esiste già e serve proprio a saltare a un ancoraggio
  dopo che il contenuto è renderizzato. `Contatti.tsx` non lo usa e non ha
  nessun `id`.
- `AdminEvents` scarica **tutti** gli eventi e filtra lato client a "futuri più
  ultimi 7 giorni".
- Il progetto non ha test automatici: nessuno script `test` in
  `frontend/package.json`.

## Decisioni prese

**Risoluzione lato client, non lato server.** Le impostazioni si leggono con una
fetch runtime come qualsiasi altro dato del sito. Scartate: l'iniezione via
script PHP bloccante e il passaggio delle pagine attraverso PHP. Motivo: il
sito risolve già tutto il contenuto dinamico dopo l'idratazione, e l'unico
punto che ne risentirebbe è una sezione su una pagina. Non vale un file PHP in
più né una modifica manuale all'`.htaccess`.

**Stato di default prima dell'idratazione: WhatsApp spento.** È ciò che vedono
il prerender, il primo render client e il caso di API irraggiungibile. Due
conseguenze volute: nessun disallineamento all'idratazione, perché HTML statico
e primo render coincidono; e in caso di guasto il sito degrada verso il modulo
di contatto invece che verso un link WhatsApp rotto.

**Il toggle non deve essere istantaneo.** Ha effetto al caricamento successivo
della pagina. Nessun meccanismo di invalidazione o polling.

## Architettura

### Backend

Nuova migrazione `site_settings`, gemella di `booking_settings`:

| Colonna | Tipo | Note |
|---|---|---|
| `id` | INT unsigned auto_increment | chiave primaria |
| `setting_key` | VARCHAR(50) | unique |
| `setting_value` | TEXT | null |
| `updated_at` | DATETIME | null |

La migrazione inserisce i valori iniziali `whatsapp_enabled = "1"` e
`whatsapp_handle = "xprot"`, così il deploy non cambia il comportamento attuale
del sito pubblico.

`SiteSettingsModel` espone `getSetting`, `setSetting`, `getAllSettings` con la
stessa forma di `BookingSettingsModel`.

`SettingsController`:

- `GET /api/settings` — pubblico. Risponde
  `{ whatsappEnabled: bool, whatsappHandle: string }`. Espone solo le chiavi in
  whitelist, mai l'intera tabella: la tabella è generica e potrebbe ospitare in
  futuro valori non pubblici.
- `POST /api/settings` — dentro il gruppo di rotte protetto da auth. Normalizza
  l'handle rimuovendo spazi, `+`, trattini e parentesi, così un numero di
  telefono incollato in qualsiasi formato diventa valido per `wa.me`. Rifiuta
  con 400 il salvataggio di un handle vuoto quando il toggle è attivo: uno
  stato del genere produrrebbe link rotti sul sito pubblico.

### Frontend

`SiteSettingsProvider` in `App.tsx`, con hook `useSiteSettings()`.

```ts
type SiteSettings = { whatsappEnabled: boolean; whatsappHandle: string };
const DEFAULT_SETTINGS: SiteSettings = { whatsappEnabled: false, whatsappHandle: "" };
```

Lo stato parte dai default, una `useEffect` chiama `GET /api/settings` e
aggiorna. In errore i default restano. Il provider sta in `App.tsx`, quindi lo
ereditano sia `entry-client` sia `entry-server`.

In `config/site.ts`, `whatsappUrl(message)` diventa
`buildWhatsappUrl(handle, message?)`. `WHATSAPP_HANDLE` cessa di essere la
sorgente di verità dell'handle.

Un solo hook centralizza la decisione per tutti e 7 i punti. I messaggi però non
sono uniformi: `EventDetail` ne usa due diversi (prenotazione e lista d'attesa)
con etichette diverse, mentre servizi e schede ne usano uno solo. Quindi l'hook
non impone una frase: la riceve.

```ts
useContactCta(): {
  whatsappEnabled: boolean;
  contactTarget(message: string): { href: string; external: boolean };
}
```

- WhatsApp attivo e handle non vuoto → `href` = `buildWhatsappUrl(handle, message)`,
  `external` = `true`.
- Altrimenti → `href` = `/contatti?messaggio=<message>#modulo`, `external` = `false`.

Il parametro trasporta **la frase stessa**, non solo il nome del soggetto. Così
la sfumatura si conserva senza casi speciali: "vorrei essere inserita/o in
lista d'attesa" arriva nel modulo esattamente come sarebbe arrivata su
WhatsApp. Il testo finisce in `defaultValue` di una textarea, quindi React lo
tratta come testo e non c'è rischio di injection; un visitatore che si
costruisse un URL a mano otterrebbe solo del testo che avrebbe potuto digitare.

Il controllo sull'handle vuoto è difensivo: anche se il backend lo impedisce,
il frontend non deve poter generare `wa.me/`.

Le etichette restano a carico di ogni punto di chiamata, perché sono diverse e
alcune nominano WhatsApp:

| Punto | WhatsApp attivo | WhatsApp spento |
|---|---|---|
| `ServiceOverview` (4 pagine, prop `ctaText`) | Scrivimi su WhatsApp | Richiedi informazioni |
| `ServiceCard` | Scrivimi su WhatsApp | Richiedi informazioni |
| `EventDetail`, evento al completo | Richiedi lista d'attesa | Richiedi lista d'attesa |
| `EventDetail`, posti disponibili | Prenota su WhatsApp | Prenota un posto |
| `EventDetail`, riga sotto il bottone | Scrivimi su WhatsApp per prenotare il tuo posto. | Compila il modulo per prenotare il tuo posto. |

La riga di testo sotto il bottone di `EventDetail` è facile da dimenticare:
nomina WhatsApp e va cambiata anche lei.

`ServiceOverview` distingue già i link esterni dagli interni con
`/^https?:\/\//` e usa `<a target="_blank">` o il `Link` del router di
conseguenza: funziona con entrambi i casi senza modifiche. `ServiceCard` e
`EventDetail` usano oggi un `<a>` fisso e vanno resi condizionali.

### Pagina Contatti

La sezione WhatsApp si renderizza solo con toggle attivo. Sparendo, cambia
l'alternanza degli sfondi, che va ricalcolata con
`sectionBackground()` (già presente in `lib/sectionBackground.ts`):

| Toggle | Sezione WhatsApp | Sezione contatti/modulo | Card del modulo |
|---|---|---|---|
| attivo | `bg-white` (indice 1) | `bg-brand-base` (indice 2) | `bg-white` |
| spento | assente | `bg-white` (indice 1) | `bg-brand-base` |

La card prende sempre il colore opposto alla sezione che la contiene,
altrimenti sparisce nello sfondo.

Per la precompilazione del modulo:

- `id="modulo"` sulla sezione che contiene il form.
- `useHashScroll(true)` in `Contatti.tsx`.
- `ContactForm` legge `?messaggio=` con `useSearchParams` e lo mette in
  `defaultValue` sulla textarea. Il campo resta non controllato, come è oggi.

### Sezione admin

Nuova pagina `pages/admin/settings/AdminSettings.tsx`, rotta `/admin/settings`
registrata in `App.tsx` (lazy, come tutte le pagine admin), voce di menu in
`AdminLayout` con etichetta **"Impostazioni"** e icona `Settings`.

L'etichetta non è "Contatti" perché `/admin/contacts` esiste già ed è
etichettata "Messaggi": due voci simili confonderebbero.

La pagina contiene il toggle WhatsApp, il campo username, il salvataggio e un
messaggio di esito. Riusa `Card` e `Button` da `components/admin/ui`; i campi
input sono scritti inline, come in tutti gli altri form admin del progetto.

### Bottone eventi passati

In `AdminEvents`, uno stato `showPast` e un bottone discreto accanto al titolo
che salta il filtro data esistente. Nessuna modifica all'API: la pagina già
riceve tutti gli eventi. L'ordinamento resta invariato.

## Cosa resta fuori

- La pagina `/laboratori-eventi` continua a mostrare tutti gli eventi, passati
  inclusi: è un archivio.
- Il filtro `?upcoming=1` introdotto in precedenza non viene toccato.
- Nessuna altra impostazione oltre alle due WhatsApp. La tabella è generica e
  potrà ospitarne altre, ma non se ne aggiungono ora.
- Nessun refactor di `BookingSettingsModel`: la duplicazione dei tre metodi
  helper è accettata per non toccare il codice del booking, che è disattivato
  ma presente.

## Verifica

Il progetto non ha test automatici, quindi la verifica è manuale e va eseguita,
non dichiarata:

1. `curl` su `GET /api/settings` senza token: risponde le due chiavi.
2. `curl` su `POST /api/settings` senza token: rifiutato.
3. `curl` su `POST /api/settings` con token admin: salva e rilegge il valore.
4. `curl` su `POST /api/settings` con toggle attivo e handle vuoto: 400.
5. `npm run build`: l'HTML prerenderizzato di `/contatti` **non** contiene la
   sezione WhatsApp e **contiene** il modulo.
6. Prova manuale su `localhost:81` nei due stati del toggle: sezione presente o
   assente, sfondi alternati correttamente in entrambi i casi, CTA delle schede
   servizio che puntano a WhatsApp o al modulo, e con toggle spento il modulo
   raggiunto via CTA che risulta precompilato e scrollato in posizione.
   Da controllare esplicitamente anche i due casi di `EventDetail` (posti
   disponibili e evento al completo), perché hanno messaggi ed etichette
   proprie, e la riga di testo sotto il bottone.
7. `npm run lint`: nessun problema nuovo sui file toccati.
