# HandPose Gesture Recognition Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add gesture-to-letter recognition to the existing HandPose Label Grid app, allowing users to register gestures via on-screen alphabet table and recognize them in real-time.

**Architecture:** All additions go into the existing `index.html`. Template store in memory (resets on refresh). Nearest Neighbor classification with normalized landmarks.

**Tech Stack:** Same as existing (TF.js HandPose Detection, MediaPipe runtime, Canvas 2D)

---

### Task 1: Add template store and landmark normalization

**Files:**
- Modify: `index.html`

Add this block after the COLORS constant:

- [ ] **Step 1: Add constants and state for gesture templates**

```js
const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
const templates = {};
const RECOGNITION_THRESHOLD = 0.3;
const STABILITY_FRAMES = 5;
let recognitionBuffer = [];
let recognizedLetter = null;
let recordingState = null; // { letter, countdown }
let notification = null; // { letter, timer }

function normalizeHand(keypoints) {
  const wrist = keypoints[0];
  const points = keypoints.map(k => ({ x: k.x - wrist.x, y: k.y - wrist.y }));
  let maxDist = 0;
  for (const p of points) {
    const d = Math.sqrt(p.x * p.x + p.y * p.y);
    if (d > maxDist) maxDist = d;
  }
  if (maxDist === 0) return points;
  return points.map(p => ({ x: p.x / maxDist, y: p.y / maxDist }));
}

function captureGesture(hands, letter) {
  const data = {};
  for (const hand of hands) {
    data[hand.handedness] = normalizeHand(hand.keypoints);
  }
  templates[letter] = data;
}
```

- [ ] **Step 2: Verify by code review — functions defined, no syntax errors**

---

### Task 2: Add alphabet table drawing and click handling

**Files:**
- Modify: `index.html`

Add this block after the `drawLabel` function:

- [ ] **Step 1: Add alphabet table drawing function**

```js
const TABLE_COLS = 7;
const TABLE_ROWS = 4;
const CELL_SIZE = 32;
const CELL_GAP = 4;
const TABLE_MARGIN = 60;

function getTableOrigin() {
  const totalW = TABLE_COLS * (CELL_SIZE + CELL_GAP);
  return { x: canvas.width - TABLE_MARGIN - totalW, y: TABLE_MARGIN };
}

function drawAlphabetTable() {
  const origin = getTableOrigin();
  for (let i = 0; i < ALPHABET.length; i++) {
    const col = i % TABLE_COLS;
    const row = Math.floor(i / TABLE_COLS);
    const x = origin.x + col * (CELL_SIZE + CELL_GAP);
    const y = origin.y + row * (CELL_SIZE + CELL_GAP);
    const letter = ALPHABET[i];
    let color = '#555';
    if (recognizedLetter === letter) {
      color = '#00ffcc';
    } else if (templates[letter]) {
      color = '#fff';
    }
    ctx.fillStyle = color;
    ctx.font = '18px monospace';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(letter, x + CELL_SIZE / 2, y + CELL_SIZE / 2);
  }
}

function getClickedLetter(mx, my) {
  const origin = getTableOrigin();
  for (let i = 0; i < ALPHABET.length; i++) {
    const col = i % TABLE_COLS;
    const row = Math.floor(i / TABLE_COLS);
    const x = origin.x + col * (CELL_SIZE + CELL_GAP);
    const y = origin.y + row * (CELL_SIZE + CELL_GAP);
    if (mx >= x && mx <= x + CELL_SIZE && my >= y && my <= y + CELL_SIZE) {
      return ALPHABET[i];
    }
  }
  return null;
}
```

- [ ] **Step 2: Add click handler on the canvas**

```js
canvas.addEventListener('click', (e) => {
  const rect = canvas.getBoundingClientRect();
  const scaleX = canvas.width / rect.width;
  const scaleY = canvas.height / rect.height;
  const mx = (e.clientX - rect.left) * scaleX;
  const my = (e.clientY - rect.top) * scaleY;
  const letter = getClickedLetter(mx, my);
  if (letter && !templates[letter] && !recordingState) {
    recordingState = { letter, countdown: 3, timer: 0 };
  }
});
```

- [ ] **Step 3: Verify by code review**

---

### Task 3: Add recording mode with countdown

**Files:**
- Modify: `index.html`

Add this after the `captureGesture` function:

- [ ] **Step 1: Add countdown drawing and update logic**

```js
function drawCountdown() {
  if (!recordingState) return;
  const msg = `Registrazione ${recordingState.letter}... ${recordingState.countdown}`;
  ctx.font = '36px monospace';
  ctx.fillStyle = '#fff';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(msg, canvas.width / 2, canvas.height / 2);
}

function updateRecording(deltaSec) {
  if (!recordingState) return;
  recordingState.timer += deltaSec;
  const prev = recordingState.countdown;
  recordingState.countdown = Math.ceil(3 - recordingState.timer);
  if (prev !== recordingState.countdown && recordingState.countdown > 0) {
    recordingState.letter = recordingState.letter; // just trigger re-read
  }
  if (recordingState.timer >= 3) {
    return true;
  }
  return false;
}
```

