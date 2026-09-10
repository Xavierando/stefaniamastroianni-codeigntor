# Configurazione contatti con toggle WhatsApp — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rendere il canale di contatto configurabile dall'admin (WhatsApp sì/no più username), con fallback automatico sul modulo di contatto quando WhatsApp è spento.

**Architecture:** Le impostazioni vivono in una tabella chiave/valore `site_settings` esposta da `GET /api/settings` (pubblica) e scritta da `POST /api/settings` (protetta). Il frontend le legge a runtime con un context provider, partendo da un default "WhatsApp spento" che coincide con l'HTML prerenderizzato. Un solo hook, `useContactCta`, decide per tutti i punti di contatto se puntare a WhatsApp o al modulo.

**Tech Stack:** CodeIgniter 4 (PHP), React 19 + TypeScript, React Router 7, Tailwind 4, Vite con prerender SSR a build time.

**Spec:** `docs/superpowers/specs/2026-09-10-configurazione-contatti-whatsapp-design.md`

## Global Constraints

- **Nessun framework di test nel progetto.** `frontend/package.json` non ha script `test`. Ogni task usa comandi di verifica reali (curl, build, grep sull'output) al posto degli unit test. Il ciclo resta lo stesso: verifica che fallisce, implementazione, verifica che passa. **Non introdurre un framework di test**: è fuori scope.
- **Stack di sviluppo già in esecuzione in Docker.** Frontend su `http://localhost:81` (HMR con bind mount attivo), API su `http://localhost:8081/api`. Non avviare altri server: la porta 5173 sull'host è occupata da un altro progetto e il proxy `/api` risolve solo dentro la rete compose.
- **Default runtime: `{ whatsappEnabled: false, whatsappHandle: "" }`.** Valore esatto, non negoziabile: è ciò che vedono prerender, primo render client e caso di API irraggiungibile.
- **Valori iniziali in DB: `whatsapp_enabled = "1"`, `whatsapp_handle = "xprot"`.** Preservano il comportamento attuale del sito in produzione.
- **Etichette dei CTA**, testo esatto:

  | Punto | WhatsApp attivo | WhatsApp spento |
  |---|---|---|
  | `ServiceOverview` (prop `ctaText`) | `Scrivimi su WhatsApp` | `Richiedi informazioni` |
  | `ServiceCard` | `Scrivimi su WhatsApp` | `Richiedi informazioni` |
  | `EventDetail`, evento al completo | `Richiedi lista d'attesa` | `Richiedi lista d'attesa` |
  | `EventDetail`, posti disponibili | `Prenota su WhatsApp` | `Prenota un posto` |
  | `EventDetail`, riga sotto il bottone | `Scrivimi su WhatsApp per prenotare il tuo posto.` | `Compila il modulo per prenotare il tuo posto.` |

- **Parametro del link al modulo:** `?messaggio=<frase completa urlencoded>#modulo`. Trasporta la frase, non il nome del soggetto.
- **Voce di menu admin:** etichetta `Impostazioni`, icona `Settings` di lucide-react, rotta `/admin/settings`.
- Commenti nel codice in italiano senza accenti (come il resto del progetto); i commenti spiegano il *perché*, non il *cosa*.

## Struttura dei file

**Backend**
- Create: `backend/app/Database/Migrations/2026-09-10-120000_CreateSiteSettings.php` — tabella e valori iniziali.
- Create: `backend/app/Models/SiteSettingsModel.php` — accesso chiave/valore.
- Create: `backend/app/Controllers/Api/SettingsController.php` — lettura pubblica, scrittura protetta, normalizzazione handle.
- Modify: `backend/app/Config/Routes.php` — una rotta pubblica, una protetta.

**Frontend, nuovo**
- Create: `frontend/src/context/SiteSettingsContext.tsx` — provider e hook di lettura.
- Create: `frontend/src/hooks/useContactCta.ts` — unica sede della decisione WhatsApp/modulo.
- Create: `frontend/src/pages/admin/settings/AdminSettings.tsx` — pagina di configurazione.

**Frontend, modificato**
- `frontend/src/config/site.ts` — `whatsappUrl` diventa `buildWhatsappUrl(handle, message?)`.
- `frontend/src/App.tsx` — provider alla radice, rotta admin.
- `frontend/src/pages/Contatti.tsx` — sezione condizionale, sfondi, ancora.
- `frontend/src/components/ui/ContactForm.tsx` — precompilazione da query string.
- `frontend/src/components/ui/ServiceCard.tsx`, `frontend/src/pages/EventDetail.tsx` — CTA condizionale.
- `frontend/src/pages/{YogaPage,Trattamenti,Maternita,Consulenze}.tsx` — CTA condizionale via props.
- `frontend/src/components/admin/layout/AdminLayout.tsx` — voce di menu.
- `frontend/src/pages/admin/events/AdminEvents.tsx` — bottone eventi passati.

---

### Task 1: Tabella e modello `site_settings`

**Files:**
- Create: `backend/app/Database/Migrations/2026-09-10-120000_CreateSiteSettings.php`
- Create: `backend/app/Models/SiteSettingsModel.php`

**Interfaces:**
- Consumes: niente.
- Produces: `App\Models\SiteSettingsModel` con `getSetting(string $key, $default = null)`, `setSetting(string $key, $value)`, `getAllSettings(): array`. Chiavi in uso: `whatsapp_enabled` (`"1"`/`"0"`), `whatsapp_handle` (stringa).

- [ ] **Step 1: Scrivi la verifica che deve fallire**

La tabella non esiste ancora. Questo comando lo dimostra:

```bash
docker exec stefaniamastroianni-mysql mysql -udevuser -p"$(grep -oP '(?<=^DEV_DB_PASSWORD=).*' docker/dev/.env.docker)" stefaniamastroianni \
  -e "SELECT setting_key, setting_value FROM site_settings ORDER BY setting_key;" 2>&1 | grep -v "Using a password"
```

- [ ] **Step 2: Eseguilo e verifica che fallisca**

Atteso: `ERROR 1146 ... Table 'stefaniamastroianni.site_settings' doesn't exist`.

- [ ] **Step 3: Scrivi la migrazione**

`backend/app/Database/Migrations/2026-09-10-120000_CreateSiteSettings.php`:

```php
<?php

namespace App\Database\Migrations;

use CodeIgniter\Database\Migration;

class CreateSiteSettings extends Migration
{
    public function up()
    {
        $this->forge->addField([
            'id' => [
                'type'           => 'INT',
                'constraint'     => 11,
                'unsigned'       => true,
                'auto_increment' => true,
            ],
            'setting_key' => [
                'type'       => 'VARCHAR',
                'constraint' => '50',
                'unique'     => true,
            ],
            'setting_value' => [
                'type' => 'TEXT',
                'null' => true,
            ],
            'updated_at' => [
                'type' => 'DATETIME',
                'null' => true,
            ],
        ]);
        $this->forge->addKey('id', true);
        $this->forge->createTable('site_settings');

        // Valori iniziali allineati al comportamento attuale del sito, cosi il
        // deploy della migrazione non cambia nulla per chi visita le pagine.
        $now = date('Y-m-d H:i:s');
        $this->db->table('site_settings')->insertBatch([
            ['setting_key' => 'whatsapp_enabled', 'setting_value' => '1', 'updated_at' => $now],
            ['setting_key' => 'whatsapp_handle', 'setting_value' => 'xprot', 'updated_at' => $now],
        ]);
    }

    public function down()
    {
        $this->forge->dropTable('site_settings');
    }
}
```

- [ ] **Step 4: Scrivi il modello**

`backend/app/Models/SiteSettingsModel.php`:

```php
<?php

namespace App\Models;

use CodeIgniter\Model;

class SiteSettingsModel extends Model
{
    protected $table            = 'site_settings';
    protected $primaryKey       = 'id';
    protected $useAutoIncrement = true;
    protected $returnType       = 'array';
    protected $useSoftDeletes   = false;
    protected $protectFields    = true;
    protected $allowedFields    = ['setting_key', 'setting_value'];

    protected $useTimestamps = true;
    protected $updatedField  = 'updated_at';
    protected $createdField  = '';
    protected $deletedField  = '';

    public function getSetting(string $key, $default = null)
    {
        $setting = $this->where('setting_key', $key)->first();
        return $setting ? $setting['setting_value'] : $default;
    }

    public function setSetting(string $key, $value)
    {
        $setting = $this->where('setting_key', $key)->first();
        if ($setting) {
            return $this->update($setting['id'], ['setting_value' => $value]);
        }
        return $this->insert(['setting_key' => $key, 'setting_value' => $value]);
    }

    public function getAllSettings(): array
    {
        $result = [];
        foreach ($this->findAll() as $setting) {
            $result[$setting['setting_key']] = $setting['setting_value'];
        }
        return $result;
    }
}
```

- [ ] **Step 5: Esegui la migrazione**

```bash
docker exec stefaniamastroianni-backend php spark migrate
```

Atteso: output che elenca `CreateSiteSettings` come eseguita.

- [ ] **Step 6: Riesegui la verifica dello Step 1**

Atteso, due righe:

```
setting_key         setting_value
whatsapp_enabled    1
whatsapp_handle     xprot
```

- [ ] **Step 7: Commit**

```bash
git add backend/app/Database/Migrations/2026-09-10-120000_CreateSiteSettings.php backend/app/Models/SiteSettingsModel.php
git commit -m "feat(backend): tabella site_settings per la configurazione dei contatti"
```

---

### Task 2: Endpoint di lettura e scrittura

**Files:**
- Create: `backend/app/Controllers/Api/SettingsController.php`
- Modify: `backend/app/Config/Routes.php` (rotta pubblica accanto alle altre letture pubbliche, riga ~28; rotta protetta dentro `$routes->group('', ['filter' => 'auth'], ...)`, riga ~63)

**Interfaces:**
- Consumes: `App\Models\SiteSettingsModel` dal Task 1.
- Produces: `GET /api/settings` → `{"whatsappEnabled": bool, "whatsappHandle": string}`. `POST /api/settings` accetta lo stesso JSON, risponde con i valori salvati, e risponde 400 se `whatsappEnabled` è vero con handle vuoto.

- [ ] **Step 1: Scrivi le verifiche che devono fallire**

```bash
curl -s -o /dev/null -w "GET  pubblico      -> %{http_code}\n" http://localhost:8081/api/settings
curl -s -o /dev/null -w "POST senza token   -> %{http_code}\n" -X POST http://localhost:8081/api/settings \
  -H "Content-Type: application/json" -d '{"whatsappEnabled":true,"whatsappHandle":"xprot"}'
```

- [ ] **Step 2: Eseguile e verifica che falliscano**

Atteso: entrambe `404`, perché le rotte non esistono ancora.

- [ ] **Step 3: Scrivi il controller**

`backend/app/Controllers/Api/SettingsController.php`:

```php
<?php

namespace App\Controllers\Api;

use CodeIgniter\RESTful\ResourceController;
use App\Models\SiteSettingsModel;

class SettingsController extends ResourceController
{
    protected $modelName = SiteSettingsModel::class;
    protected $format = 'json';

    /**
     * Lettura pubblica. Espone solo le chiavi in whitelist: la tabella e
     * generica e potrebbe ospitare in futuro valori non pubblici.
     */
    public function index()
    {
        $model = new SiteSettingsModel();

        return $this->respond([
            'whatsappEnabled' => $model->getSetting('whatsapp_enabled', '0') === '1',
            'whatsappHandle'  => (string) $model->getSetting('whatsapp_handle', ''),
        ]);
    }

    public function update($id = null)
    {
        $model = new SiteSettingsModel();

        $enabled = (bool) $this->request->getJsonVar('whatsappEnabled');
        $handle  = $this->normalizeHandle((string) $this->request->getJsonVar('whatsappHandle'));

        // Toggle attivo con handle vuoto significherebbe link wa.me rotti su
        // tutto il sito pubblico: si rifiuta prima di scrivere.
        if ($enabled && $handle === '') {
            return $this->failValidationErrors(
                "Con WhatsApp attivo l'username non puo essere vuoto."
            );
        }

        $model->setSetting('whatsapp_enabled', $enabled ? '1' : '0');
        $model->setSetting('whatsapp_handle', $handle);

        return $this->respond([
            'whatsappEnabled' => $enabled,
            'whatsappHandle'  => $handle,
        ]);
    }

    /**
     * Spazi, +, trattini e parentesi via: un numero di telefono incollato in
     * qualunque formato diventa valido per wa.me, e un username resta intatto.
     */
    private function normalizeHandle(string $raw): string
    {
        return preg_replace('/[\s+()\-]/', '', trim($raw)) ?? '';
    }
}
```

- [ ] **Step 4: Registra le rotte**

In `backend/app/Config/Routes.php`, nel blocco delle letture pubbliche, dopo `$routes->get('posts', 'PostController::index');`:

```php
    $routes->get('settings', 'SettingsController::index');
```

E dentro `$routes->group('', ['filter' => 'auth'], static function ($routes) {`, dopo il blocco `// Blog posts`:

```php
        // Impostazioni del sito
        $routes->post('settings', 'SettingsController::update');
```

- [ ] **Step 5: Riesegui le verifiche dello Step 1**

Atteso: `GET pubblico -> 200`, `POST senza token -> 401`.

- [ ] **Step 6: Verifica il contenuto e la scrittura autenticata**

```bash
# Contenuto della lettura pubblica
curl -s http://localhost:8081/api/settings

# Token admin
TOKEN=$(curl -s -X POST http://localhost:8081/api/auth/login \
  -H "Content-Type: application/json" \
  -d "{\"username\":\"$(grep -oP '(?<=^ADMIN_USERNAME=).*' docker/dev/.env.docker)\",\"password\":\"$(grep -oP '(?<=^ADMIN_PASSWORD=).*' docker/dev/.env.docker)\"}" \
  | python3 -c "import sys,json;print(json.load(sys.stdin).get('token',''))")

# Scrittura autenticata
curl -s -X POST http://localhost:8081/api/settings -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" -d '{"whatsappEnabled":false,"whatsappHandle":"+39 333 123 45 67"}'

# Rilettura
curl -s http://localhost:8081/api/settings

# Handle vuoto con toggle attivo
curl -s -o /dev/null -w "handle vuoto -> %{http_code}\n" -X POST http://localhost:8081/api/settings \
  -H "Authorization: Bearer $TOKEN" -H "Content-Type: application/json" \
  -d '{"whatsappEnabled":true,"whatsappHandle":"  "}'

# Ripristina lo stato iniziale
curl -s -X POST http://localhost:8081/api/settings -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" -d '{"whatsappEnabled":true,"whatsappHandle":"xprot"}'
```

Atteso: prima lettura `{"whatsappEnabled":true,"whatsappHandle":"xprot"}`; la scrittura normalizza il numero in `393331234567`; la rilettura lo conferma con `whatsappEnabled:false`; l'handle vuoto risponde `400`; l'ultima chiamata riporta a `xprot`.

- [ ] **Step 7: Commit**

```bash
git add backend/app/Controllers/Api/SettingsController.php backend/app/Config/Routes.php
git commit -m "feat(backend): endpoint pubblico e protetto per le impostazioni del sito"
```

---

### Task 3: Provider, hook e nuova firma di `buildWhatsappUrl`

**Files:**
- Create: `frontend/src/context/SiteSettingsContext.tsx`
- Create: `frontend/src/hooks/useContactCta.ts`
- Modify: `frontend/src/config/site.ts:19-29`
- Modify: `frontend/src/App.tsx` (blocco `return (` con `<Suspense>`, riga ~65)

**Interfaces:**
- Consumes: `GET /api/settings` dal Task 2; `apiFetch` da `@/lib/api`.
- Produces:
  - `buildWhatsappUrl(handle: string, message?: string): string` da `@/config/site`.
  - `SiteSettingsProvider`, `useSiteSettings(): { whatsappEnabled: boolean; whatsappHandle: string }`, `DEFAULT_SITE_SETTINGS` da `@/context/SiteSettingsContext`.
  - `useContactCta(): { whatsappEnabled: boolean; contactTarget(message: string): { href: string; external: boolean } }` da `@/hooks/useContactCta`.

Nota: questo task **rompe volutamente la compilazione** dei 7 punti che usano `whatsappUrl`. È il modo in cui TypeScript li elenca tutti. I Task 4, 5 e 6 li sistemano; la build torna verde alla fine del Task 5.

- [ ] **Step 1: Scrivi la verifica che deve fallire**

```bash
cd frontend && npx tsc -b --noEmit 2>&1 | grep -c "whatsappUrl" ; cd ..
```

- [ ] **Step 2: Eseguila e verifica lo stato di partenza**

Atteso: `0`. Nessun errore, perché `whatsappUrl` esiste ancora nella vecchia forma. Lo stesso comando allo Step 7 dovrà invece riportarne 7.

- [ ] **Step 3: Cambia la firma in `config/site.ts`**

Sostituisci il blocco da `export const WHATSAPP_HANDLE` fino alla fine del file con:

```ts
/**
 * Costruisce un link WhatsApp per un handle, con messaggio precompilato
 * opzionale. L'handle non e piu una costante compilata: arriva dalle
 * impostazioni del sito, lette a runtime.
 */
export function buildWhatsappUrl(handle: string, message?: string): string {
  const base = `https://wa.me/${handle}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}
```

- [ ] **Step 4: Scrivi il provider**

`frontend/src/context/SiteSettingsContext.tsx`:

```tsx
import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { apiFetch } from "@/lib/api";

export type SiteSettings = {
  whatsappEnabled: boolean;
  whatsappHandle: string;
};

/**
 * Default con WhatsApp spento. E cio che vedono il prerender, il primo render
 * client e il caso di API irraggiungibile: HTML statico e prima idratazione
 * coincidono, e in caso di guasto il sito degrada verso il modulo di contatto
 * invece che verso un link rotto.
 */
export const DEFAULT_SITE_SETTINGS: SiteSettings = {
  whatsappEnabled: false,
  whatsappHandle: "",
};

const SiteSettingsContext = createContext<SiteSettings>(DEFAULT_SITE_SETTINGS);

export function SiteSettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<SiteSettings>(DEFAULT_SITE_SETTINGS);

  useEffect(() => {
    let cancelled = false;

    apiFetch("/settings")
      .then((data) => {
        if (cancelled || !data) return;
        setSettings({
          whatsappEnabled: Boolean(data.whatsappEnabled),
          whatsappHandle:
            typeof data.whatsappHandle === "string" ? data.whatsappHandle : "",
        });
      })
      .catch(() => {
        // Silenzio voluto: restano i default, quindi il modulo di contatto.
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <SiteSettingsContext.Provider value={settings}>
      {children}
    </SiteSettingsContext.Provider>
  );
}

export function useSiteSettings(): SiteSettings {
  return useContext(SiteSettingsContext);
}
```

- [ ] **Step 5: Scrivi l'hook dei CTA**

`frontend/src/hooks/useContactCta.ts`:

```ts
import { buildWhatsappUrl } from "@/config/site";
import { useSiteSettings } from "@/context/SiteSettingsContext";

export type ContactTarget = { href: string; external: boolean };

/**
 * Unica sede della decisione "WhatsApp o modulo". Con WhatsApp attivo apre la
 * chat con il messaggio precompilato; altrimenti porta al modulo di /contatti
 * trasportando lo stesso messaggio, cosi il contesto non si perde.
 *
 * Il controllo sull'handle vuoto e difensivo: anche se il backend lo impedisce,
 * il frontend non deve poter generare "wa.me/".
 */
export function useContactCta() {
  const { whatsappEnabled, whatsappHandle } = useSiteSettings();
  const active = whatsappEnabled && whatsappHandle !== "";

  function contactTarget(message: string): ContactTarget {
    if (active) {
      return { href: buildWhatsappUrl(whatsappHandle, message), external: true };
    }
    return {
      href: `/contatti?messaggio=${encodeURIComponent(message)}#modulo`,
      external: false,
    };
  }

  return { whatsappEnabled: active, contactTarget };
}
```

- [ ] **Step 6: Monta il provider in `App.tsx`**

Aggiungi l'import in cima:

```tsx
import { SiteSettingsProvider } from "./context/SiteSettingsContext";
```

E avvolgi il `<Suspense>` del `return`:

```tsx
  return (
    <SiteSettingsProvider>
      <Suspense fallback={<RouteFallback />}>
        {/* ...Routes invariate... */}
      </Suspense>
    </SiteSettingsProvider>
  );
```

- [ ] **Step 7: Riesegui la verifica dello Step 1**

```bash
cd frontend && npx tsc -b --noEmit 2>&1 | grep "whatsappUrl" ; cd ..
```

Atteso: **7 errori**, uno per ogni punto di chiamata rimasto (le 4 pagine categoria, `ServiceCard`, `EventDetail`, `Contatti`). È la conferma che l'inventario della spec era completo. Se il numero è diverso, fermati e riconcilia prima di proseguire.

- [ ] **Step 8: Commit**

```bash
git add frontend/src/context/SiteSettingsContext.tsx frontend/src/hooks/useContactCta.ts frontend/src/config/site.ts frontend/src/App.tsx
git commit -m "feat(frontend): impostazioni del sito lette a runtime e hook dei CTA di contatto"
```

---

### Task 4: Pagina Contatti — sezione condizionale, ancora, precompilazione

**Files:**
- Modify: `frontend/src/pages/Contatti.tsx`
- Modify: `frontend/src/components/ui/ContactForm.tsx`

**Interfaces:**
- Consumes: `useContactCta` dal Task 3; `sectionBackground` da `@/lib/sectionBackground`; `useHashScroll` da `@/hooks/useHashScroll`.
- Produces: ancora `#modulo` sulla card del modulo di `/contatti`; `ContactForm` che precompila la textarea da `?messaggio=`.

- [ ] **Step 1: Modifica `Contatti.tsx`**

Sostituisci l'import di `whatsappUrl` con:

```tsx
import { useContactCta } from "@/hooks/useContactCta";
import { useHashScroll } from "@/hooks/useHashScroll";
import { sectionBackground } from "@/lib/sectionBackground";
```

In cima al componente:

```tsx
  const { whatsappEnabled, contactTarget } = useContactCta();
  useHashScroll(true);

  // Le sezioni alternano gli sfondi: senza il blocco WhatsApp, quello dei
  // contatti scala di una posizione e si riprende il bianco.
  const contactSectionBg = sectionBackground(whatsappEnabled ? 2 : 1);
  const formCardBg = whatsappEnabled ? "bg-white" : "bg-brand-base";
```

Avvolgi la sezione WhatsApp esistente in `{whatsappEnabled && ( ... )}` e sostituisci il suo `href` con `contactTarget(...)`. La sezione diventa:

```tsx
      {whatsappEnabled && (
        <section className="w-full py-24 px-4 bg-white">
          <div className="container mx-auto max-w-3xl flex flex-col items-center text-center">
            <h2 className="font-serif text-3xl md:text-4xl text-brand-primary mb-6">
              Contattami su WhatsApp
            </h2>
            <p className="text-lg md:text-xl text-brand-contrast/80 leading-relaxed font-light mb-10">
              Preferisci scrivere due righe invece di compilare un modulo? Mandami
              un messaggio su WhatsApp: ti rispondo appena mi libero.
            </p>
            <a
              href={
                contactTarget(
                  "Ciao Stefania! Ti scrivo dal sito, vorrei qualche informazione.",
                ).href
              }
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-3 rounded-full font-bold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-secondary bg-accent-green-dark text-white hover:bg-accent-green-dark/90 h-14 px-10 text-lg shadow-sm"
            >
              <WhatsAppGlyph className="h-6 w-6" />
              Scrivimi su WhatsApp
            </a>
          </div>
        </section>
      )}
```

Sostituisci le due classi di sfondo fisse con le variabili. La sezione contatti:

```tsx
      <section className={`py-24 px-4 ${contactSectionBg} overflow-hidden relative`}>
```

E la card del modulo, che prende anche l'ancora:

```tsx
            <div
              id="modulo"
              className={`lg:col-span-3 ${formCardBg} p-8 md:p-12 rounded-[2rem] shadow-soft relative overflow-hidden scroll-mt-24`}
            >
```

`scroll-mt-24` compensa la navbar fissa, come già fa `ServiceOverview`.

- [ ] **Step 2: Precompila il modulo in `ContactForm.tsx`**

Aggiungi l'import:

```tsx
import { useSearchParams } from "react-router-dom";
```

In cima al componente:

```tsx
  // I CTA del sito rimandano qui con la stessa frase che avrebbero mandato su
  // WhatsApp, cosi il contesto di provenienza non si perde.
  const [searchParams] = useSearchParams();
  const prefilledMessage = searchParams.get("messaggio") ?? "";
```

E sulla textarea, che resta non controllata:

```tsx
        <textarea
          key={prefilledMessage}
          id="message"
          name="message"
          required
          rows={5}
          defaultValue={prefilledMessage}
          className="w-full bg-white/50 border border-brand-contrast/20 rounded-md px-4 py-3 text-brand-contrast focus:outline-none focus:ring-2 focus:ring-brand-primary resize-none"
          placeholder="Scrivi qui il tuo messaggio..."
        />
```

La `key` forza il rimontaggio quando cambia il parametro: senza, arrivando da un secondo CTA senza ricaricare la pagina, `defaultValue` resterebbe quello vecchio.

- [ ] **Step 3: Verifica che il prerender mostri lo stato "spento"**

```bash
cd frontend && npm run build 2>&1 | tail -3 && cd ..
grep -c "Contattami su WhatsApp" frontend/dist/contatti/index.html
grep -c 'id="modulo"' frontend/dist/contatti/index.html
```

Atteso: build e prerender completati, poi `0` per la sezione WhatsApp (default spento) e `1` per l'ancora del modulo.

- [ ] **Step 4: Commit**

```bash
git add frontend/src/pages/Contatti.tsx frontend/src/components/ui/ContactForm.tsx
git commit -m "feat(contatti): sezione WhatsApp condizionale e modulo precompilabile"
```

---

### Task 5: CTA di servizi ed eventi

**Files:**
- Modify: `frontend/src/components/ui/ServiceCard.tsx`
- Modify: `frontend/src/pages/EventDetail.tsx`
- Modify: `frontend/src/pages/YogaPage.tsx`, `Trattamenti.tsx`, `Maternita.tsx`, `Consulenze.tsx`

**Interfaces:**
- Consumes: `useContactCta` dal Task 3.
- Produces: nessuna nuova interfaccia. Alla fine di questo task `npx tsc -b --noEmit` deve tornare pulito.

- [ ] **Step 1: `ServiceCard.tsx`**

Sostituisci l'import di `whatsappUrl` con `import { useContactCta } from "@/hooks/useContactCta";` e aggiungi `import { Link } from "react-router-dom";`.

In cima al componente:

```tsx
  const { whatsappEnabled, contactTarget } = useContactCta();
  const target = contactTarget(
    `Ciao Stefania! Vorrei informazioni sul servizio "${title}".`,
  );
  const ctaLabel = whatsappEnabled ? "Scrivimi su WhatsApp" : "Richiedi informazioni";
```

Sostituisci l'`<a>` fisso con:

```tsx
          {target.external ? (
            <a href={target.href} target="_blank" rel="noopener noreferrer">
              <Button
                variant="outline"
                className="w-full sm:w-auto mt-4 group/btn flex items-center gap-2"
              >
                {ctaLabel}
                <ArrowRight size={18} className="transition-transform group-hover/btn:translate-x-1" />
              </Button>
            </a>
          ) : (
            <Link to={target.href}>
              <Button
                variant="outline"
                className="w-full sm:w-auto mt-4 group/btn flex items-center gap-2"
              >
                {ctaLabel}
                <ArrowRight size={18} className="transition-transform group-hover/btn:translate-x-1" />
              </Button>
            </Link>
          )}
```

- [ ] **Step 2: Le 4 pagine categoria**

In ognuna di `YogaPage.tsx`, `Trattamenti.tsx`, `Maternita.tsx`, `Consulenze.tsx`: sostituisci `import { whatsappUrl } from "@/config/site";` con `import { useContactCta } from "@/hooks/useContactCta";`, e aggiungi in cima al componente, accanto alle altre `const`:

```tsx
  const { whatsappEnabled, contactTarget } = useContactCta();
```

Poi, nel `<ServiceOverview>`, sostituisci le due prop:

```tsx
              href={
                contactTarget(
                  `Ciao Stefania! Vorrei informazioni sul servizio "${service.title}".`,
                ).href
              }
              ctaText={whatsappEnabled ? "Scrivimi su WhatsApp" : "Richiedi informazioni"}
```

`ServiceOverview` non va toccato: distingue già i link esterni dagli interni con `/^https?:\/\//` e usa `<a target="_blank">` o il `Link` del router di conseguenza.

- [ ] **Step 3: `EventDetail.tsx`**

Sostituisci l'import di `whatsappUrl` con `import { useContactCta } from "@/hooks/useContactCta";`.

In cima al componente:

```tsx
  const { whatsappEnabled, contactTarget } = useContactCta();
```

Sostituisci il ramo `<a href={whatsappUrl(...)}>` con — nota i due messaggi e le due etichette distinte:

```tsx
            (() => {
              const message = event.isFull
                ? `Ciao Stefania! L'evento "${event.title}" risulta al completo: vorrei essere inserita/o in lista d'attesa.`
                : `Ciao Stefania! Vorrei prenotare un posto per l'evento "${event.title}".`;
              const target = contactTarget(message);
              const label = event.isFull
                ? "Richiedi lista d'attesa"
                : whatsappEnabled
                  ? "Prenota su WhatsApp"
                  : "Prenota un posto";
              const button = (
                <Button
                  variant={event.isFull ? "outline" : "primary"}
                  className="w-full py-6 text-lg shadow-sm hover:translate-y-[-2px] transition-transform"
                >
                  {label}
                </Button>
              );

              return target.external ? (
                <a href={target.href} target="_blank" rel="noopener noreferrer" className="block w-full">
                  {button}
                </a>
              ) : (
                <Link to={target.href} className="block w-full">
                  {button}
                </Link>
              );
            })()
```

E la riga di testo sotto il bottone, che nomina WhatsApp e va cambiata anche lei:

```tsx
              <p className="text-center text-sm text-brand-contrast/50 mt-4">
                {whatsappEnabled
                  ? "Scrivimi su WhatsApp per prenotare il tuo posto."
                  : "Compila il modulo per prenotare il tuo posto."}
              </p>
```

`Link` è già importato in `EventDetail.tsx` (lo usa il ramo "Evento Concluso").

- [ ] **Step 4: Verifica che la compilazione torni pulita**

```bash
cd frontend && npx tsc -b --noEmit && echo "TypeScript: pulito" && npm run build 2>&1 | tail -3 && cd ..
```

Atteso: nessun errore, `prerender complete: 11 routes`. I 7 errori del Task 3 sono tutti risolti.

- [ ] **Step 5: Verifica il comportamento nei due stati**

Con lo stack Docker attivo e `TOKEN` ottenuto come nel Task 2:

```bash
# Stato "spento"
curl -s -X POST http://localhost:8081/api/settings -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" -d '{"whatsappEnabled":false,"whatsappHandle":"xprot"}'
```

Apri `http://localhost:81/yoga-e-meditazione` e controlla: i bottoni dei servizi dicono "Richiedi informazioni" e portano a `/contatti?messaggio=...#modulo`, la pagina scrolla al modulo e la textarea è già compilata. Apri un evento da `http://localhost:81/laboratori-eventi` e controlla il bottone e la riga sotto. Apri `http://localhost:81/contatti`: nessuna sezione WhatsApp, sezione contatti su sfondo bianco, card del modulo color crema.

```bash
# Stato "acceso"
curl -s -X POST http://localhost:8081/api/settings -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" -d '{"whatsappEnabled":true,"whatsappHandle":"xprot"}'
```

Ricarica le stesse pagine: i bottoni tornano a "Scrivimi su WhatsApp" e puntano a `wa.me`, la sezione WhatsApp ricompare su sfondo bianco, la sezione contatti passa a crema e la card del modulo a bianco.

- [ ] **Step 6: Commit**

```bash
git add frontend/src/components/ui/ServiceCard.tsx frontend/src/pages/EventDetail.tsx frontend/src/pages/YogaPage.tsx frontend/src/pages/Trattamenti.tsx frontend/src/pages/Maternita.tsx frontend/src/pages/Consulenze.tsx
git commit -m "feat(frontend): CTA di servizi ed eventi verso WhatsApp o modulo"
```

---

### Task 6: Pagina admin delle impostazioni

**Files:**
- Create: `frontend/src/pages/admin/settings/AdminSettings.tsx`
- Modify: `frontend/src/App.tsx` (import lazy riga ~40, rotta dentro `<Route path="/admin" ...>` riga ~110)
- Modify: `frontend/src/components/admin/layout/AdminLayout.tsx` (import icone riga 2, `ADMIN_LINKS` righe 10-21)

**Interfaces:**
- Consumes: `POST /api/settings` e `GET /api/settings` dal Task 2; `Card`, `CardHeader`, `CardTitle`, `CardDescription`, `CardContent` e `Button` da `@/components/admin/ui`.
- Produces: rotta `/admin/settings`.

- [ ] **Step 1: Scrivi la pagina**

`frontend/src/pages/admin/settings/AdminSettings.tsx`:

```tsx
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import type { RootState } from "@/store";
import { apiFetch } from "@/lib/api";
import { Button } from "@/components/admin/ui/Button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/admin/ui/Card";

export function AdminSettingsPage() {
  const token = useSelector((state: RootState) => state.auth.token);
  const [whatsappEnabled, setWhatsappEnabled] = useState(false);
  const [whatsappHandle, setWhatsappHandle] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState<{ kind: "ok" | "error"; text: string } | null>(null);

  useEffect(() => {
    apiFetch("/settings")
      .then((data) => {
        setWhatsappEnabled(Boolean(data?.whatsappEnabled));
        setWhatsappHandle(typeof data?.whatsappHandle === "string" ? data.whatsappHandle : "");
      })
      .catch(() => setFeedback({ kind: "error", text: "Impossibile caricare le impostazioni." }))
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    setSaving(true);
    setFeedback(null);
    try {
      const saved = await apiFetch("/settings", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: { whatsappEnabled, whatsappHandle },
      });
      setWhatsappHandle(saved?.whatsappHandle ?? whatsappHandle);
      setFeedback({ kind: "ok", text: "Impostazioni salvate. Le pagine si aggiornano al prossimo caricamento." });
    } catch (error) {
      setFeedback({
        kind: "error",
        text: error instanceof Error ? error.message : "Errore durante il salvataggio.",
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-serif text-brand-primary mb-2">Impostazioni</h1>
        <p className="text-brand-contrast/60">
          Configura i canali di contatto mostrati sul sito pubblico.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>WhatsApp</CardTitle>
          <CardDescription>
            Con WhatsApp attivo i pulsanti di contatto aprono la chat. Disattivandolo
            spariscono la sezione WhatsApp dalla pagina Contatti e tutti i pulsanti
            rimandano al modulo di contatto.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {loading ? (
            <p className="text-brand-contrast/50">Caricamento in corso...</p>
          ) : (
            <>
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={whatsappEnabled}
                  onChange={(e) => setWhatsappEnabled(e.target.checked)}
                  className="h-5 w-5 rounded border-brand-contrast/30 accent-brand-primary"
                />
                <span className="font-medium text-brand-contrast">
                  Mostra i contatti WhatsApp sul sito
                </span>
              </label>

              <div className="space-y-2">
                <label htmlFor="whatsappHandle" className="text-sm font-medium text-brand-contrast">
                  Username o numero WhatsApp
                </label>
                <input
                  id="whatsappHandle"
                  type="text"
                  value={whatsappHandle}
                  onChange={(e) => setWhatsappHandle(e.target.value)}
                  placeholder="xprot oppure 393331234567"
                  className="w-full bg-white border border-brand-contrast/20 rounded-md px-4 py-3 text-brand-contrast focus:outline-none focus:ring-2 focus:ring-brand-primary"
                />
                <p className="text-sm text-brand-contrast/50">
                  Spazi, +, trattini e parentesi vengono rimossi automaticamente.
                </p>
              </div>

              {feedback && (
                <p className={feedback.kind === "ok" ? "text-accent-green-dark" : "text-brand-secondary"}>
                  {feedback.text}
                </p>
              )}

              <Button onClick={handleSave} disabled={saving}>
                {saving ? "Salvataggio..." : "Salva"}
              </Button>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
```

- [ ] **Step 2: Registra la rotta in `App.tsx`**

Accanto agli altri import lazy:

```tsx
const AdminSettingsPage = lazy(() => import("./pages/admin/settings/AdminSettings").then((m) => ({ default: m.AdminSettingsPage })));
```

E dentro `<Route path="/admin" element={<AdminLayout />}>`, dopo la rotta `bookings`:

```tsx
            <Route path="settings" element={<AdminSettingsPage />} />
```

- [ ] **Step 3: Aggiungi la voce di menu**

In `AdminLayout.tsx`, aggiungi `Settings` alla lista di icone importate da `lucide-react` e questa riga in fondo a `ADMIN_LINKS`:

```tsx
  { path: "/admin/settings", label: "Impostazioni", Icon: Settings },
```

- [ ] **Step 4: Verifica**

```bash
cd frontend && npx tsc -b --noEmit && echo "TypeScript: pulito" && cd ..
```

Poi su `http://localhost:81/admin/settings`: la voce "Impostazioni" compare nel menu, la pagina mostra lo stato corrente, il salvataggio con toggle attivo e campo svuotato mostra il messaggio d'errore del backend senza salvare, e un salvataggio valido si riflette su `curl -s http://localhost:8081/api/settings`.

- [ ] **Step 5: Commit**

```bash
git add frontend/src/pages/admin/settings/AdminSettings.tsx frontend/src/App.tsx frontend/src/components/admin/layout/AdminLayout.tsx
git commit -m "feat(admin): sezione Impostazioni per la configurazione dei contatti"
```

---

### Task 7: Bottone "mostra eventi passati" in admin

Indipendente dal resto del piano: si può eseguire in qualsiasi momento.

**Files:**
- Modify: `frontend/src/pages/admin/events/AdminEvents.tsx:56-70` (il filtro) e la testata a riga ~75

**Interfaces:**
- Consumes: niente. La pagina riceve già tutti gli eventi dall'API.
- Produces: niente.

- [ ] **Step 1: Aggiungi lo stato e rendi condizionale il filtro**

Aggiungi `History` agli import di `lucide-react` e, accanto agli altri `useState`:

```tsx
  // La pagina riceve gia tutti gli eventi: nascondere i passati e solo un
  // filtro di comodo, che si puo togliere per rimetterli mano.
  const [showPast, setShowPast] = useState(false);
```

Poi sostituisci la condizione dentro `events.filter(...)`:

```tsx
  const filteredEvents = events.filter(event => {
    if (!event.date) return true;
    if (showPast) return true;
    const eventDate = new Date(event.date);
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    const oneWeekAgo = new Date(now);
    oneWeekAgo.setDate(now.getDate() - 7);

    // Future events + past 7 days
    return eventDate >= oneWeekAgo;
  }).sort((a, b) => {
```

- [ ] **Step 2: Aggiungi il bottone nella testata**

Nella testata, avvolgi il link "Nuovo Evento" e il nuovo bottone in un contenitore:

```tsx
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setShowPast((v) => !v)}
            className="flex items-center gap-2 text-sm text-brand-contrast/60 hover:text-brand-primary transition-colors underline-offset-4 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary rounded-full px-2 py-1"
          >
            <History size={16} />
            {showPast ? "Nascondi eventi passati" : "Mostra anche eventi passati"}
          </button>

          <Link
            to="/admin/events/new"
            className="flex items-center gap-2 bg-brand-primary text-white px-6 py-3 rounded-full hover:bg-brand-primary/90 transition-colors font-medium shadow-sm hover:shadow-md"
          >
            <Plus size={20} />
            Nuovo Evento
          </Link>
        </div>
```

Il bottone è volutamente testuale e non pieno: è un filtro di comodo, non l'azione principale della pagina.

- [ ] **Step 3: Verifica**

```bash
cd frontend && npx tsc -b --noEmit && echo "TypeScript: pulito" && cd ..
curl -s http://localhost:8081/api/events | python3 -c "import sys,json;d=json.load(sys.stdin);print(len(d),'eventi totali,',sum(1 for e in d if e['is_past']),'passati')"
```

Su `http://localhost:81/admin/events`: con il bottone spento la lista mostra solo gli eventi recenti o futuri; premendolo compaiono anche i passati, in numero coerente con il conteggio del comando, ognuno apribile in modifica.

- [ ] **Step 4: Commit**

```bash
git add frontend/src/pages/admin/events/AdminEvents.tsx
git commit -m "feat(admin): bottone per mostrare anche gli eventi passati"
```

---

## Verifica finale

- [ ] `cd frontend && npm run lint` — nessun problema **nuovo** sui file toccati. Il progetto ha già circa 72 errori preesistenti (`@typescript-eslint/no-explicit-any` e `no-unused-vars`, quasi tutti sotto `src/pages/admin/**`): confrontare con lo stato prima delle modifiche, non pretendere zero.
- [ ] `cd frontend && npm run build` — build e `prerender complete: 11 routes`.
- [ ] `grep -c "Contattami su WhatsApp" frontend/dist/contatti/index.html` → `0`. L'HTML statico riflette il default "spento": è voluto.
- [ ] Con WhatsApp spento e l'API ferma (`docker stop stefaniamastroianni-backend`), il sito resta navigabile e tutti i CTA portano al modulo. Riavviare con `docker start stefaniamastroianni-backend`.
