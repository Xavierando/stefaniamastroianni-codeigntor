# DESIGN.md - Stefania Mastroianni

Questo documento definisce il linguaggio visivo **"Empathic Serenity"**, un'estetica che fonde il calore della fotografia editoriale di fascia alta (ispirazione Airbnb/Vogue) con un minimalismo empatico e umano. È progettato per trasmettere fiducia, accoglienza e professionalità nel mondo del benessere e della maternità.

---

## 1. Filosofia e Atmosfera
- **Concept:** "Empathic Serenity"
- **Mood:** Organico, Materico, Silenzioso, Rigenerante.
- **Principi:** Massiccio uso di spazio negativo (Whitespace) per eliminare l'ansia visiva. Le immagini sono protagoniste assolute, mai oscurate da layer neri, ma integrate tramite transizioni morbide o cornici sferiche.

---

## 2. Palette Colori (Aura Naturale)
I colori non sono mai chimici o industriali, ma derivano da elementi naturali come argilla, carta e lino.

| Ruolo | Variabile | Hex | Utilizzo |
|------|------|-----|-------|
| **Sfondo Principale** | `brand-base` | `#FBF8F1` | Panna caldissimo, la base "carta" del sito. |
| **Superficie Pura** | `white` | `#FFFFFF` | Bianco candido per sezioni alternate e card. |
| **Accento Primario** | `brand-primary` | `#B86B5A` | Terracotta/Argilla: per titoli, loghi e azioni principali. |
| **Accento Relax** | `brand-secondary` | `#8C9B86` | Verde Salvia: per icone e dettagli di guarigione. |
| **Testo Ink** | `brand-contrast` | `#2D2422` | Marrone Inchiostro profondo (sostituisce il Nero). |

---

## 3. Tipografia Editoriale
- **Titoli (Serif):** "Playfair Display". Utilizzato per dare autorevolezza e dolcezza. I titoli devono avere un'interlinea stretta (`leading-tight`) per un look premium.
- **Corpo e UI (Sans):** "Nunito" o "Lato". Forme arrotondate per massimizzare la leggibilità e la morbidezza.
- **Wordmark Identity:** Il nome del brand usa un mix di Serif (Stefania) e Sans maiuscoletto ultra-spaziato (MASTROIANNI) per un effetto "Luxury Boutique".

---

## 4. Architettura dei Componenti

### Layout "Universal Cover" (Standard)
Tutte le pagine principali (Home, Bio, Servizi) devono aprirsi con una **Copertina Full-Bleed**:
- Foto a tutto schermo (Edge-to-Edge).
- Assenza di testo sovrapposto (per far parlare l'immagine).
- Angoli inferiori netti per la copertina, ma contenuti interni fortemente smussati.

### Floating Navbar (Morfica)
La navigazione è una "pillola" flottante con effetto `backdrop-blur` (Glassmorphism caldo):
- **Desktop:** Pillola estesa con logo e link.
- **Mobile Transition:** Comportamento intelligente. All'inizio è una "Bolla" circolare a destra con solo l'Hamburger. Durante lo scroll si espande in una pillola completa verso sinistra svelando il logo. L'icona resta "bullonata" nella stessa posizione fisica per evitare jitter (Drunken Effect).

### Empathic Cards & Sections
- **Bordi:** Aboliti (`border-0`). La separazione avviene per contrasto di colore (Color Blocking) tra Panna e Bianco.
- **Arrotondamento:** Coerente e generoso. `rounded-[2rem]` per mobile, `rounded-[3rem]` per desktop.
- **Buttons:** Sempre a "Pillola" (`rounded-full`), pieni e con ombreggiature impalpabili.

---

## 5. Regole d'Oro per lo Sviluppo
1. **Nessun Placeholder:** Usare solo fotografie reali e calde dal corpus del progetto.
2. **Zero Rigidità:** Se una riga di testo sembra troppo lunga, aumentare il padding, non ridurre il font.
3. **Morbidezza Animata:** Ogni transizione (hover, scroll, morphing) deve durare tra i 500ms e i 700ms con curve `ease-in-out` per simulare un movimento naturale.
4. **Logo Master-Mask:** Se il file logo è bianco, non usare filtri `invert`, ma la tecnica della maschera CSS per colorarlo dinamicamente con `brand-primary`.
