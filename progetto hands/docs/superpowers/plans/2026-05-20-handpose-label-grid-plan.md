# HandPose Label Grid Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a single HTML page that uses TensorFlow.js HandPose to detect hands via webcam and render the skeleton with alphanumeric grid labels on a black canvas.

**Architecture:** Single `index.html` with inline CSS and JS, loading all dependencies from CDN. Canvas 2D rendering in a requestAnimationFrame loop.

**Tech Stack:** TensorFlow.js HandPose Detection (MediaPipe runtime), HTML5 Canvas 2D, WebRTC getUserMedia

---

### Task 1: Create HTML scaffold with CDN dependencies

**Files:**
- Create: `index.html`

- [ ] **Step 1: Write the HTML skeleton**

```html
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>HandPose Label Grid</title>
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  html, body { width: 100%; height: 100%; overflow: hidden; background: #000; }
  canvas { display: block; width: 100%; height: 100%; }
  video { display: none; }
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
// ... JS goes here
</script>
</body>
</html>
```

- [ ] **Step 2: Verify file opens**

Run: `index.html` should be a valid HTML file that opens in browser without console errors at this stage (canvas will be blank since no JS logic yet)

---

### Task 2: Add label configuration and constants

**Files:**
- Modify: `index.html` (add JS inside the `<script>` block)

- [ ] **Step 1: Add label map and hand skeleton connections**

Replace `// ... JS goes here` with:

```js
const LABELS = {
  wrist: 'A1',
  thumb_cmc: 'A2',
  thumb_mcp: 'B1',
  thumb_ip: 'C1',
  thumb_tip: 'E1',
  index_finger_mcp: 'B2',
  index_finger_pip: 'C2',
  index_finger_dip: 'D2',
  index_finger_tip: 'E2',
  middle_finger_mcp: 'B3',
  middle_finger_pip: 'C3',
  middle_finger_dip: 'D3',
  middle_finger_tip: 'E3',
  ring_finger_mcp: 'B4',
  ring_finger_pip: 'C4',
  ring_finger_dip: 'D4',
  ring_finger_tip: 'E4',
  pinky_finger_mcp: 'B5',
  pinky_finger_pip: 'C5',
  pinky_finger_dip: 'D5',
  pinky_finger_tip: 'E5'
};

const CONNECTIONS = [
  [0, 1],   // wrist -> thumb_cmc
  [1, 2],   // thumb_cmc -> thumb_mcp
  [2, 3],   // thumb_mcp -> thumb_ip
  [3, 4],   // thumb_ip -> thumb_tip
  [0, 5],   // wrist -> index_mcp
  [5, 6],   // index_mcp -> index_pip
  [6, 7],   // index_pip -> index_dip
  [7, 8],   // index_dip -> index_tip
  [0, 9],   // wrist -> middle_mcp
  [9, 10],  // middle_mcp -> middle_pip
  [10, 11], // middle_pip -> middle_dip
  [11, 12], // middle_dip -> middle_tip
  [0, 13],  // wrist -> ring_mcp
  [13, 14], // ring_mcp -> ring_pip
  [14, 15], // ring_pip -> ring_dip
  [15, 16], // ring_dip -> ring_tip
  [0, 17],  // wrist -> pinky_mcp
  [17, 18], // pinky_mcp -> pinky_pip
  [18, 19], // pinky_pip -> pinky_dip
  [19, 20], // pinky_dip -> pinky_tip
  [5, 9],   // index_mcp -> middle_mcp
  [9, 13],  // middle_mcp -> ring_mcp
  [13, 17]  // ring_mcp -> pinky_mcp
];
```

No verification needed at this stage.

---

### Task 3: Add camera initialization and error handling

**Files:**
- Modify: `index.html`

- [ ] **Step 1: Add camera startup function after the constants**

```js
const video = document.getElementById('video');
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const errorOverlay = document.getElementById('error-overlay');

function showError(msg) {
  errorOverlay.textContent = msg;
  errorOverlay.classList.add('visible');
}

async function startCamera() {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    video.srcObject = stream;
    return new Promise((resolve) => {
      video.onloadedmetadata = () => {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        resolve();
      };
    });
  } catch (err) {
    showError('Permesso fotocamera negato. Consenti l\'accesso alla fotocamera e ricarica la pagina.');
    throw err;
  }
}
```

- [ ] **Step 2: No test needed, verify via code review**

---

### Task 4: Add detector initialization

**Files:**
- Modify: `index.html`

- [ ] **Step 1: Add detector creation function**

```js
let detector = null;

async function initDetector() {
  try {
    const model = handPoseDetection.SupportedModels.MediaPipeHands;
    detector = await handPoseDetection.createDetector(model, {
      runtime: 'mediapipe',
      modelType: 'full',
      maxHands: 2
    });
  } catch (err) {
    showError('Errore inizializzazione modello: ' + err.message);
    throw err;
  }
}
```

- [ ] **Step 2: No test needed, verify via code review**

---

### Task 5: Implement the rendering loop

**Files:**
- Modify: `index.html`

- [ ] **Step 1: Add render loop and skeleton + label drawing**

```js
function drawLine(x1, y1, x2, y2) {
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.6)';
  ctx.lineWidth = 2;
  ctx.stroke();
}

function drawLabel(x, y, text) {
  ctx.font = '14px monospace';
  ctx.fillStyle = '#ffffff';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(text, x, y);
}

function render(hands) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  for (const hand of hands) {
    const kp = hand.keypoints;

    for (const [i, j] of CONNECTIONS) {
      if (kp[i] && kp[j]) {
        drawLine(kp[i].x, kp[i].y, kp[j].x, kp[j].y);
      }
    }

    for (const point of kp) {
      const label = LABELS[point.name];
      if (label) {
        drawLabel(point.x, point.y, label);
      }
    }
  }
}

async function detectLoop() {
  try {
    const hands = await detector.estimateHands(video);
    render(hands);
  } catch (err) {
    // silently continue
  }
  requestAnimationFrame(detectLoop);
}
```

- [ ] **Step 2: Add the main startup sequence at the very end**

```js
async function main() {
  await startCamera();
  await initDetector();
  detectLoop();
}

main();
```

- [ ] **Step 3: No test needed — run by opening index.html in a browser**

---

### Task 6: Handle window resize

**Files:**
- Modify: `index.html`

- [ ] **Step 1: Add resize handler inside the main function or as standalone**

```js
function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

window.addEventListener('resize', resizeCanvas);
// In main(), after camera start, also call resizeCanvas so canvas matches viewport
// (Camera native resolution for detection, canvas display for rendering)
```

Modify `main()`:

```js
async function main() {
  resizeCanvas();
  await startCamera();
  await initDetector();
  detectLoop();
}
```

- [ ] **Step 2: Verify by resizing browser window — canvas should fill viewport**

---

### Task 7: Final visual polish pass

**Files:**
- Modify: `index.html`

- [ ] **Step 1: Review and tweak visual appearance**

Ensure:
- Canvas resizes to fill viewport on load and resize
- Black background renders correctly
- Lines are semi-transparent white (`rgba(255,255,255,0.6)`)
- Labels are solid white, 14px monospace, centered
- No camera feed visible to user
- Error overlay shows centered white text on black

- [ ] **Step 2: Open in browser and verify**

Open `index.html` in Chrome/Edge/Firefox. Expected:
1. Browser requests camera permission → allow
2. Black canvas appears fullscreen
3. Put your hand in frame → white skeleton lines + grid labels appear
4. Resize window → canvas adapts
5. Deny camera → error message "Permesso fotocamera negato..."
