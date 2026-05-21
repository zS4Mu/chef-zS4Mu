# Mappatura Cifre 0-9 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Create a standalone script that maps digits 0-9 based on which fingers touch the thumb, exporting a JSON key file.

**Architecture:** Single `mappatura.html` with inline CSS/JS, CDN dependencies. Touch detection based on minimum distance between thumb and finger keypoints. Binary state per finger (touching/not touching).

**Tech Stack:** TensorFlow.js HandPose Detection (MediaPipe runtime), Canvas 2D, File API for export

---

### Task 1: Create HTML scaffold with CDN deps and CSS

**Files:**
- Create: `mappatura.html`

- [ ] **Step 1: Write HTML scaffold**

```html
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Mappatura Cifre</title>
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  html, body { width: 100%; height: 100%; overflow: hidden; background: #000; }
  canvas { display: block; width: 100%; height: 100%; }
  #error-overlay {
    position: fixed; inset: 0; display: none;
    align-items: center; justify-content: center;
    color: white; font: 18px monospace; background: #000;
    z-index: 10;
  }
  #error-overlay.visible { display: flex; }
</style>
</head>
<body>
<canvas id="canvas"></canvas>
<video id="video" autoplay playsinline></video>
<div id="error-overlay"></div>

<script src="https://cdn.jsdelivr.net/npm/@tensorflow/tfjs-core@4"></script>
<script src="https://cdn.jsdelivr.net/npm/@tensorflow/tfjs-converter@4"></script>
<script src="https://cdn.jsdelivr.net/npm/@tensorflow/tfjs-backend-webgl@4"></script>
<script src="https://cdn.jsdelivr.net/npm/@mediapipe/hands@0.4"></script>
<script src="https://cdn.jsdelivr.net/npm/@tensorflow-models/hand-pose-detection@2"></script>

<script>
"use strict";
// JS goes here
</script>
</body>
</html>
```

- [ ] **Step 2: No test needed — file created correctly if it opens**

---

### Task 2: Add camera, canvas setup, and detector init

**Files:**
- Modify: `mappatura.html`

- [ ] **Step 1: Add constants and initialization**

```js
const video = document.getElementById('video');
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const errorOverlay = document.getElementById('error-overlay');

const CAM_PREVIEW_W = 240;
const CAM_PREVIEW_H = 180;
const CAM_MARGIN = 16;
const TOUCH_THRESHOLD = 30;

const touchPattern = {};
let detector = null;
let lastTimestamp = 0;
let recordingState = null;
let allRegistered = false;

function showError(msg) {
  errorOverlay.textContent = msg;
  errorOverlay.classList.add('visible');
}

async function startCamera() {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    video.srcObject = stream;
    await video.play();
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  } catch (err) {
    showError("Permesso fotocamera negato.");
    throw err;
  }
}

async function initDetector() {
  try {
    const model = handPoseDetection.SupportedModels.MediaPipeHands;
    detector = await handPoseDetection.createDetector(model, {
      runtime: 'mediapipe',
      solutionPath: 'https://cdn.jsdelivr.net/npm/@mediapipe/hands',
      modelType: 'full',
      maxHands: 2
    });
  } catch (err) {
    showError('Errore modello: ' + err.message);
    throw err;
  }
}

window.addEventListener('resize', () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
});
```

- [ ] **Step 2: Verify by code review**

---

### Task 3: Add touch detection logic (thumb-to-finger proximity)

**Files:**
- Modify: `mappatura.html`

- [ ] **Step 1: Add touch detection function**

