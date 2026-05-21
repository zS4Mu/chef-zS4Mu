# Scrittura Cifre Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development or superpowers:executing-plans. Steps use checkbox (`- [ ]`) syntax.

**Goal:** Build `scrittura.html` — a single-page app that lets users load their mapping key and write digits by replicating the exact hand gestures defined in the key.

**Architecture:** Single HTML file. User uploads `chiave-mappatura.json` (from Phase 1), the system builds an inverted lookup `{hand, count} → digit`. The user shows a hand gesture, clicks "Scrivi", a 3-second countdown runs, then the system captures the gesture and appends the matching digit to the written text — blindly (no digit shown before capture). Backspace removes the last digit. Camera preview with skeleton (joints + connections, no labels) in the top-right corner.

**Tech Stack:** MediaPipe Hands (CDN), TensorFlow.js (CDN), Canvas2D, single `scrittura.html`

---

### Task 1: HTML scaffold + CSS + CDN imports + constants

**Files:**
- Create: `scrittura.html` (lines 1–65)

- [ ] **Step 1: Write the HTML scaffold**

```html
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Scrittura Cifre</title>
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  html, body { width: 100%; height: 100%; overflow: hidden; background: #000; }
  canvas { display: block; width: 100%; height: 100%; }
  #file-input { position: fixed; top: 20px; left: 50%; transform: translateX(-50%); z-index: 5; }
  #file-input label { color: #888; font: 14px monospace; cursor: pointer; border: 1px solid #555; padding: 8px 16px; border-radius: 4px; }
  #file-input label:hover { border-color: #aaa; color: #fff; }
  #file-input input { display: none; }
  #status-bar { position: fixed; bottom: 20px; left: 50%; transform: translateX(-50%); z-index: 5; color: #666; font: 14px monospace; }
</style>
</head>
<body>
<canvas id="canvas"></canvas>
<video id="video" autoplay playsinline></video>
<div id="file-input">
  <label for="key-file">Carica chiave...</label>
  <input type="file" id="key-file" accept=".json">
</div>
<div id="status-bar">Nessuna chiave caricata</div>

<script src="https://cdn.jsdelivr.net/npm/@tensorflow/tfjs-core@4"></script>
<script src="https://cdn.jsdelivr.net/npm/@tensorflow/tfjs-converter@4"></script>
<script src="https://cdn.jsdelivr.net/npm/@tensorflow/tfjs-backend-webgl@4"></script>
<script src="https://cdn.jsdelivr.net/npm/@mediapipe/hands@0.4"></script>
<script src="https://cdn.jsdelivr.net/npm/@tensorflow-models/hand-pose-detection@2"></script>

<script>
"use strict";

const video = document.getElementById('video');
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const fileInput = document.getElementById('key-file');
const statusBar = document.getElementById('status-bar');

const CAM_PREVIEW_W = 240;
const CAM_PREVIEW_H = 180;
const CAM_MARGIN = 16;
const EXTEND_THRESHOLD = 0.7;
const COUNTDOWN_SEC = 3;

const COLORS = {
  Right: { stroke: 'rgba(0, 204, 255, 0.7)', label: '#00ccff' },
  Left: { stroke: 'rgba(0, 255, 102, 0.7)', label: '#00ff66' }
};

const CONNECTIONS = [
  [0, 1], [1, 2], [2, 3], [3, 4],
  [0, 5], [5, 6], [6, 7], [7, 8],
  [0, 9], [9, 10], [10, 11], [11, 12],
  [0, 13], [13, 14], [14, 15], [15, 16],
  [0, 17], [17, 18], [18, 19], [19, 20],
  [5, 9], [9, 13], [13, 17]
];

let detector = null;
let lastTimestamp = 0;
let keyMap = null;       // {hand, count} -> digit (built from loaded key)
let writtenText = [];    // array of digits
let captureState = null; // { timer, countdown } or null
let keyLoaded = false;
let currentHandDetected = false;
```

- [ ] **Step 2: Verify file exists and structure is clean**

Run: `python -c "print('OK')"` (no test framework — just verify the file is parseable)

---

### Task 2: Camera + detector + finger counting + drawing utils

**Files:**
- Modify: `scrittura.html` (lines after constants)

- [ ] **Step 1: Add camera, detector, finger counting, drawing functions**

Add after the constants block:

