# Scrittura Cifre — Phase 2 Design

## Obiettivo

Fase 2 del sistema crittografico a 3 fasi basato su gesture delle mani.
Permette di "scrivere" cifre (0-9) replicando i gesti definiti nella chiave
di mappatura generata in Phase 1. La scrittura è "cieca": l'utente non vede
a video quale cifra corrisponde al gesto, deve saperlo dalla memoria della
chiave creata in Phase 1.

## Flusso utente

1. L'utente apre `scrittura.html`
2. Carica il file `chiave-mappatura.json` esportato in Phase 1
3. Il sistema valida il file e memorizza la mappatura `{hand, count} → digit`
4. L'utente mostra un gesto con la mano davanti alla camera
5. L'utente clicca "Scrivi"
6. Countdown 3-2-1
7. Al termine, il sistema cattura il gesto corrente (`hand`, `count`) e cerca
   la corrispondenza nella chiave. Se trovata, aggiunge la cifra al testo.
   Se non trovata, scarta silenziosamente.
8. L'utente può cliccare "Cancella" per rimuovere l'ultima cifra
9. Il testo finale è visibile e selezionabile per copia manuale

## Architettura

- **File**: `scrittura.html` (nuovo, single-file, nessun build tool)
- **Dipendenze CDN**: stesse di `mappatura.html` e `index.html`:
  - `@tensorflow-models/hand-pose-detection@2`
  - `@mediapipe/hands@0.4`
- **Infrastruttura condivisa** (da riutilizzare da Phase 1):
  - `countExtendedFingers()`, `isFingerStraight()` — finger counting
  - `COLORS`, `CLIENT`, `CONNECTIONS`, `drawLine()` — skeleton rendering
  - `startCamera()`, `initDetector()` — camera + detector setup

## Componenti UI (dall'alto verso il basso)

1. **File input** — `<input type="file" accept=".json">` per caricare la chiave
   - Mostrato all'avvio, obbligatorio
   - Validazione: struttura JSON con `nome`, `mappatura[0..9]`,
     ogni entry con `hand` (Left/Right) e `dita_estese` (0-4 integer)
   - Dopo caricamento valido: scompare o mostra "✓ Chiave caricata"

2. **Camera preview** — in alto a destra (stessa posizione di `mappatura.html`)
   - Stessa dimensione: 240×180, con bordo
   - Specchiata (flipHorizontal: true)
   - Scheletro: solo giunture (cerchi) e connessioni (linee), nessuna label A1-E5
   - Colori: ciano per mano destra, verde per mano sinistra

3. **Testo scritto** — al centro, caratteri grandi (monospace, ~48px)
   - Mostra la sequenza di cifre separate da spazi
   - Se vuoto, mostra testo placeholder "Nessuna cifra scritta"
   - Selezionabile dall'utente per copia

4. **Pulsanti**:
   - "Scrivi" — avvia countdown 3s, disabilitato durante countdown e se
     nessuna mano rilevata o chiave non caricata
   - "Cancella" — rimuove ultima cifra, disabilitato se testo vuoto

5. **Countdown** — testo grande al centro durante la cattura (3... 2... 1...)

6. **Stato** — testo in basso: mano rilevata/non rilevata, "Pronto" / "Scrittura..."

## Riconoscimento e cattura

- Riconoscimento continuo via `detectLoop()` (requestAnimationFrame)
- Ogni frame: calcola `getHandCount(hands, entry.hand)` per ogni entry
  nella mappatura. Se match con una entry registrata, quella è la cifra
  candidata.
- **Nessuna visualizzazione della cifra riconosciuta** — l'utente cattura
  "al buio", deve ricordare la mappatura
- Allo scadere del countdown:
  - Prende `{hand, count}` correnti
  - Cerca nella mappatura invertita `{hand, count} → digit`
  - Se trovato: push della cifra nell'array `writtenText`
  - Se non trovato: nessuna azione, nessun feedback

## Gestione testo

- `writtenText = []` (array di cifre, es. `[8, 3, 1, 5, 9]`)
- Renderizzato come stringa `"8 3 1 5 9"` (o senza spazi)
- Backspace: `writtenText.pop()`
- Clear: `writtenText = []`
- Persistenza solo in memoria — tutto si resetta al refresh

## Edge case

- **Nessuna mano rilevata durante countdown**: al termine, cattura fallisce,
  nessuna cifra aggiunta
- **Gesto cambiato durante countdown**: viene catturato il gesto al termine,
  non all'inizio
- **Due mani visibili**: il sistema usa `getHandCount` che filtra per mano
  specifica (sia Left che Right sono nella mappatura, quindi controlla
  entrambe le entry per ogni cifra)
- **Caricamento file non valido**: mostra errore, non attiva pulsanti
- **Nessuna chiave caricata**: solo l'input file è visibile, resto nascosto
