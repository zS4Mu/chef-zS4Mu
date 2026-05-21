# Sound-Responsive SVG Morph Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use subagent-driven-development (recommended) or executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a single-page HTML app that interpolates a face SVG between "zitto" and "parlato" states using real-time microphone input.

**Architecture:** Single `index.html` with inline SVG, CSS, and vanilla JS. Three logic units: AudioLayer (mic → RMS → envelope), MorphEngine (lerp rect/path attributes per frame), and UI (sliders + invert toggle). Zero dependencies.

**Tech Stack:** Vanilla JS, Web Audio API (`getUserMedia` + `AnalyserNode`), SVG DOM manipulation, `requestAnimationFrame`.

---

## File Structure

- **Create:** `index.html` — everything inline. The file is organized in sections: HTML scaffold, embedded SVG, CSS (colors + layout + invert), JS (morph data, audio layer, envelope, animation loop, UI controls).

Both `svg/zitto.svg` and `svg/parlato.svg` remain as source reference — the attribute values are extracted into JS data, and the SVG template is embedded directly in the HTML with zitto values as initial state.

---

### Task 1: HTML scaffold + embedded SVG with color class mapping

**Files:**
- Create: `index.html`

- [ ] **Step 1: Create HTML document structure**

```html
<!DOCTYPE html>
<html lang="it">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Zitto & Parlato</title>
<style>
/* CSS will be added in Task 2 */
</style>
</head>
<body>
<!-- SVG will be added in Step 2 -->
<!-- Controls will be added in Task 6 -->
<script>
// JS will be added in Tasks 3-6
</script>
</body>
</html>
```

- [ ] **Step 2: Embed the SVG with updated color classes**

Embed the full SVG from `svg/zitto.svg` with these class changes:
- `st0` → `arancione` on line 22-35, 38-51 (denti), but `rosso` on lines 56, 59 (forme occhi)
- `st1` → `arancione` (centro naso, line 65)
- `st2` → `rosso` for bocca bg (line 20), `arancione` for pupils (lines 55, 58), `giallo` for inner eye details (lines 57, 60) and nose outline (lines 63-64)

Result: replace the `<style>` block class definitions and each element's class attribute. The initial state is zitto (bocca chiusa).

```svg
<svg id="face" viewBox="0 0 1920 1080" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <style>
      .rosso { fill: #db1d1e; }
      .arancione { fill: #dd731c; }
      .giallo { fill: #dcc11e; }
    </style>
  </defs>
  <g id="bocca">
    <rect class="rosso" id="bocca-bg" x="710.8" y="638" width="496.6" height="152.6"/>
    <!-- 14 denti superiori: class="arancione" -->
    <!-- 14 denti inferiori: class="arancione" -->
  </g>
  <g id="occhi">
    <!-- pupilla sx: class="arancione", path from zitto -->
    <!-- forma occhio sx: class="rosso", static -->
    <!-- sopracciglia/shadows sx: class="giallo", static -->
    <!-- pupilla dx: class="arancione", path from zitto -->
    <!-- forma occhio dx: class="rosso", static -->
    <!-- sopracciglia/shadows dx: class="giallo", static -->
  </g>
  <g id="naso">
    <!-- contorno naso ×2: class="giallo", static -->
    <!-- centro naso: class="arancione", static -->
  </g>
</svg>
```

Give the animated elements explicit `id` attributes:
- Bocca bg: `id="bocca-bg"`
- Denti superiori: `id="ds-0"` through `ds-13`
- Denti inferiori: `id="di-0"` through `di-13`
- Pupilla sx: `id="pupilla-sx"`
- Pupilla dx: `id="pupilla-dx"`

This allows `document.getElementById()` in the animation loop.

- [ ] **Step 3: Verify file opens in browser**

Open `index.html` in a browser. Expected: the face SVG renders centered on a white background with the correct colors (red mouth bg, orange teeth/pupils/nose, yellow eye details/nose outline).

---

### Task 2: CSS layout + invert toggle

**Files:**
- Modify: `index.html` (add CSS in `<style>` section)

