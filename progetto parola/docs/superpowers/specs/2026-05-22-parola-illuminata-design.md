# Parola Illuminata — Design Doc

## Concept

Una pagina web dove l'utente inserisce una parola o frase. La parola appare al centro dello schermo, e un sole le orbita attorno illuminandola con un gradiente di luce che segue la posizione del sole.

## Tech Stack

- HTML5, CSS3, JavaScript vanilla
- Google Fonts (WebFontLoader)
- Zero dipendenze esterne
- Struttura: `index.html` + `css/style.css` + `js/script.js`

## Comportamento

- Animazione continua con parola di default all'avvio
- Utente può cambiare parola in tempo reale
- Utente può cambiare font tra una selezione di Google Fonts
- L'illuminazione si aggiorna a 60fps sincronizzata con l'orbita del sole

## Layout

- Sfondo schermo intero, colore spazio profondo (`#0a0a1a`)
- Parola centrata orizzontalmente e verticalmente
- Orbita ellittica visibile (cerchio sottile semitrasparente)
- Sole: cerchio con bagliore radiale, orbita in ~8 secondi
- Controlli in basso: input testo + selettore font + pulsante copia link

## Meccanismo Illuminazione

- Sole animato via CSS `@keyframes` con `transform: rotate()` su percorso circolare
- JavaScript in `requestAnimationFrame` legge la posizione del sole calcolando l'angolo corrente
- L'angolo viene convertito in una direzione per il gradiente lineare sulla parola
- Il gradiente ha 3 stop: chiaro → mezzaluce → scuro
- La parola usa `background-clip: text` per mostrare il gradiente solo sul testo

## Font

Selezione di 10 font Google molto diversi, caricati on-demand via WebFontLoader:

1. Orbitron (futuristico)
2. Playfair Display (elegante serif)
3. Monoton (display decorativo)
4. Rubik Dirt (grunge)
5. Major Mono Display (monospace)
6. Bangers (comic bold)
7. Press Start 2P (pixel retro)
8. WindSong (corsivo calligrafico)
9. IBM Plex Sans (clean sans)
10. UnifrakturMaguntia (gotico/blackletter)

## Stati e Edge Case

- **Testo vuoto:** mostra placeholder "scrivi qui..." con animazione attiva
- **Caricamento font:** fallback visibile durante il caricamento, swap senza flicker
- **Testo lungo:** font-size si riduce proporzionalmente, wrap con effetto luce mantenuto
- **Ridimensionamento:** orbita si scala con `min(40vw, 40vh)`
- **Performance:** `will-change: transform` sul sole, nessun layout thrashing nel loop

## Architettura File

```
progetto parola/
├── index.html          # struttura HTML, link a CSS/JS, Google Fonts loader
├── css/
│   └── style.css       # layout, animazione sole, tema scuro, controlli
└── js/
    └── script.js       # rAF loop, gradiente dinamico, input handling, font loader
```