```js
const THUMB_INDICES = [1, 2, 3, 4]; // cmc, mcp, ip, tip
const FINGER_INDICES = {
  index: [5, 6, 7, 8],
  middle: [9, 10, 11, 12],
  ring: [13, 14, 15, 16],
  pinky: [17, 18, 19, 20]
};

function detectTouches(keypoints) {
  const result = { index: false, middle: false, ring: false, pinky: false };
  for (const [finger, indices] of Object.entries(FINGER_INDICES)) {
    let minDist = Infinity;
    for (const ti of THUMB_INDICES) {
      for (const fi of indices) {
        const dx = keypoints[ti].x - keypoints[fi].x;
        const dy = keypoints[ti].y - keypoints[fi].y;
        const d = Math.sqrt(dx * dx + dy * dy);
        if (d < minDist) minDist = d;
      }
    }
    result[finger] = minDist < TOUCH_THRESHOLD;
  }
  return result;
}

function getTouchBits(touches) {
  let bits = 0;
  if (touches.index) bits |= 1;
  if (touches.middle) bits |= 2;
  if (touches.ring) bits |= 4;
  if (touches.pinky) bits |= 8;
  return bits;
}
```

- [ ] **Step 2: Verify by code review**

---

### Task 4: Add number table UI and click handling

**Files:**
- Modify: `mappatura.html`

- [ ] **Step 1: Add number table drawing and click handler**

```js
const NUMBERS = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
const TABLE_COLS = 5;
const CELL_SIZE = 40;
const CELL_GAP = 6;
let recognizedNumber = null;

function getTableOrigin() {
  const totalW = TABLE_COLS * (CELL_SIZE + CELL_GAP);
  return { x: (canvas.width - totalW) / 2, y: 220 };
}

function drawNumberTable() {
  const origin = getTableOrigin();
  for (let i = 0; i < NUMBERS.length; i++) {
    const col = i % TABLE_COLS;
    const row = Math.floor(i / TABLE_COLS);
    const x = origin.x + col * (CELL_SIZE + CELL_GAP);
    const y = origin.y + row * (CELL_SIZE + CELL_GAP);
    const num = NUMBERS[i];
    let color = '#555';
    if (recognizedNumber === num) {
      color = '#00ccff';
    } else if (touchPattern[num] !== undefined) {
      color = '#fff';
    }
    ctx.fillStyle = color;
    ctx.font = '24px monospace';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(num, x + CELL_SIZE / 2, y + CELL_SIZE / 2);
  }
}

function getClickedNumber(mx, my) {
  const origin = getTableOrigin();
  for (let i = 0; i < NUMBERS.length; i++) {
    const col = i % TABLE_COLS;
    const row = Math.floor(i / TABLE_COLS);
    const x = origin.x + col * (CELL_SIZE + CELL_GAP);
    const y = origin.y + row * (CELL_SIZE + CELL_GAP);
    if (mx >= x && mx <= x + CELL_SIZE && my >= y && my <= y + CELL_SIZE) {
      return NUMBERS[i];
    }
  }
  return null;
}

canvas.addEventListener('click', (e) => {
  if (allRegistered) return;
  const rect = canvas.getBoundingClientRect();
  const scaleX = canvas.width / rect.width;
  const scaleY = canvas.height / rect.height;
  const mx = (e.clientX - rect.left) * scaleX;
  const my = (e.clientY - rect.top) * scaleY;
  const num = getClickedNumber(mx, my);
  if (num !== null && touchPattern[num] === undefined && !recordingState) {
    recordingState = { number: num, countdown: 3, timer: 0 };
  }
});
```

- [ ] **Step 2: Verify by code review**

---

### Task 5: Add registration mode with countdown and key export

**Files:**
- Modify: `mappatura.html`

- [ ] **Step 1: Add countdown, registration, and export functions**

