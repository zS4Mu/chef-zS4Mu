const wordEl = document.getElementById('word');
const wordInput = document.getElementById('wordInput');
const fontSelect = document.getElementById('fontSelect');
const speedSlider = document.getElementById('speedSlider');
const speedValue = document.getElementById('speedValue');
const sunEl = document.querySelector('.sun');

const ORBIT_RADIUS_RATIO = 0.45;
const ORBIT_ASPECT = 2.2;
const FONT_STORAGE_KEY = 'parola-font';
const WORD_STORAGE_KEY = 'parola-word';
const SPEED_STORAGE_KEY = 'parola-speed';

let angle = 0;
let orbitRadius = 200;
let loadedFonts = new Set();
let speed = 0.015;
let baseFontSize = null;

function getOrbitRadius() {
  const scene = document.querySelector('.scene');
  const size = scene.offsetWidth;
  return size * ORBIT_RADIUS_RATIO;
}

function updateSun(angle) {
  orbitRadius = getOrbitRadius();
  const x = Math.cos(angle) * orbitRadius * ORBIT_ASPECT;
  const y = Math.sin(angle) * orbitRadius;
  sunEl.style.transform = `translate(-50%, -50%) translate(${x}px, ${y}px)`;
}

function updateWordGradient(angle) {
  const cssAngle = (angle * 180 / Math.PI + 90) % 360;
  wordEl.style.backgroundImage = `linear-gradient(${cssAngle}deg, #000 0%, #333 50%, #666 80%)`;
}

function updateWordShadow(angle) {
  const shadowLength = 60;
  const shadowBlur = 20;
  const dx = -Math.cos(angle);
  const dy = -Math.sin(angle);
  wordEl.style.textShadow = `${dx * shadowLength}px ${dy * shadowLength}px ${shadowBlur}px rgba(0, 0, 0, 0.15)`;
}

function animate() {
  angle += speed;
  updateSun(angle);
  updateWordGradient(angle);
  updateWordShadow(angle);
  requestAnimationFrame(animate);
}

function adjustFontSize() {
  if (baseFontSize === null) {
    baseFontSize = parseFloat(getComputedStyle(wordEl).fontSize);
  }
  const controlsRect = document.querySelector('.controls').getBoundingClientRect();
  const availableWidth = controlsRect.left - 40;
  wordEl.style.whiteSpace = 'nowrap';
  wordEl.style.fontSize = baseFontSize + 'px';
  const wordWidth = wordEl.scrollWidth;
  if (wordWidth > availableWidth) {
    const ratio = availableWidth / wordWidth;
    wordEl.style.fontSize = (baseFontSize * ratio) + 'px';
  }
}

wordInput.addEventListener('input', () => {
  const text = wordInput.value.trim();
  wordEl.textContent = text || 'scrivi qui...';
  localStorage.setItem(WORD_STORAGE_KEY, wordInput.value);
  adjustFontSize();
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
      adjustFontSize();
    }
  });
}

speedSlider.addEventListener('input', () => {
  const val = parseInt(speedSlider.value);
  speed = 0.001 + (val / 100) * 0.059;
  speedValue.textContent = val;
  localStorage.setItem(SPEED_STORAGE_KEY, val);
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
  const savedSpeed = localStorage.getItem(SPEED_STORAGE_KEY);
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
  if (savedSpeed !== null) {
    speedSlider.value = savedSpeed;
    speedValue.textContent = savedSpeed;
    speed = 0.001 + (parseInt(savedSpeed) / 100) * 0.059;
  }
}

initFromURL();
initFromStorage();
loadFont(fontSelect.value);
adjustFontSize();
window.addEventListener('resize', () => {
  baseFontSize = null;
  wordEl.style.fontSize = '';
  adjustFontSize();
});
animate();
