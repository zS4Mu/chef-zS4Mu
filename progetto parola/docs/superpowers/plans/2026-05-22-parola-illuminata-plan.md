# Parola Illuminata Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** A single-page site where a user types a word, a sun orbits it, and the word is lit by a gradient matching the sun's position.

**Architecture:** One HTML page + one CSS file + one JS file. No frameworks. Sun position and gradient are synced via requestAnimationFrame driven entirely from JS.

**Tech Stack:** HTML5, CSS3, vanilla JavaScript, Google Fonts WebFontLoader

---

### Task 1: Create index.html

**Files:**
- Create: `index.html`

- [ ] **Step 1: Write index.html**

```html
<!DOCTYPE html>
<html lang="it">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Parola Illuminata</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <script src="https://ajax.googleapis.com/ajax/libs/webfont/1.6.26/webfont.js"></script>
  <link rel="stylesheet" href="css/style.css">
</head>
<body>
  <div class="scene">
    <div class="orbit-path"></div>
    <div class="sun"></div>
    <div class="word" id="word">scrivi qui...</div>
  </div>
  <div class="controls">
    <input type="text" id="wordInput" class="control-input" value="" placeholder="Scrivi una parola...">
    <select id="fontSelect" class="control-select">
      <option value="IBM Plex Sans">IBM Plex Sans</option>
      <option value="Orbitron">Orbitron</option>
      <option value="Playfair Display">Playfair Display</option>
      <option value="Monoton">Monoton</option>
      <option value="Rubik Dirt">Rubik Dirt</option>
      <option value="Major Mono Display">Major Mono Display</option>
      <option value="Bangers">Bangers</option>
      <option value="Press Start 2P">Press Start 2P</option>
      <option value="WindSong">WindSong</option>
      <option value="UnifrakturMaguntia">UnifrakturMaguntia</option>
    </select>
    <button id="copyBtn" class="control-btn">Copia link</button>
  </div>
  <script src="js/script.js"></script>
</body>
</html>
```

- [ ] **Step 2: Create empty css/style.css and js/script.js**

Run:
```powershell
New-Item -ItemType File -Path "css/style.css" -Force
New-Item -ItemType File -Path "js/script.js" -Force
```

- [ ] **Step 3: Commit**

```powershell
git add index.html css/style.css js/script.js
git commit -m "feat: initial project structure"
```

---

### Task 2: Write css/style.css

**Files:**
- Modify: `css/style.css`

- [ ] **Step 1: Write full CSS**

```css
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  height: 100vh;
  background: #0a0a1a;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: 'IBM Plex Sans', sans-serif;
  overflow: hidden;
  color: #fff;
}

.scene {
  position: relative;
  width: min(80vw, 80vh);
  height: min(80vw, 80vh);
  display: flex;
  align-items: center;
  justify-content: center;
}

.orbit-path {
  position: absolute;
  width: 100%;
  height: 100%;
  border: 1px dashed rgba(255, 255, 255, 0.12);
  border-radius: 50%;
  pointer-events: none;
}

.sun {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 36px;
  height: 36px;
  margin: -18px 0 0 -18px;
  border-radius: 50%;
  background: radial-gradient(circle at 35% 35%, #fff8e0, #ffbb00, #ff6600);
  box-shadow: 0 0 40px 10px rgba(255, 200, 50, 0.4), 0 0 80px 30px rgba(255, 150, 0, 0.15);
  pointer-events: none;
}

.word {
  font-size: clamp(2rem, 8vw, 6rem);
  font-weight: 700;
  text-align: center;
  line-height: 1.2;
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  color: transparent;
  z-index: 1;
  padding: 0.5em;
  max-width: 80%;
  word-break: break-word;
  transition: font-family 0.3s ease;
}

.controls {
  position: fixed;
  bottom: 32px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 12px;
  align-items: center;
  background: rgba(255, 255, 255, 0.04);
  backdrop-filter: blur(12px);
  padding: 12px 20px;
  border-radius: 16px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  z-index: 10;
}

.control-input {
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 8px;
  padding: 8px 14px;
  color: #fff;
  font-size: 0.95rem;
  font-family: inherit;
  outline: none;
  width: 200px;
  transition: border-color 0.2s;
}

.control-input:focus {
  border-color: rgba(255, 200, 50, 0.4);
}

.control-input::placeholder {
  color: rgba(255, 255, 255, 0.25);
}

.control-select {
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 8px;
  padding: 8px 14px;
  color: #fff;
  font-size: 0.95rem;
  font-family: inherit;
  outline: none;
  cursor: pointer;
  max-width: 180px;
}

.control-select option {
  background: #1a1a2e;
  color: #fff;
}

.control-btn {
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 8px;
  padding: 8px 16px;
  color: #fff;
  font-size: 0.9rem;
  cursor: pointer;
  font-family: inherit;
  transition: background 0.2s;
  white-space: nowrap;
}

.control-btn:hover {
  background: rgba(255, 255, 255, 0.14);
}

@media (max-width: 600px) {
  .controls {
    flex-wrap: wrap;
    justify-content: center;
    bottom: 16px;
    padding: 10px 14px;
    width: calc(100% - 32px);
  }
  .control-input {
    width: 100%;
  }
  .control-select {
    max-width: 100%;
    flex: 1;
  }
}
```

