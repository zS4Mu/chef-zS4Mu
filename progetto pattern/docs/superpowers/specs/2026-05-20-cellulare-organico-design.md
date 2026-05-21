# Generatore di Pattern Cellulare Organico

## Overview

Singola pagina HTML che genera in tempo reale un reticolo organico di cellule irregolari in bianco e nero. Le cellule sembrano tessuto biologico — membrane, coralli, schiuma — con impulsi luminosi che scorrono lungo i bordi come potenziali d'azione neuronali. Tre slider controllano velocità, dimensione e irregolarità. Esportazione in SVG e PNG.

## Specifica Tecnica

### Stack
- **Singolo file HTML** — nessuna dipendenza, nessun framework
- Canvas 2D per il rendering a schermo
- JS puro inline (ES6+)
- CSS inline per layout minimale

### Algoritmo di Generazione

1. **Griglia jitterata:** punti distribuiti su una griglia quadrata; ogni punto viene spostato casualmente entro un raggio `noise * cellSize / 2`. Lo slider "Dimensione" controlla la spaziatura della griglia, "Rumore" controlla lo scostamento massimo.

2. **Voronoi locale:** per ogni cella, si calcola il poligono di Voronoi intersecando i semi-piani con i vicini di griglia (max 8). Poiché il jitter non può superare metà spaziatura, la relazione di vicinanza è garantita — O(N) senza struttura dati spaziale complessa.

3. **Perturbazione organica:** ogni lato rettilineo del Voronoi viene suddiviso in 4-8 segmenti. I punti intermedi vengono spostati perpendicolarmente usando una funzione di rumore (somma di sinusoidi o Perlin semplificato). Il parametro "Rumore" scala l'ampiezza. I lati diventano curve ondulate, biomorfe.

4. **Rendering:** tutte le pareti cellulari sono disegnate in nero su sfondo bianco. Spessore del tratto: 1.5-3px basato sulla scala.

### Sistema di Animazione Neuronale

- **Attivazione:** ogni N frame (configurabile), una cella casuale viene attivata.
- **Propagazione:** l'attivazione si propaga ai vicini dopo un breve ritardo (cascata).
- **Refrattarietà:** una cella attivata non può riattivarsi per un periodo.
- **Pulse visivo:** quando un bordo è attraversato da un impulso, un segmento mobile bianco (o grigio chiaro) scorre lungo la linea nera del bordo, con coda degradante. L'effetto è di "corrente che passa" nel tessuto nero.
- **Slider Velocità:** controlla la velocità di scorrimento del pulse e la frequenza di attivazione.

### Slider

| Slider | Range | Effetto |
|--------|-------|---------|
| Velocità | 0.1 - 3.0 | Velocità animazione impulsi |
| Dimensione | 20 - 120 | Spaziatura griglia (pixel) |
| Rumore | 0.0 - 1.0 | Jitter punti + perturbazione bordi |

### Interfaccia

- Canvas full-screen / viewport
- Pannello in basso (overlay semi-trasparente):
  - 3 slider
  - Pulsante "Rigenera" (nuovo pattern)
  - Pulsante "Esporta SVG"
  - Pulsante "Esporta PNG"

### Esportazione

- **SVG:** la geometria vettoriale (poligoni perturbati) viene ricostruita e serializzata in un elemento `<svg>` con `<path>` per ogni cella. Download via Blob + URL.createObjectURL.
- **PNG:** `canvas.toDataURL('image/png')` → download.
- **Stato:** per l'SVG si esporta la struttura statica senza animazione; per il PNG si cattura il frame corrente.

### Raycasting "Mouse hover" (stretch goal)

Se il mouse passa sopra una cella, quella cella può attivare un impulso. Non essenziale per la V1.

## Comportamenti e Limiti

- Alla generazione iniziale, se `canvas` è più piccolo del numero minimo di celle, si scala la dimensione.
- Pulsante Rigenera: ricalcola da zero punti, Voronoi e perturbazione.
- Performance target: 60fps su hardware moderno fino a ~500 celle.
- Pattern determinato dal seed (non randomico a ogni frame — solo pulse lo è).

## Criteri di Successo

1. Pattern visualmente organico e biomorfo — non geometrico, non ripetitivo
2. Animazione fluida con evidente effetto "neurone che scarica"
3. Slider reattivi (aggiornamento in tempo reale)
4. Export funzionante per SVG e PNG
5. Singolo file HTML apribile senza server

## Non Obiettivi (V1)

- Colore (solo B/N)
- Audio
- Salvataggio stato / pattern preferiti
- Pattern generation asincrona / web worker
- Supporto touch oltre a slider nativi