```js
function showError(msg) {
  const overlay = document.getElementById('error-overlay');
  if (!overlay) {
    const el = document.createElement('div');
    el.id = 'error-overlay';
    el.style.cssText = 'position:fixed;inset:0;display:flex;align-items:center;justify-content:center;color:#fff;font:18px monospace;background:#000;z-index:10;';
    el.textContent = msg;
    document.body.appendChild(el);
  } else {
    overlay.textContent = msg;
  }
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

function isFingerStraight(keypoints, mcp, pip, dip) {
  const v1x = keypoints[pip].x - keypoints[mcp].x;
  const v1y = keypoints[pip].y - keypoints[mcp].y;
  const v2x = keypoints[dip].x - keypoints[pip].x;
  const v2y = keypoints[dip].y - keypoints[pip].y;
  const dot = v1x * v2x + v1y * v2y;
  const m1 = Math.sqrt(v1x * v1x + v1y * v1y);
  const m2 = Math.sqrt(v2x * v2x + v2y * v2y);
  if (m1 === 0 || m2 === 0) return false;
  return (dot / (m1 * m2)) > EXTEND_THRESHOLD;
}

function countExtendedFingers(keypoints) {
  let count = 0;
  if (isFingerStraight(keypoints, 5, 6, 7)) count++;
  if (isFingerStraight(keypoints, 9, 10, 11)) count++;
  if (isFingerStraight(keypoints, 13, 14, 15)) count++;
  if (isFingerStraight(keypoints, 17, 18, 19)) count++;
  return count;
}

function drawLine(x1, y1, x2, y2, color) {
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.strokeStyle = color;
  ctx.lineWidth = 2;
  ctx.stroke();
}

function getHandCount(hands, targetHand) {
  for (const hand of hands) {
    if (hand.handedness === targetHand) {
      return countExtendedFingers(hand.keypoints);
    }
  }
  return -1;
}
```

- [ ] **Step 2: Run HTTP server to check for syntax errors**

Run: `python -m http.server 8080` (then load `http://localhost:8080/scrittura.html` in browser — should load without console errors)

---

### Task 3: Key loading and validation

**Files:**
- Modify: `scrittura.html` (add key loading logic after constants, before camera setup)

- [ ] **Step 1: Add key loading and validation**

```js
function validateKey(data) {
  if (!data || !data.mappatura) return 'File non valido: manca "mappatura"';
  const entries = Object.entries(data.mappatura);
  if (entries.length !== 10) return 'File non valido: servono 10 cifre (0-9)';
  for (let i = 0; i < 10; i++) {
    const entry = data.mappatura[i.toString()];
    if (!entry) return `File non valido: manca cifra ${i}`;
    if (entry.hand !== 'Left' && entry.hand !== 'Right') return `Cifra ${i}: hand deve essere Left o Right`;
    if (!Number.isInteger(entry.dita_estese) || entry.dita_estese < 0 || entry.dita_estese > 4) return `Cifra ${i}: dita_estese deve essere 0-4`;
  }
  return null;
}

fileInput.addEventListener('change', (e) => {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = (ev) => {
    try {
      const data = JSON.parse(ev.target.result);
      const err = validateKey(data);
      if (err) {
        statusBar.textContent = err;
        statusBar.style.color = '#ff4444';
        return;
      }
      keyMap = {};
      for (let i = 0; i < 10; i++) {
        const entry = data.mappatura[i.toString()];
        keyMap[entry.hand + ':' + entry.dita_estese] = i;
      }
      keyLoaded = true;
      document.getElementById('file-input').style.display = 'none';
      statusBar.textContent = '✓ Chiave caricata. Mano non rilevata.';
      statusBar.style.color = '#44ff44';
    } catch (e) {
      statusBar.textContent = 'Errore: file JSON non valido';
      statusBar.style.color = '#ff4444';
    }
  };
  reader.readAsText(file);
});
```

- [ ] **Step 2: Create test key and verify**

Create `test-chiave.json`:
```json
{"nome":"test","data":"2026-05-20","mappatura":{"0":{"hand":"Left","dita_estese":0},"1":{"hand":"Left","dita_estese":1},"2":{"hand":"Left","dita_estese":2},"3":{"hand":"Left","dita_estese":3},"4":{"hand":"Left","dita_estese":4},"5":{"hand":"Right","dita_estese":0},"6":{"hand":"Right","dita_estese":1},"7":{"hand":"Right","dita_estese":2},"8":{"hand":"Right","dita_estese":3},"9":{"hand":"Right","dita_estese":4}}}
```

Load in browser — verify status shows "✓ Chiave caricata"