- [ ] **Step 1: Add base layout and control panel styles**

```css
* { margin: 0; padding: 0; box-sizing: border-box; }
body {
  background: #ffffff;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  font-family: system-ui, sans-serif;
  transition: background 0.3s;
}
svg#face {
  width: min(90vw, 90vh);
  max-width: 960px;
  display: block;
}
.controls {
  margin-top: 24px;
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  align-items: center;
  justify-content: center;
}
.controls label {
  display: flex;
  flex-direction: column;
  align-items: center;
  font-size: 14px;
  gap: 4px;
}
.controls input[type="range"] {
  width: 140px;
}
.volume-indicator {
  width: 200px;
  height: 8px;
  background: #eee;
  border-radius: 4px;
  overflow: hidden;
}
.volume-indicator-bar {
  height: 100%;
  width: 0%;
  background: #db1d1e;
  border-radius: 4px;
  transition: width 0.05s;
}
```

- [ ] **Step 2: Add invert toggle styles**

```css
body.invert { background: #000000; }
.invert .rosso { fill: #24e2e1 !important; }
.invert .arancione { fill: #228ce3 !important; }
.invert .giallo { fill: #233ee1 !important; }
.invert .volume-indicator { background: #333; }
.invert .volume-indicator-bar { background: #24e2e1; }
```

The invert toggle button adds/removes `invert` class on `<body>`. CSS `!important` overrides the inline or class-based fills.

- [ ] **Step 3: Add toggle button HTML in body**

```html
<button id="btn-invert" class="invert-btn">Inverti Colori</button>
```

And its CSS:
```css
.invert-btn {
  padding: 8px 16px;
  border: 2px solid currentColor;
  background: transparent;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  color: #000;
  transition: color 0.3s;
}
.invert .invert-btn { color: #fff; }
```

---

### Task 3: Morph data definitions + path interpolation helpers

**Files:**
- Modify: `index.html` (add JS in `<script>` section)

- [ ] **Step 1: Define morph data for all animated elements**

```js
const MORPH = {
  // Sfondo bocca: solo height cambia
  boccaBg: {
    el: () => document.getElementById('bocca-bg'),
    attrs: [
      { attr: 'height', a: 152.6, b: 368.3 }
    ]
  },
  // 14 denti superiori: solo height cambia
  dentiSup: Array.from({ length: 14 }, (_, i) => ({
    el: () => document.getElementById(`ds-${i}`),
    attrs: [
      { attr: 'height', a: 57.9, b: 122.5 }
    ]
  })),
  // 14 denti inferiori: y + height cambiano
  dentiInf: Array.from({ length: 14 }, (_, i) => ({
    el: () => document.getElementById(`di-${i}`),
    attrs: [
      { attr: 'y', a: 753.9, b: 894.2 },
      { attr: 'height', a: 51.1, b: 121.1 }
    ]
  })),
  // Pupille: path strings interpolate via numeric arrays
  pupillaSx: {
    el: () => document.getElementById('pupilla-sx'),
    isPath: true,
    a: 'M 852.3,395.7 c -4,9.5 -25,8 -40.4,1.5 c -15.4,-6.5 -32.5,-25.5 -28.4,-35.1 c 4,-9.5 27.7,-5.9 43.1,0.6 c 15.4,6.5 29.7,23.5 25.7,33 Z',
    b: 'M 850.9,399.1 c -8,18.7 -31.5,23.3 -46.9,16.8 c -15.4,-6.5 -28.4,-35.2 -20.4,-53.9 c 8,-18.7 33.9,-20.5 49.3,-14 c 15.4,6.5 26,32.4 18,51.1 Z'
  },
  pupillaDx: {
    el: () => document.getElementById('pupilla-dx'),
    isPath: true,
    a: 'M 1066.2,397 c 3.9,9.3 24.8,7.6 40.2,1.1 c 15.4,-6.5 32.6,-25.3 28.6,-34.6 c -3.9,-9.3 -27.6,-5.6 -42.9,1 c -15.4,6.5 -29.8,23.3 -25.9,32.5 Z',
    b: 'M 1067.4,399.7 c 7.8,18.4 31.2,22.7 46.6,16.1 c 15.4,-6.5 28.5,-34.8 20.7,-53.2 c -7.8,-18.4 -33.7,-19.9 -49,-13.4 c -15.4,6.5 -26.1,32 -18.3,50.4 Z'
  }
};
```

