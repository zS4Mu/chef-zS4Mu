# Generatore Pattern Cellulare Organico — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Single-file HTML page generating an organic black-and-white cellular Voronoi pattern with neural pulse animation and 3 sliders.

**Architecture:** Canvas 2D render loop. Voronoi computed via half-plane intersection on a jittered grid. Edge perturbation for organic curves. Pulse propagation system for "neuron firing" effect. Overlay controls panel. Export: SVG via geometry reconstruction, PNG via `canvas.toDataURL`.

**Tech Stack:** Canvas 2D, vanilla JS, single HTML file, no dependencies.

---

### Task 1: HTML Shell & CSS Layout

**Files:**
- Create: `index.html`

- [ ] **Step 1: Write complete HTML with CSS controls bar**

```html
<!DOCTYPE html>
<html lang="it">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Pattern Cellulare Organico</title>
<style>
* { margin:0; padding:0; box-sizing:border-box; }
html,body { width:100%; height:100%; overflow:hidden; background:#fff; font-family:'Helvetica Neue',Arial,sans-serif; }
canvas { display:block; }
#controls {
  position:fixed; bottom:0; left:0; right:0;
  background:rgba(255,255,255,0.92); border-top:1px solid #ccc;
  padding:12px 24px; display:flex; flex-wrap:wrap; align-items:center;
  gap:20px; backdrop-filter:blur(6px); z-index:10;
}
.ctrl { display:flex; align-items:center; gap:8px; }
.ctrl label { font-size:11px; text-transform:uppercase; letter-spacing:.5px; color:#333; min-width:65px; }
.ctrl input[type=range] { width:90px; cursor:pointer; }
.ctrl .val { font-size:11px; color:#666; min-width:24px; text-align:right; }
#controls button {
  background:#000; color:#fff; border:none; padding:5px 12px;
  font-size:11px; text-transform:uppercase; letter-spacing:.5px;
  cursor:pointer; border-radius:3px;
}
#controls button:hover { background:#333; }
.btns { display:flex; gap:6px; margin-left:auto; }
@media(max-width:700px) {
  #controls { flex-direction:column; align-items:stretch; padding:10px 16px; gap:8px; }
  .ctrl { justify-content:space-between; }
  .btns { margin-left:0; }
  .btns button { flex:1; }
}
</style>
</head>
<body>
<canvas id="c"></canvas>
<div id="controls">
  <div class="ctrl">
    <label for="sp">Velocità</label>
    <input type="range" id="sp" min="1" max="60" step="1" value="20">
    <span class="val" id="spV">20</span>
  </div>
  <div class="ctrl">
    <label for="sz">Dimensione</label>
    <input type="range" id="sz" min="20" max="120" step="2" value="50">
    <span class="val" id="szV">50</span>
  </div>
  <div class="ctrl">
    <label for="no">Rumore</label>
    <input type="range" id="no" min="0" max="100" step="1" value="50">
    <span class="val" id="noV">50</span>
  </div>
  <div class="btns">
    <button id="reg">Rigenera</button>
    <button id="expSvg">SVG</button>
    <button id="expPng">PNG</button>
  </div>
</div>
<script>
// TASK2: canvas setup
// TASK3: grid + voronoi
// TASK4: edge perturbation
// TASK5: render
// TASK6: pulses
// TASK7: sliders + export
</script>
</body>
</html>
```

- [ ] **Step 2: Visual check**

Open `index.html` — full-screen white canvas, controls bar at bottom with 3 sliders and 3 buttons.

---

### Task 2: Canvas Sizing & Animation Loop

**Files:**
- Modify: `index.html` (replace placeholder comments with code)

- [ ] **Step 1: Replace `// TASK2` comment with canvas setup + loop**