---

### Task 4: Skeleton rendering (no labels) + text display

**Files:**
- Modify: `scrittura.html` (add rendering functions)

- [ ] **Step 1: Add skeleton and text rendering**

```js
function drawSkeleton(hands) {
  for (const hand of hands) {
    const colors = COLORS[hand.handedness] || COLORS.Right;
    const kp = hand.keypoints;
    for (const [i, j] of CONNECTIONS) {
      if (kp[i] && kp[j]) {
        drawLine(kp[i].x, kp[i].y, kp[j].x, kp[j].y, colors.stroke);
      }
    }
    for (const point of kp) {
      ctx.beginPath();
      ctx.arc(point.x, point.y, 3, 0, Math.PI * 2);
      ctx.fillStyle = colors.label;
      ctx.fill();
    }
  }
}

function drawWrittenText() {
  const text = writtenText.length > 0 ? writtenText.join(' ') : '';
  ctx.font = 'bold 48px monospace';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  if (text) {
    ctx.fillStyle = '#fff';
    ctx.fillText(text, canvas.width / 2, canvas.height / 2 - 40);
  } else {
    ctx.fillStyle = '#444';
    ctx.fillText('—', canvas.width / 2, canvas.height / 2 - 40);
  }
}

function drawCaptureUI() {
  const btnY = canvas.height - 120;
  const btnW = 160;
  const btnH = 48;
  const gap = 20;
  const cx = canvas.width / 2;
  const left = cx - btnW - gap / 2;
  const right = cx + gap / 2;

  // Scrivi button
  const scriviEnabled = keyLoaded && !captureState;
  ctx.fillStyle = scriviEnabled ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.03)';
  ctx.strokeStyle = scriviEnabled ? '#fff' : '#444';
  ctx.lineWidth = 1;
  roundRect(ctx, left, btnY, btnW, btnH, 6);
  ctx.fill();
  ctx.stroke();
  ctx.fillStyle = scriviEnabled ? '#fff' : '#444';
  ctx.font = '16px monospace';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('Scrivi', left + btnW / 2, btnY + btnH / 2);

  // Cancella button
  const cancEnabled = writtenText.length > 0 && !captureState;
  ctx.fillStyle = cancEnabled ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.03)';
  ctx.strokeStyle = cancEnabled ? '#fff' : '#444';
  ctx.lineWidth = 1;
  roundRect(ctx, right, btnY, btnW, btnH, 6);
  ctx.fill();
  ctx.stroke();
  ctx.fillStyle = cancEnabled ? '#fff' : '#444';
  ctx.font = '16px monospace';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('Cancella', right + btnW / 2, btnY + btnH / 2);
}

function drawCountdown() {
  if (!captureState) return;
  const sec = Math.ceil(captureState.countdown);
  ctx.fillStyle = '#fff';
  ctx.font = 'bold 72px monospace';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(sec.toString(), canvas.width / 2, canvas.height / 2 + 40);
}

function roundRect(ctxx, x, y, w, h, r) {
  ctxx.beginPath();
  ctxx.moveTo(x + r, y);
  ctxx.lineTo(x + w - r, y);
  ctxx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctxx.lineTo(x + w, y + h - r);
  ctxx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctxx.lineTo(x + r, y + h);
  ctxx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctxx.lineTo(x, y + r);
  ctxx.quadraticCurveTo(x, y, x + r, y);
  ctxx.closePath();
}

function drawCameraPreview(hands) {
  const camX = canvas.width - CAM_PREVIEW_W - CAM_MARGIN;
  const camY = CAM_MARGIN;
  ctx.save();
  ctx.beginPath();
  ctx.rect(camX, camY, CAM_PREVIEW_W, CAM_PREVIEW_H);
  ctx.clip();
  ctx.translate(camX + CAM_PREVIEW_W, camY);
  ctx.scale(-1, 1);
  ctx.drawImage(video, 0, 0, CAM_PREVIEW_W, CAM_PREVIEW_H);
  ctx.restore();
  ctx.strokeStyle = 'rgba(255,255,255,0.5)';
  ctx.lineWidth = 1;
  ctx.strokeRect(camX, camY, CAM_PREVIEW_W, CAM_PREVIEW_H);
}
```

- [ ] **Step 2: Add render function**

```js
function render(hands) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawCameraPreview(hands);
  drawSkeleton(hands);
  drawWrittenText();
  drawCaptureUI();
  drawCountdown();
}
```

