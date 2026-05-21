# Tiramisù Recipe Website — Design Doc

**Data:** 2026-05-18
**Chef:** Sasso
**Stack:** Vanilla HTML/CSS/JS (nessun framework)

## Obiettivo

Single page interattiva per la ricetta del tiramisù. Italiano. Aprire direttamente nel browser, niente build o server.

## Architettura

Tre file nella cartella `codebase/`:
- `index.html` — struttura semantica della pagina
- `style.css` — stili, palette, responsive layout
- `script.js` — interattività (dosimetro, checklist, localStorage)

Niente dipendenze. Niente build step.

## Sezioni della pagina

1. **Header** — "Ricetta Tiramisù", Chef Sasso, sottotitolo descrittivo
2. **Ingredienti** — lista dosata con slider porzioni (default 6, range 2-20). Quantità si ricalcolano in tempo reale al variare dello slider
3. **Preparazione** — 7 step numerati, ognuno con checkbox. Stato persistito in localStorage
4. **Footer** — credits minimali

## Flusso dati

- Dosi base per 6 porzioni
- Slider → fattore moltiplicatore: `porzioni / 6`
- Ricalcolo: `quantità_base * fattore`
- Uova arrotondate all'intero superiore
- Zucchero, caffè arrotondati al grammo più vicino
- Quantità salvate in localStorage per persistenza tra sessioni

## Persistenza (localStorage)

| Chiave | Valore | Descrizione |
|--------|--------|-------------|
| `tiramisu-checklist` | `[true, false, ...]` | Array booleani, uno per step |
| `tiramisu-porzioni` | `8` | Numero porzioni selezionato |

## Palette colori

Toni caldi ispirati al tiramisù:
- Caffè scuro: `#3C1F0E`
- Cacao: `#6B3A2A`
- Crema: `#F5E6D3`
- Panna: `#FFF8F0`
- Verde check: `#4CAF50`

## Responsive

- **Mobile** (≤768px): colonna singola, ingredienti sopra preparazione
- **Desktop** (>768px): due colonne (ingredienti a sinistra, preparazione a destra)

## Checklist

- Step completati: testo barrato + verde, checkbox checked
- Stato persiste anche dopo chiusura del browser
- Bottone "Reset" per ricominciare

## Error handling

- Dati localStorage corrotti → reset automatico ai default
- Slider validato tra 2 e 20
- Se ingredienti non parsabili, mostra quantità base senza modifiche