```js
// === TASK2: Canvas setup ===
const canvas = document.getElementById('c');
const ctx = canvas.getContext('2d');
let W, H;
function resize() {
  W = canvas.width = window.innerWidth;
  H = canvas.height = window.innerHeight;
}
window.addEventListener('resize', resize);
resize();

let cells = [], edges = [], animTime = 0;

function generate() { /* TASK3 */ }

function update() { /* TASK6 */ }

function draw() {
  ctx.clearRect(0, 0, W, H);
  /* TASK5 */
  requestAnimationFrame(draw);
}

generate();
draw();
```

- [ ] **Step 2: Verify no console errors**

Open `index.html`, check devtools console — should be clean.

---

### Task 3: Grid Jitter & Voronoi Cell Generation

**Files:**
- Modify: `index.html` (replace `// TASK3` comment)

- [ ] **Step 1: Implement generate() — grid, jitter, half-plane Voronoi**

```js
// === TASK3: Grid + Voronoi ===
function generate() {
  const cellSize = parseFloat(document.getElementById('sz').value);
  const noiseAmt = parseInt(document.getElementById('no').value) / 100;
  const cols = Math.ceil(W / cellSize) + 3;
  const rows = Math.ceil(H / cellSize) + 3;
  const offX = (W - (cols - 3) * cellSize) / 2;
  const offY = (H - (rows - 3) * cellSize) / 2;

  // Jittered grid points
  const pts = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const bx = offX + c * cellSize;
      const by = offY + r * cellSize;
      const jx = (Math.random() - 0.5) * cellSize * noiseAmt;
      const jy = (Math.random() - 0.5) * cellSize * noiseAmt;
      pts.push({ x: bx + jx, y: by + jy });
    }
  }
  const id = (r, c) => r * cols + c;

  // Half-plane Voronoi for each point
  cells = [];
  const rawEdges = [];

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const i = id(r, c);
      const p = pts[i];
      let poly = [
        { x: -50, y: -50 }, { x: W + 50, y: -50 },
        { x: W + 50, y: H + 50 }, { x: -50, y: H + 50 }
      ];

      // Test against all grid neighbors (3x3 window)
      for (let dr = -1; dr <= 1; dr++) {
        for (let dc = -1; dc <= 1; dc++) {
          if (dr === 0 && dc === 0) continue;
          const nr = r + dr, nc = c + dc;
          if (nr < 0 || nr >= rows || nc < 0 || nc >= cols) continue;
          const q = pts[id(nr, nc)];
          const mx = (p.x + q.x) / 2, my = (p.y + q.y) / 2;
          const dx = q.x - p.x, dy = q.y - p.y;
          const len = Math.sqrt(dx * dx + dy * dy);
          if (len < 1e-8) continue;
          const nx = -dy / len, ny = dx / len;

          const newPoly = [];
          for (let vi = 0; vi < poly.length; vi++) {
            const a = poly[vi], b = poly[(vi + 1) % poly.length];
            const da = (a.x - mx) * nx + (a.y - my) * ny;
            const db = (b.x - mx) * nx + (b.y - my) * ny;
            if (da >= -1e-10) newPoly.push({ x: a.x, y: a.y });
            if (da * db < -1e-10) {
              const t = da / (da - db);
              newPoly.push({ x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t });
            }
          }
          poly = newPoly;
          if (poly.length < 3) break;
        }
      }

      if (poly.length >= 3) {
        const cellIdx = cells.length;
        cells.push({ points: poly, idx: cellIdx, activated: false, refractory: 0 });
        // Collect edges from cell polygon
        for (let vi = 0; vi < poly.length; vi++) {
          const a = poly[vi], b = poly[(vi + 1) % poly.length];
          rawEdges.push({
            x1: a.x, y1: a.y, x2: b.x, y2: b.y,
            cellA: cellIdx, cellB: -1, key: ''
          });
        }
      }
    }
  }

  // Deduplicate shared edges using quantized coordinates
  const edgeMap = new Map();
  for (const e of rawEdges) {
    const ax = Math.round(e.x1 * 10), ay = Math.round(e.y1 * 10);
    const bx = Math.round(e.x2 * 10), by = Math.round(e.y2 * 10);
    const fwd = ax + ',' + ay + '-' + bx + ',' + by;
    const rev = bx + ',' + by + '-' + ax + ',' + ay;
    if (edgeMap.has(rev)) {
      const existing = edgeMap.get(rev);
      existing.cellB = e.cellA;
    } else if (!edgeMap.has(fwd)) {
      edgeMap.set(fwd, { x1: e.x1, y1: e.y1, x2: e.x2, y2: e.y2, cellA: e.cellA, cellB: -1 });
    }
  }

  edges = Array.from(edgeMap.values());
  for (const e of edges) {
    e.pulsePos = -1;
    e.active = false;
    e.pulseTime = 0;
  }

  document.getElementById('reg').textContent = 'Rigenera (' + cells.length + ')';
}
```