---

### Task 5: Click handling (Scrivi + Cancella buttons)

**Files:**
- Modify: `scrittura.html` (add click detection and capture logic)

- [ ] **Step 1: Add button hit-testing and capture logic**

```js
function isButtonClick(mx, my, left) {
  const btnY = canvas.height - 120;
  const btnW = 160;
  const btnH = 48;
  const gap = 20;
  const cx = canvas.width / 2;
  const bx = left ? cx - btnW - gap / 2 : cx + gap / 2;
  return mx >= bx && mx <= bx + btnW && my >= btnY && my <= btnY + btnH;
}

function startCapture() {
  if (!keyLoaded || captureState) return;
  captureState = { timer: 0, countdown: COUNTDOWN_SEC };
}

function backspaceDigit() {
  if (writtenText.length > 0) {
    writtenText.pop();
  }
}

canvas.addEventListener('click', (e) => {
  const rect = canvas.getBoundingClientRect();
  const scaleX = canvas.width / rect.width;
  const scaleY = canvas.height / rect.height;
  const mx = (e.clientX - rect.left) * scaleX;
  const my = (e.clientY - rect.top) * scaleY;

  if (captureState) return;  // ignore clicks during countdown

  if (isButtonClick(mx, my, true)) {
    startCapture();
    return;
  }
  if (isButtonClick(mx, my, false)) {
    backspaceDigit();
    return;
  }
});
```

- [ ] **Step 2: Add keyboard shortcut for backspace**

```js
document.addEventListener('keydown', (e) => {
  if (e.key === 'Backspace' && !captureState) {
    backspaceDigit();
  }
});
```

---

### Task 6: Detection loop with blind capture

**Files:**
- Modify: `scrittura.html` (add detectLoop function and main)

- [ ] **Step 1: Add detectLoop with countdown + blind capture logic**

```js
async function detectLoop(timestamp) {
  const deltaSec = lastTimestamp ? (timestamp - lastTimestamp) / 1000 : 0.016;
  lastTimestamp = timestamp;
  try {
    const hands = await detector.estimateHands(video, { flipHorizontal: true });
    currentHandDetected = hands.length > 0;

    if (captureState) {
      captureState.timer += deltaSec;
      captureState.countdown = COUNTDOWN_SEC - captureState.timer;
      if (captureState.timer >= COUNTDOWN_SEC) {
        // Capture: find the gesture and look up in keyMap
        for (const hand of hands) {
          const count = countExtendedFingers(hand.keypoints);
          const key = hand.handedness + ':' + count;
          if (keyMap && keyMap[key] !== undefined) {
            writtenText.push(keyMap[key]);
            break;
          }
        }
        captureState = null;
      }
    }

    // Update status
    if (keyLoaded) {
      statusBar.textContent = currentHandDetected ? 'Pronto' : 'Mano non rilevata';
      statusBar.style.color = currentHandDetected ? '#44ff44' : '#ffcc00';
    }

    render(hands);
  } catch (err) {
    console.error('Detection error:', err);
  }
  requestAnimationFrame(detectLoop);
}
```

- [ ] **Step 2: Add main() and wire everything up**

```js
async function main() {
  await startCamera();
  await initDetector();
  detectLoop();
}

main();
</script>
</body>
</html>
```

---

### Task 7: Final integration and testing

**Files:**
- `scrittura.html`
- `test-chiave.json`

- [ ] **Step 1: Load in browser and verify basic flow**

1. Start server: `python -m http.server 8080`
2. Open `http://localhost:8080/scrittura.html`
3. Verify: page loads, camera permission prompt appears
4. Click "Carica chiave..." and select `test-chiave.json`
5. Verify: file input disappears, status shows "✓ Chiave caricata. Mano non rilevata."
6. Show a hand to camera — verify skeleton appears (cyan/green joints + lines, no labels)
7. Click "Scrivi" — verify countdown 3-2-1 appears
8. After countdown, verify a digit appears in the text area
9. Repeat — verify multiple digits accumulate
10. Click "Cancella" — verify last digit removed
11. Press Backspace — verify last digit removed

- [ ] **Step 2: Edge case testing**

- Try loading invalid JSON file — verify error message
- Try loading a key with missing digits — verify error message
- Show a gesture that doesn't match any key entry during countdown — verify no digit added
- Hide hand during countdown — verify no digit added
- Verify "Scrivi" is disabled (doesn't respond) during countdown
- Verify "Cancella" is disabled during countdown