```js
function drawCountdown() {
  if (!recordingState) return;
  ctx.font = '36px monospace';
  ctx.fillStyle = '#fff';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(`Registrazione ${recordingState.number}... ${recordingState.countdown}`, canvas.width / 2, 120);
}

function drawExportButton() {
  const bw = 220, bh = 50;
  const bx = (canvas.width - bw) / 2;
  const by = canvas.height - 80;
  ctx.fillStyle = allRegistered ? '#fff' : '#333';
  ctx.font = '20px monospace';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(allRegistered ? 'EXPORT KEY' : 'Registra 0-9 per sbloccare', canvas.width / 2, by + bh / 2);
}

function isExportClick(mx, my) {
  if (!allRegistered) return false;
  const bw = 220, bh = 50;
  const bx = (canvas.width - bw) / 2;
  const by = canvas.height - 80;
  return mx >= bx && mx <= bx + bw && my >= by && my <= by + bh;
}

canvas.addEventListener('click', (e) => {
  const rect = canvas.getBoundingClientRect();
  const scaleX = canvas.width / rect.width;
  const scaleY = canvas.height / rect.height;
  const mx = (e.clientX - rect.left) * scaleX;
  const my = (e.clientY - rect.top) * scaleY;
  if (isExportClick(mx, my)) {
    exportKey();
  }
});

function captureTouch(hands) {
  const touches = { index: false, middle: false, ring: false, pinky: false };
  for (const hand of hands) {
    const t = detectTouches(hand.keypoints);
    for (const f of ['index', 'middle', 'ring', 'pinky']) {
      if (t[f]) touches[f] = true;
    }
  }
  return touches;
}

function exportKey() {
  const data = {
    nome: 'chiave-mappatura',
    data: new Date().toISOString().split('T')[0],
    mappatura: {}
  };
  for (let i = 0; i < 10; i++) {
    const bits = touchPattern[i];
    if (bits !== undefined) {
      data.mappatura[i] = [
        !!(bits & 1),   // index
        !!(bits & 2),   // middle
        !!(bits & 4),   // ring
        !!(bits & 8)    // pinky
      ];
    }
  }
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'chiave-mappatura.json';
  a.click();
  URL.revokeObjectURL(url);
}
```

- [ ] **Step 2: Verify by code review**

---

### Task 6: Wire everything into detect loop + render

**Files:**
- Modify: `mappatura.html`

- [ ] **Step 1: Add render and detect loop**

```js
function render(hands) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawNumberTable();
  drawCountdown();
  drawExportButton();
  const camX = canvas.width - CAM_PREVIEW_W - CAM_MARGIN;
  const camY = CAM_MARGIN;
  ctx.save();
  ctx.beginPath();
  ctx.rect(camX, camY, CAM_PREVIEW_W, CAM_PREVIEW_H);
  ctx.clip();
  ctx.drawImage(video, camX, camY, CAM_PREVIEW_W, CAM_PREVIEW_H);
  ctx.restore();
  ctx.strokeStyle = 'rgba(255,255,255,0.5)';
  ctx.lineWidth = 1;
  ctx.strokeRect(camX, camY, CAM_PREVIEW_W, CAM_PREVIEW_H);
}

async function detectLoop(timestamp) {
  const deltaSec = lastTimestamp ? (timestamp - lastTimestamp) / 1000 : 0.016;
  lastTimestamp = timestamp;
  try {
    const hands = await detector.estimateHands(video, { flipHorizontal: true });
    if (recordingState) {
      recordingState.timer += deltaSec;
      recordingState.countdown = Math.ceil(3 - recordingState.timer);
      if (recordingState.timer >= 3) {
        const touches = captureTouch(hands);
        touchPattern[recordingState.number] = getTouchBits(touches);
        recordingState = null;
        allRegistered = Object.keys(touchPattern).length === 10;
      }
    } else {
      let currentBits = -1;
      if (hands.length > 0) {
        const touches = captureTouch(hands);
        currentBits = getTouchBits(touches);
      }
      recognizedNumber = null;
      for (const [num, bits] of Object.entries(touchPattern)) {
        if (bits === currentBits) {
          recognizedNumber = parseInt(num);
          break;
        }
      }
    }
    render(hands);
  } catch (err) {
    console.error('Detection error:', err);
  }
  requestAnimationFrame(detectLoop);
}

async function main() {
  await startCamera();
  await initDetector();
  detectLoop();
}

main();
```

- [ ] **Step 2: Verify by code review**

- [ ] **Step 3: Open in browser and test**

Open `http://localhost:8080/mappatura.html`:
1. Camera preview visible top-right (240×180)
2. Number table 0-9 in center, all gray
3. Click digit → countdown → capture touch pattern → digit turns white
4. After all 10 → "EXPORT KEY" appears
5. Click → downloads `chiave-mappatura.json`