- [ ] **Step 2: Visual check — wireframe render**

Temporarily add inside `draw()`:
```js
ctx.strokeStyle = '#000';
ctx.lineWidth = 1;
for (const cell of cells) {
  const pts = cell.points;
  ctx.beginPath();
  ctx.moveTo(pts[0].x, pts[0].y);
  for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i].x, pts[i].y);
  ctx.closePath();
  ctx.stroke();
}
```

Open `index.html` — see Voronoi diagram fill canvas with irregular cells.

---

### Task 4: Edge Perturbation for Organic Look

**Files:**
- Modify: `index.html` (after Voronoi generation, add perturbation step)

- [ ] **Step 1: Add function to perturb a line segment into organic curve**

```js
// === TASK4: Edge perturbation ===
function perturbEdge(x1, y1, x2, y2, noiseAmt, segments) {
  const pts = [];
  const count = segments || 6;
  const dx = x2 - x1, dy = y2 - y1;
  const len = Math.sqrt(dx * dx + dy * dy);
  for (let i = 0; i <= count; i++) {
    const t = i / count;
    let px = x1 + dx * t, py = y1 + dy * t;
    if (i > 0 && i < count) {
      const perpX = -dy / len, perpY = dx / len;
      const amp = noiseAmt * len * Math.sin(t * Math.PI);
      const noiseVal = Math.sin(t * 13.7 + x1 * 0.1 + y1 * 0.07) * 0.5 +
                       Math.sin(t * 7.3 + x1 * 0.05 + y2 * 0.09) * 0.5;
      px += perpX * amp * noiseVal;
      py += perpY * amp * noiseVal;
    }
    pts.push({ x: px, y: py });
  }
  return pts;
}
```

- [ ] **Step 2: Generate perturbed control points for each edge after Voronoi**

After edge deduplication in `generate()`, add:
```js
  const noiseAmt = parseInt(document.getElementById('no').value) / 100;
  for (const e of edges) {
    e.perturbed = perturbEdge(e.x1, e.y1, e.x2, e.y2, noiseAmt * 0.3, 6);
  }
```

- [ ] **Step 3: Update draw() to render perturbed edges**

Replace wireframe render in `draw()`:
```js
  ctx.strokeStyle = '#000';
  ctx.lineWidth = 1.5;
  for (const e of edges) {
    const pts = e.perturbed;
    ctx.beginPath();
    ctx.moveTo(pts[0].x, pts[0].y);
    for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i].x, pts[i].y);
    ctx.stroke();
  }
```

- [ ] **Step 4: Visual check**

Cells should now have wavy/organic borders instead of straight lines.

---

### Task 5: Pulse Animation System — "Neuroni in scarica"

**Files:**
- Modify: `index.html`

- [ ] **Step 1: Add update() function for pulse propagation**

