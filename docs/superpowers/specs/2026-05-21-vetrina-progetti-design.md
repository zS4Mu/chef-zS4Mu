# Design — Vetrina Progetti

## Overview

Sito web statico a pagina singola (SPA-like con view switching) che funge da vetrina per i progetti realizzati durante un workshop. Il sito mostra una griglia a mosaico di progetti sulla home page e, al click su un progetto, mostra il suo contenuto in una vista dettaglio con back button.

## Architettura

- **Stack:** HTML vanilla + CSS + JavaScript (nessun framework)
- **Struttura:** Singolo `index.html` con due `<section>`: `#home` e `#project-view`
- **View switching:** JS controlla classi CSS (`display: none / block`) per mostrare/nascondere le viste
- **Caricamento progetti:** Il contenuto HTML di ogni progetto viene estratto dal suo file e inserito nel DOM nella `#project-view`, ereditando lo stile globale del sito

## Navigazione

- **Home (`#home`):** Visibile di default. Mostra hero + griglia progetti + footer.
- **Vista progetto (`#project-view`):** Nascosta di default. Mostrata al click su un progetto. Contiene:
  - Back button (in alto a sinistra) — torna alla home
  - Titolo del progetto
  - Contenuto del progetto caricato dinamicamente
- **Back button:** Nasconde `#project-view`, mostra `#home`

## Home Page Layout

### Hero Section
- Titolo (H1) con tema sulla "sperimentazione"
- Tipografia ricercata (Thunder)
- Animazione sfocata / elemento decorativo sotto il titolo
- Da definire nel dettaglio in fase di implementazione

### Griglia Progetti (Mosaico)
- Layout a griglia quadrata
- Ogni progetto occupa uno spazio rettangolare di dimensioni diverse (es. 600x400, altri formati variabili)
- Ogni riquadro contiene: immagine di anteprima (da cartella `assets/thumbnails/`, formato da definire, il nome del file deve corrispondere al nome del progetto)
- Al click si apre la vista progetto
- Hover feedback da definire

### Footer
- Tre sezioni allineate: Social | Credits workshop (estremi del workshop) | Pulsante "Torna su" (estrema destra)

## Style Guide

### Tipografia

| Elemento | Font | Size | Weight | Kerning |
|----------|------|------|--------|---------|
| **H1** | Thunder-VF | 3.5rem | 700 | -3 |
| **H2** | DM Sans | 3rem | 500 | -3 |
| **H3** | DM Sans | 2.5rem | 500 | -3 |
| **Body** | DM Sans | 1.7rem | 300 | — |
| **Caption** | DM Sans | 1rem | 300 | — |

- Thunder-VF: font proprietario, file `Thunder-VF.ttf`, incluso via `@font-face`
- DM Sans: Google Fonts

### Colori

| Ruolo | Colore | HEX |
|-------|--------|-----|
| Primary | Verde lime | `#A3FB00` |
| Secondary | Grigio scuro | `#5A5A5A` |
| Sfondo | Bianco | `#FFFFFF` |

### Button States

| Stato | Fill | Text |
|-------|------|------|
| Active | `#A3FB00` | `#5A5A5A` |
| Hover | `#98EA00` | `#5A5A5A` |
| Pressed | `#82FB00` | `#5A5A5A` |
| Disabled | `#A3FB00` (30% opacity) | `#5A5A5A` (60% opacity) |

## Progetti

1. **Hands** (`progetto hands/`) — Progetto di riconoscimento gesti/mano
2. **Pattern** (`progetto pattern/`) — Progetto pattern/SVG
3. **Ricetta Tiramisù** (`progetto ricetta tiramisù/`) — Ricetta interattiva
4. **Sound Responsive** (`progetto sound responsive/`) — SVG reattivo al suono

Ogni progetto ha una immagine di anteprima da inserire in `thumbnails/`.

## Future (non implementato in questa fase)

- Punto 4: espediente originale di navigazione/interazione (da definire e implementare successivamente)
