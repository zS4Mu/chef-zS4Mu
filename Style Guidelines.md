# Style Guidelines — Home Page

## Tipografia

| Elemento | Font | Size | Weight | Letter-spacing | Line-height |
|----------|------|------|--------|----------------|-------------|
| **H1 Hero** | Thunder-VF | 34rem | 900 | 0.005em | 0.85 |
| **Hero Subtitle** | DM Sans | 2.2rem | 500 | — | 1.5 |
| **H2** | DM Sans | 3rem | 500 | -0.03em | 1.5 |
| **H3** | DM Sans | 2.5rem | 500 | -0.03em | 1.5 |
| **Body** | DM Sans | 1.7rem | 300 | — | 1.5 |
| **Caption** | DM Sans | 1rem | 300 | — | 1.5 |
| **Gap Text H2** | DM Sans | 1.7rem | 700 | -0.02em | 1.3 |
| **Gap Text Body** | DM Sans | 1.7rem | 300 | -0.02em | 1.3 |
| **Mosaic Label** | DM Sans | 1.7rem | 600 | — | 1.5 |

### Font

- **DM Sans** — [Google Fonts](https://fonts.google.com/specimen/DM+Sans) (300 / 500 / 700)
- **Thunder-VF** — font proprietario in `font/Thunder-VF.ttf`, caricato via `@font-face`

### Hero H1

- Font: Thunder-VF, uppercase
- `mix-blend-mode: difference` (bianco su pattern animato)
- `user-select: none`
- Struttura: "SPERIMENTAL" + riga successiva "PROJECTS" via `<span class="hero-h1-sub">`

---

## Colori

| Ruolo | Colore | HEX |
|-------|--------|-----|
| **Primary** | Verde lime | `#A3FB00` |
| **Text** | Nero | `#000000` |
| **Background** | Bianco | `#FFFFFF` |
| **Pattern FG** | Rosso | `#ef1119` |
| **Pattern BG** | Verde | `#97fb00` |

### Hover State

| Elemento | Hover |
|----------|-------|
| **Link / Icon** | Opacity 0.5 |
| **Back Button** | Background `#A3FB00` |

### Mosaic Item Backgrounds

| Item | Color |
|------|-------|
| Row 1, Item 1 | `#A3FB00` |
| Row 1, Item 2 | `#e0e0e0` |
| Row 2, Item 1 | `#ffd54f` |
| Row 2, Item 2 | `#b39ddb` |
| Row 3, Item 1 | `#80cbc4` |
| Row 4, Item 1 | `#ffab91` |
| Row 4, Item 2 | `#90caf9` |

---

## Hero

- Min-height: 600px
- Pattern SVG animato via JavaScript (Perlin noise su celle)
- Pattern confinato al `.hero` con `overflow: hidden`
- Sfumatura mask: visibile 0–75%, fade 75%→100%
- Pattern CSS custom properties:
  - `--hero-blur`: `20px` (filtro blur sul pattern)
  - `--hero-line-height`: `0.85`
  - `--hero-opacity`: `0.5`
  - `--pattern-fg`: `#ef1119`
  - `--pattern-bg`: `#97fb00`
- Pattern posizionato absolute dentro hero (relative), `pointer-events: none`, `z-index: 0`

---

## Mosaic Grid

- Layout: flex row (`.mosaic-row`) dentro flex column (`.mosaic`)
- Padding laterale: `0 9rem`
- Margine superiore: `12rem`
- Nessun gap tra gli item
- Z-index: item `2`, gap text `1`

### Item Hover

- Item hoverato: `flex: 2`, altezza × 1.5
- Item fratelli: `flex: 1`, altezza × 0.75
- Transizione: `0.55s cubic-bezier(0.4, 0, 0.2, 1)`

### Gap Text

- Posizionato absolute in fondo alla riga
- Usa lo spazio verticale residuo tra item più alto e item più basso della riga
- Contenuto: HELLO! + bio (riga 1, item 3), "No brain, No Gain" + credits workshop (riga 3, item 6)

### Label Item

- Posizionato absolute in basso, sempre visibile
- Gradient overlay: trasparente → nero 70%

---

## Footer

- Layout: flex, space-between, max-width 1200px, padding 2rem
- Bordo superiore: `1px solid #e0e0e0`
- Icone: outline SVG, dimensioni 28×28px
- Colori: stroke `#000`, fill `none` (tranne dot Instagram fill `#000`)
- Nessun testo, nessuno sfondo/bordo
- Pulsante top: SVG freccia su, stesso stile icone

---

## Project View

- View switching via History API (`pushState` / `popstate`)
- Solo pulsante indietro (icona freccia SVG) + iframe full-height
- Back button: 32×32px box, SVG 24×24px inside, hover bg `#A3FB00`
- iframe: `min-height: 70vh`, border-radius `0.8rem`
- Permessi iframe: `camera *; microphone *`

---

## CSS Custom Properties

```css
:root {
  --hero-blur: 20px;
  --hero-line-height: 0.85;
  --hero-opacity: 0.5;
  --pattern-fg: #ef1119;
  --pattern-bg: #97fb00;
}
```

---

## Responsive

- A `max-width: 768px`:
  - Mosaic row diventa colonna (flex-direction: column)
  - Padding mosaico ridotto a `0 4rem`
  - Footer in colonna