```js
// === TASK6: Pulse animation ===
function update() {
  const speed = parseInt(document.getElementById('sp').value);

  // Deactivate finished pulses
  for (const e of edges) {
    if (e.active) {
      e.pulseTime += 0.005 * speed;
      if (e.pulseTime >= 1) {
        e.active = false;
        e.pulseTime = 0;
      }
    }
  }

  // Decrement cell refractory timers
  for (const cell of cells) {
    if (cell.refractory > 0) cell.refractory--;
  }

  // Occasionally activate a random cell
  if (cells.length > 0 && Math.random() < 0.02 * (speed / 20)) {
    const idx = Math.floor(Math.random() * cells.length);
    const cell = cells[idx];
    if (cell.refractory <= 0) {
      cell.activated = true;
      cell.refractory = 120; // frames before reactivation
      fireCell(cell);
    }
  }

  // Propagate: check for cells that should fire from neighbor activation
  // (handled lazily — edges from neighboring cells get activated when
  //  fireCell propagates through shared edges)
}

function fireCell(cell) {
  // Activate all edges of this cell
  for (const e of edges) {
    if ((e.cellA === cell.idx || e.cellB === cell.idx) && !e.active) {
      e.active = true;
      e.pulseTime = 0;
    }
  }
  // Propagate to neighboring cells after refractory
  for (const e of edges) {
    if (e.cellA === cell.idx || e.cellB === cell.idx) {
      const neighborIdx = e.cellA === cell.idx ? e.cellB : e.cellA;
      if (neighborIdx < 0) continue;
      const neighbor = cells[neighborIdx];
      if (neighbor && neighbor.refractory <= 0 && !neighbor.activated) {
        // Delay propagation — fire neighbor after a few frames
        setTimeout(() => {
          if (neighbor.refractory <= 0) {
            neighbor.refractory = 100;
            fireCell(neighbor);
          }
        }, 200 / speed);
      }
    }
  }
}
}
```

- [ ] **Step 2: Render pulses over edges in draw()**

```js
  // Draw pulses (white traveling dots with glow)
  for (const e of edges) {
    if (!e.active) continue;
    const pts = e.perturbed;
    const t = e.pulseTime;
    const totalLen = pts.length - 1;
    const pos = t * totalLen;
    const idx = Math.floor(pos);
    const frac = pos - idx;
    if (idx < 0 || idx >= totalLen) continue;
    const px = pts[idx].x + (pts[idx + 1].x - pts[idx].x) * frac;
    const py = pts[idx].y + (pts[idx + 1].y - pts[idx].y) * frac;

    // Glow
    ctx.shadowColor = 'rgba(200,200,200,0.5)';
    ctx.shadowBlur = 8;
    ctx.fillStyle = '#fff';
    ctx.beginPath();
    ctx.arc(px, py, 3, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;
  }
```

Update the animation loop:
```js
function draw() {
  update();
  ctx.clearRect(0, 0, W, H);
  // draw edges (Task 4 Step 3)
  // draw pulses (above)
  requestAnimationFrame(draw);
}
```

- [ ] **Step 3: Visual check**

See random cells light up with white dots traveling along their edges like neural impulses.

---

### Task 6: Slider Controls + Regenerate

**Files:**
- Modify: `index.html`

- [ ] **Step 1: Wire up 3 sliders to display values + trigger regeneration on size/noise change**

```js
// === TASK7: Controls ===
document.getElementById('sp').addEventListener('input', function() {
  document.getElementById('spV').textContent = this.value;
});
document.getElementById('sz').addEventListener('input', function() {
  document.getElementById('szV').textContent = this.value;
  generate();
});
document.getElementById('no').addEventListener('input', function() {
  document.getElementById('noV').textContent = this.value;
  generate();
});
document.getElementById('reg').addEventListener('click', generate);
```

- [ ] **Step 2: Verify all sliders work**

Open `index.html` — move sliders, see values update. Size/noise regenerate pattern in real time. Speed changes pulse speed.

---

### Task 7: Export SVG

**Files:**
- Modify: `index.html`

- [ ] **Step 1: Implement SVG export from current geometry**