- [ ] **Step 2: Write lerp + path interpolation helpers**

```js
function lerp(a, b, t) {
  return a + (b - a) * t;
}

function lerpPath(dA, dB, t) {
  const numsA = dA.replace(/[MZc]/g, '').replace(/,/g, ' ').trim().split(/\s+/).map(Number);
  const numsB = dB.replace(/[MZc]/g, '').replace(/,/g, ' ').trim().split(/\s+/).map(Number);
  const len = Math.min(numsA.length, numsB.length);
  const out = ['M'];
  for (let i = 0; i < len; i++) {
    if (i > 0 && i % 6 === 0) out.push('c');
    out.push(lerp(numsA[i], numsB[i], t).toFixed(1));
  }
  out.push('Z');
  return out.join(' ');
}
```

This works because both paths have exactly: M followed by 24 numeric values (4 cubics × 6 coords each), then Z.

- [ ] **Step 3: Write the function that applies MORPH data at a given t**

```js
function applyMorph(t) {
  for (const key in MORPH) {
    const item = MORPH[key];
    const el = item.el();
    if (!el) continue;
    if (item.isPath) {
      el.setAttribute('d', lerpPath(item.a, item.b, t));
    } else if (item.attrs) {
      for (const a of item.attrs) {
        el.setAttribute(a.attr, lerp(a.a, a.b, t).toFixed(1));
      }
    }
  }
}
```

- [ ] **Step 4: Verify path arrays match length**

```js
// Quick sanity check — paste both pupil path strings and compare numeric count
function countPathNums(d) {
  return d.replace(/[MZc]/g, '').replace(/,/g, ' ').trim().split(/\s+/).length;
}
console.log('sx:', countPathNums(MORPH.pupillaSx.a), countPathNums(MORPH.pupillaSx.b)); // 24 24
console.log('dx:', countPathNums(MORPH.pupillaDx.a), countPathNums(MORPH.pupillaDx.b)); // 24 24
```

Open browser console to confirm all match.

---

### Task 4: Audio layer with envelope follower

**Files:**
- Modify: `index.html` (add JS)

- [ ] **Step 1: Request microphone access and create audio context**

```js
let audioCtx, analyser, dataArray;
let isAudioReady = false;
let micLevel = 0;
let envelope = 0;

async function initAudio() {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const source = audioCtx.createMediaStreamSource(stream);
    analyser = audioCtx.createAnalyser();
    analyser.fftSize = 1024;
    source.connect(analyser);
    dataArray = new Uint8Array(analyser.frequencyBinCount);
    isAudioReady = true;
  } catch (e) {
    console.warn('Microphone access denied:', e);
    // UI will show a message
  }
}
```

- [ ] **Step 2: Implement RMS calculation**

```js
function getRMS() {
  if (!isAudioReady) return 0;
  analyser.getByteTimeDomainData(dataArray);
  let sum = 0;
  for (let i = 0; i < dataArray.length; i++) {
    const val = (dataArray[i] - 128) / 128;
    sum += val * val;
  }
  return Math.sqrt(sum / dataArray.length);
}
```

- [ ] **Step 3: Implement envelope follower with configurable parameters**

```js
const envelopeParams = {
  attack: 0.1,   // 0-1, higher = faster
  release: 0.05, // 0-1, higher = faster
  threshold: 0.02
};

function updateEnvelope() {
  micLevel = getRMS();
  const t = envelopeParams.threshold;
  const signal = micLevel > t ? (micLevel - t) / (1 - t) : 0;
  if (signal > envelope) {
    envelope += envelopeParams.attack * (signal - envelope);
  } else {
    envelope += envelopeParams.release * (signal - envelope);
  }
  if (envelope < 0.001) envelope = 0;
  return envelope;
}
```

