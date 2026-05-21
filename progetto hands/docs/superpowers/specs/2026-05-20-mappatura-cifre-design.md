# Mappatura Cifre 0-9 con Prossimità Pollice-Dita — Design Doc

## Overview
Primo di 3 script per un sistema di crittografia gestuale. Questo script mappa le cifre 0-9 in base a quali dita toccano il pollice (pattern binario a 4 bit). Esporta un file JSON con la mappatura.

## File
`mappatura.html` — script autonomo, separato dal precedente index.html

## Rilevamento Tocco
Per ogni dito (indice, medio, anulare, mignolo):
- Calcola la distanza minima tra tutti i keypoint del pollice (CMC, MCP, IP, TIP) e tutti i keypoint del dito (MCP, PIP, DIP, TIP)
- Se distanza < 30px → dito "tocca" il pollice → bit = 1
- Altrimenti → bit = 0
- Risultato: pattern a 4 bit (indice, medio, anulare, mignolo)

### Pattern binario
- Bit 0 (LSB): indice
- Bit 1: medio
- Bit 2: anulare
- Bit 3 (MSB): mignolo

## UI
- **Sfondo**: nero (#000)
- **Anteprima camera**: 240×180, in alto a destra, con bordino sottile bianco
- **Tabella numeri**: griglia di 10 celle (0-9), disposte 5×2 o 2×5
  - Grigio (#555) = non registrato
  - Bianco (#fff) = registrato
  - Ciano (#00ccff) = attualmente riconosciuto
- **Pulsante "Export Key"**: in basso al centro, disabilitato finché non tutte 10 cifre registrate
- **Scheletro mano**: non viene disegnato (solo anteprima video per feedback visivo)

## Registrazione
1. Click cifra → countdown 3-2-1 al centro schermo
2. Sistema cattura il pattern di tocco delle dita
3. Salva il pattern binario per quella cifra
4. Cifra diventa bianca
5. Dopo tutte 10 cifre → Export Key abilitato

## Export Key
- Formato: JSON
- Nome file: `chiave-mappatura.json`
- Contenuto:
```json
{
  "nome": "chiave-mappatura",
  "data": "2026-05-20",
  "mappatura": {
    "0": [false, false, false, false],
    "1": [true, false, false, false],
    ...
  }
}
```

## Dipendenze
- Stesse dell'index.html: TensorFlow.js, MediaPipe, HandPose Detection
- Caricate via CDN

## Scheletro mano
Non disegnato a schermo — solo l'anteprima video fornisce feedback visivo della posizione della mano.