```js
// === TASK8: Export ===
document.getElementById('expSvg').addEventListener('click', function() {
  let svg = '<svg xmlns="http://www.w3.org/2000/svg" width="' + W + '" height="' + H + '">';
  svg += '<rect width="100%" height="100%" fill="white"/>';
  svg += '<g fill="none" stroke="black" stroke-width="1.5">';
  for (const e of edges) {
    const pts = e.perturbed;
    svg += '<path d="M' + pts[0].x.toFixed(1) + ',' + pts[0].y.toFixed(1);
    for (let i = 1; i < pts.length; i++) {
      svg += 'L' + pts[i].x.toFixed(1) + ',' + pts[i].y.toFixed(1);
    }
    svg += '"/>';
  }
  svg += '</g></svg>';
  const blob = new Blob([svg], { type: 'image/svg+xml' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = 'pattern.svg'; a.click();
  URL.revokeObjectURL(url);
});
```

- [ ] **Step 2: Click SVG button — verify download of valid SVG**

Open resulting SVG in browser or illustrator — should show the cellular pattern.

---

### Task 8: Export PNG

**Files:**
- Modify: `index.html`

- [ ] **Step 1: Implement PNG export (captures current frame)**

```js
document.getElementById('expPng').addEventListener('click', function() {
  const a = document.createElement('a');
  a.href = canvas.toDataURL('image/png');
  a.download = 'pattern.png'; a.click();
});
```

- [ ] **Step 2: Click PNG button — verify download**

Open PNG file — should show current frame with pulse state.

---

### Task 9: Final Polish

**Files:**
- Modify: `index.html`

- [ ] **Step 1: Add canvas DPI scaling for retina displays**

```js
function resize() {
  const dpr = window.devicePixelRatio || 1;
  W = window.innerWidth; H = window.innerHeight;
  canvas.width = W * dpr;
  canvas.height = H * dpr;
  canvas.style.width = W + 'px';
  canvas.style.height = H + 'px';
  ctx.scale(dpr, dpr);
}
```

- [ ] **Step 2: Increase default edge width for better black/white contrast**

```js
ctx.lineWidth = 2.5;
```

- [ ] **Step 3: Add a subtle cell fill (white) for the "respiro" effect**

Before edge strokes:
```js
ctx.fillStyle = '#fff';
for (const cell of cells) {
  const pts = cell.points;
  ctx.beginPath();
  ctx.moveTo(pts[0].x, pts[0].y);
  for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i].x, pts[i].y);
  ctx.closePath();
  ctx.fill();
}
ctx.strokeStyle = '#000';
ctx.lineWidth = 2.5;
for (const e of edges) {
  // ... stroke perturbed points
}
```

- [ ] **Step 4: Pulse glow refinement**

Add trailing effect by drawing multiple dots with decreasing opacity:
```js
for (let trail = 0; trail < 5; trail++) {
  const tt = t - trail * 0.02;
  if (tt < 0) continue;
  const pos2 = tt * totalLen;
  const idx2 = Math.floor(pos2);
  const frac2 = pos2 - idx2;
  if (idx2 < 0 || idx2 >= totalLen) continue;
  const px2 = pts[idx2].x + (pts[idx2 + 1].x - pts[idx2].x) * frac2;
  const py2 = pts[idx2].y + (pts[idx2 + 1].y - pts[idx2].y) * frac2;
  ctx.globalAlpha = 1 - trail * 0.2;
  ctx.fillStyle = '#fff';
  ctx.shadowBlur = trail === 0 ? 8 : 4;
  ctx.beginPath();
  ctx.arc(px2, py2, Math.max(1, 3 - trail * 0.5), 0, Math.PI * 2);
  ctx.fill();
}
ctx.globalAlpha = 1;
ctx.shadowBlur = 0;
```

- [ ] **Step 5: Final verification**

Open `index.html` in browser:
- Pattern fills canvas with organic wavy black cells on white
- White pulses travel along edges (neuron effect)
- Speed slider changes animation rate
- Size slider changes cell count (regenerates)
- Noise slider changes irregularity (regenerates)
- Rigenera button works
- SVG export produces valid SVG file
- PNG export produces valid PNG file
- Resize window: pattern stays full screen