Note: The attack/release params are per-frame coefficients (not time in ms), making them intuitive as slider ranges (0-1).

---

### Task 5: Animation loop + volume indicator

**Files:**
- Modify: `index.html` (add JS)

- [ ] **Step 1: Create the rAF loop that ties audio to morph**

```js
function animate() {
  if (isAudioReady) {
    updateEnvelope();
    applyMorph(envelope);
    updateVolumeUI(micLevel);
  }
  requestAnimationFrame(animate);
}
```

- [ ] **Step 2: Add volume indicator UI update**

```js
function updateVolumeUI(level) {
  const bar = document.getElementById('volume-bar');
  if (bar) {
    bar.style.width = Math.min(100, level * 200) + '%';
  }
}
```

- [ ] **Step 3: Wire init and start the loop**

```js
document.addEventListener('DOMContentLoaded', () => {
  initAudio();
  animate();
});
```

Ensure the volume indicator bar element exists in HTML:
```html
<div class="volume-indicator">
  <div class="volume-indicator-bar" id="volume-bar"></div>
</div>
```

- [ ] **Step 4: Manual verification**

Open the page, grant mic permission, make sounds. The mouth should open/close and pupils should shift in response to audio.

---

### Task 6: UI controls panel

**Files:**
- Modify: `index.html`

- [ ] **Step 1: Add slider HTML for attack, release, threshold**

```html
<div class="controls">
  <label>
    Attack
    <input type="range" id="slider-attack" min="0.01" max="0.5" step="0.01" value="0.1">
  </label>
  <label>
    Release
    <input type="range" id="slider-release" min="0.01" max="0.5" step="0.01" value="0.05">
  </label>
  <label>
    Soglia
    <input type="range" id="slider-threshold" min="0" max="0.1" step="0.005" value="0.02">
  </label>
  <div class="volume-indicator">
    <div class="volume-indicator-bar" id="volume-bar"></div>
  </div>
  <button id="btn-invert">Inverti Colori</button>
</div>
```

- [ ] **Step 2: Wire slider events to envelopeParams**

```js
document.getElementById('slider-attack').addEventListener('input', function() {
  envelopeParams.attack = parseFloat(this.value);
});
document.getElementById('slider-release').addEventListener('input', function() {
  envelopeParams.release = parseFloat(this.value);
});
document.getElementById('slider-threshold').addEventListener('input', function() {
  envelopeParams.threshold = parseFloat(this.value);
});
```

- [ ] **Step 3: Wire invert toggle**

```js
document.getElementById('btn-invert').addEventListener('click', () => {
  document.body.classList.toggle('invert');
});
```

---

### Task 7: Polish and final verification

**Files:**
- Modify: `index.html`

- [ ] **Step 1: Test all together**

Open `index.html` in a browser. Verify:
- Face renders centered with correct colors
- Granting mic permission starts animation
- Speaking into mic opens mouth and shifts pupils
- Sliders adjust response feel
- Invert toggle swaps all colors correctly

- [ ] **Step 2: Handle edge cases**

Add a fallback message in the SVG if mic is denied:
```html
<text x="960" y="540" text-anchor="middle" font-family="sans-serif" font-size="24">
  Concedi il permesso al microfono per iniziare
</text>
```
Show it until `isAudioReady` becomes true, then hide it.

- [ ] **Step 3: Final sanity**

Open DevTools, no console errors. Resize window — SVG scales properly. All slider values update envelope in real time. Invert toggle works on all colored elements.

---

## Summary

| Task | What it builds | Verification |
|------|---------------|-------------|
| 1 | HTML + SVG with color classes | Opens in browser, face visible |
| 2 | CSS layout + invert styles | Colors look right, invert works |
| 3 | Morph data + lerp helpers | Path nums match (console) |
| 4 | Audio layer + envelope | Mic works, RMS changes with sound |
| 5 | Animation loop | Face responds to audio |
| 6 | UI controls | Sliders adjust behavior live |
| 7 | Polish + edge cases | Zero console errors, smooth UX |
