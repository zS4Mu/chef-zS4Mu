# Sito Web Ricetta Tiramisù — Specifica di Progetto

**Data:** 2026-05-18
**Stato:** Approvato

## Panoramica

Sito web a pagina singola per la ricetta del tiramisù dello chef Sasso.
Bilingue (Italiano/Inglese) con stile retro-futuristico.

## Struttura File

```
progetto ricetta tiramisù 2/
├── index.html        # Struttura della pagina
├── style.css         # Stile retro-futuristico
├── script.js         # Logica interattiva
└── Ricetta Tiramisù.md  # Ricetta originale (non toccata)
```

Nessun build tool. Il sito si apre direttamente aprendo `index.html` nel browser.

## Layout della Pagina (dall'alto verso il basso)

1. **Header** — Nome ricetta + chef (Sasso). Pulsante cambio lingua IT/EN in alto a destra.
2. **Selettore porzioni** — Dropdown con numeri pari predefiniti (2, 4, 6, 8, 10, 12) e input manuale per numero personalizzato. Le quantità ingredienti si ridimensionano proporzionalmente (base: 8 porzioni).
3. **Ingredienti** — Lista con quantità scalate in tempo reale al cambio porzioni.
4. **Preparazione** — Step numerati, ognuno con checkbox cliccabile.
5. **Condivisione** — Pulsante che copia il link della pagina.
6. **Footer** — Crediti chef, diritti riservati / copyright.

## Stile Visivo: Retro-Futuristico

- **Sfondo**: Viola scuro/nero con texture grain via CSS
- **Colori accent**: Arancione atomico #FF6B35, Teal #00B4D8, Hot Pink #FF1493
- **Forme**: Linee curve, angoli aerodinamici, bordi metallici con gradienti
- **Texture**: Grain filter, rumore visivo, effetto vecchio schermo TV
- **Tipografia**: [Anta](https://fonts.google.com/specimen/Anta) per titoli, font system-ui per corpo
- **Pulsanti**: Stile analogico, bordi spessi, colori neon, effetto flicker al hover

## Comportamento JavaScript

### Lingua (IT/EN)
- Oggetto dati con tutte le stringhe in entrambe le lingue
- Toggle IT/EN scambia il testo visibile senza ricaricare la pagina
- Stato delle checkbox non viene perso al cambio lingua

### Porzioni
- Ricetta base per 8 porzioni
- Scalatura: `(nuovoNumero / 8) * quantitàBase`
- Input manuale accetta solo numeri interi positivi

### Checkbox Step
- Ogni step di preparazione ha una checkbox
- Stato salvato in memoria (si resetta al refresh)

### Condivisione
- Copia URL corrente negli appunti
- Feedback visivo "Link copiato!" per 2 secondi

## Dati Ricetta (Base: 8 porzioni)

### Ingredienti

- Mascarpone: 1 kg
- Uova: 8
- Savoiardi: 350 g (~42 pezzi)
- Zucchero: 200 g
- Caffè: 200 g
- Cacao amaro: q.b.

### Preparazione (7 step)

Vedi `Ricetta Tiramisù.md` per i dettagli completi. Ogni step viene tradotto in IT e EN.