- [ ] **Step 2: Verify by code review**

---

### Task 4: Add recognition engine

**Files:**
- Modify: `index.html`

Add this after the `drawAlphabetTable` functions:

- [ ] **Step 1: Add recognition logic**

```js
function euclideanDistance(a, b) {
  if (!a || !b || a.length !== b.length) return Infinity;
  let sum = 0;
  for (let i = 0; i < a.length; i++) {
    const dx = a[i].x - b[i].x;
    const dy = a[i].y - b[i].y;
    sum += dx * dx + dy * dy;
  }
  return Math.sqrt(sum / a.length);
}

function recognizeGesture(hands) {
  if (Object.keys(templates).length === 0) return null;
  let bestLetter = null;
  let bestDist = Infinity;
  for (const [letter, template] of Object.entries(templates)) {
    let totalDist = 0;
    let matched = 0;
    for (const hand of hands) {
      const templateHand = template[hand.handedness];
      if (!templateHand) continue;
      const norm = normalizeHand(hand.keypoints);
      const dist = euclideanDistance(norm, templateHand);
      totalDist += dist;
      matched++;
    }
    if (matched === 0) continue;
    const avgDist = totalDist / matched;
    if (avgDist < bestDist) {
      bestDist = avgDist;
      bestLetter = letter;
    }
  }
  if (bestDist < RECOGNITION_THRESHOLD) {
    return bestLetter;
  }
  return null;
}
```

- [ ] **Step 2: Verify by code review**

---

### Task 5: Add notification system

**Files:**
- Modify: `index.html`

Add this after the `drawCountdown` function (or merge into same section):

- [ ] **Step 1: Add notification drawing and update**

```js
function showNotification(letter) {
  notification = { letter, timer: 0 };
}

function drawNotification() {
  if (!notification) return;
  const alpha = Math.max(0, 1 - notification.timer / 1.5);
  ctx.font = '28px monospace';
  ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(`Riconosciuto: ${notification.letter}`, canvas.width / 2, canvas.height - 60);
}

function updateNotification(deltaSec) {
  if (!notification) return;
  notification.timer += deltaSec;
  if (notification.timer >= 1.5) {
    notification = null;
  }
}
```

- [ ] **Step 2: Verify by code review**

---

### Task 6: Wire everything into the detect loop + render

**Files:**
- Modify: `index.html`

- [ ] **Step 1: Update `detectLoop` to handle recording and recognition**

Replace the `detectLoop` function:

```js
let lastTimestamp = 0;

async function detectLoop(timestamp) {
  const deltaSec = lastTimestamp ? (timestamp - lastTimestamp) / 1000 : 0.016;
  lastTimestamp = timestamp;

  try {
    const hands = await detector.estimateHands(video, { flipHorizontal: true });

    if (recordingState) {
      if (updateRecording(deltaSec)) {
        captureGesture(hands, recordingState.letter);
        recordingState = null;
      }
    } else {
      const current = recognizeGesture(hands);
      if (current) {
        recognitionBuffer.push(current);
        if (recognitionBuffer.length > STABILITY_FRAMES) {
          recognitionBuffer.shift();
        }
        const counts = {};
        for (const l of recognitionBuffer) {
          counts[l] = (counts[l] || 0) + 1;
        }
        let maxCount = 0;
        let stableLetter = null;
        for (const [l, c] of Object.entries(counts)) {
          if (c > maxCount) { maxCount = c; stableLetter = l; }
        }
        if (maxCount >= STABILITY_FRAMES * 0.6) {
          if (recognizedLetter !== stableLetter) {
            recognizedLetter = stableLetter;
            showNotification(stableLetter);
          }
        }
      } else {
        recognitionBuffer = [];
        recognizedLetter = null;
      }
    }

    render(hands);
    drawAlphabetTable();
    drawCountdown();
    drawNotification();
    updateNotification(deltaSec);

  } catch (err) {
    console.error('Detection error:', err);
  }
  requestAnimationFrame(detectLoop);
}
```

- [ ] **Step 2: Verify by code review — check `detectLoop` signature change (now takes `timestamp` parameter)**

- [ ] **Step 3: Open in browser and test**

Open `http://localhost:8080` and:
1. Verify alphabet table appears top-right, all gray
2. Click a letter → countdown appears
3. Hold hand gesture → after 3s, letter turns white
4. Make registered gesture → letter glows cyan + notification
5. Refresh → all letters gray again