- [ ] **Step 2: Commit**

```powershell
git add css/style.css
git commit -m "feat: CSS - space theme, orbit, sun, and controls"
```

---

### Task 3: Write js/script.js

**Files:**
- Modify: `js/script.js`

- [ ] **Step 1: Write full JS**

```js
const wordEl = document.getElementById('word');
const wordInput = document.getElementById('wordInput');
const fontSelect = document.getElementById('fontSelect');
const copyBtn = document.getElementById('copyBtn');
const sunEl = document.querySelector('.sun');

const ORBIT_RADIUS_RATIO = 0.45;
const SPEED = 0.015;
const FONT_STORAGE_KEY = 'parola-font';
const WORD_STORAGE_KEY = 'parola-word';

let angle = 0;
let orbitRadius = 200;
let loadedFonts = new Set();

function getOrbitRadius() {
  const scene = document.querySelector('.scene');
  const size = scene.offsetWidth;
  return size * ORBIT_RADIUS_RATIO;
}

function updateSun(angle) {
  orbitRadius = getOrbitRadius();
  const transform = `translate(-50%, -50%) rotate(${angle}rad) translateX(${orbitRadius}px)`;
  sunEl.style.transform = transform;
}

function updateWordGradient(angle) {
  const cssAngle = (angle * 180 / Math.PI + 90) % 360;
  wordEl.style.backgroundImage = `linear-gradient(${cssAngle}deg, #111 0%, #555 30%, #ddd 60%, #fff 80%)`;
}

function animate() {
  angle += SPEED;
  updateSun(angle);
  updateWordGradient(angle);
  requestAnimationFrame(animate);
}

wordInput.addEventListener('input', () => {
  const text = wordInput.value.trim();
  wordEl.textContent = text || 'scrivi qui...';
  localStorage.setItem(WORD_STORAGE_KEY, wordInput.value);
});

fontSelect.addEventListener('change', () => {
  const font = fontSelect.value;
  loadFont(font);
  localStorage.setItem(FONT_STORAGE_KEY, font);
});

function loadFont(font) {
  if (loadedFonts.has(font)) {
    wordEl.style.fontFamily = `"${font}", sans-serif`;
    return;
  }
  wordEl.style.fontFamily = `"${font}", sans-serif`;
  WebFont.load({
    google: { families: [font] },
    fontactive: () => {
      loadedFonts.add(font);
      wordEl.style.fontFamily = `"${font}", sans-serif`;
    }
  });
}

copyBtn.addEventListener('click', () => {
  const word = wordInput.value.trim();
  const font = fontSelect.value;
  const url = new URL(window.location.href);
  if (word) url.searchParams.set('parola', word);
  if (font !== 'IBM Plex Sans') url.searchParams.set('font', font);
  navigator.clipboard.writeText(url.toString()).then(() => {
    copyBtn.textContent = 'Copiato!';
    setTimeout(() => { copyBtn.textContent = 'Copia link'; }, 1500);
  });
});

function initFromURL() {
  const params = new URLSearchParams(window.location.search);
  const word = params.get('parola');
  const font = params.get('font');
  if (word) {
    wordInput.value = word;
    wordEl.textContent = word;
  }
  if (font) {
    const option = fontSelect.querySelector(`option[value="${font}"]`);
    if (option) {
      fontSelect.value = font;
      loadFont(font);
    }
  }
}

function initFromStorage() {
  const font = localStorage.getItem(FONT_STORAGE_KEY);
  const word = localStorage.getItem(WORD_STORAGE_KEY);
  if (font) {
    const option = fontSelect.querySelector(`option[value="${font}"]`);
    if (option) {
      fontSelect.value = font;
    }
    loadFont(font);
  }
  if (word) {
    wordInput.value = word;
    wordEl.textContent = word || 'scrivi qui...';
  }
}

initFromURL();
initFromStorage();
loadFont(fontSelect.value);
animate();
```

- [ ] **Step 2: Commit**

```powershell
git add js/script.js
git commit -m "feat: JS - animation loop, gradient sync, input, font loader, URL sharing"
```

---

### Task 4: Verify the site works

**Files:** (none)

- [ ] **Step 1: Open index.html in browser**

Open `index.html` directly or serve with a static server. Verify:
- Word "scrivi qui..." is centered with a sun orbiting
- Gradient on text shifts smoothly with the sun
- Typing in the input updates the word in real-time
- Changing the font loads and applies the new font
- Clicking "Copia link" copies a URL with the word and font as params
- Opening the copied URL restores the word and font
- On small screens, controls wrap properly
