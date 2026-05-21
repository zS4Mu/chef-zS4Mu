# Tiramisù Website Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a single-page interactive tiramisù recipe website in Vanilla HTML/CSS/JS

**Architecture:** Three files (index.html, style.css, script.js) in `codebase/`. No framework, no build. Opened directly in browser. Interactivity via slider-driven dose calculator and step-by-step checklist with localStorage persistence.

**Tech Stack:** Vanilla HTML5, CSS3, JavaScript (ES6)

---

## File Structure

- `codebase/index.html` — HTML structure: header, ingredienti, preparazione, footer
- `codebase/style.css` — All styles: palette, layout, responsive, interactive states
- `codebase/script.js` — All logic: dose calculator, checklist, localStorage

---

### Task 1: HTML structure

**Files:**
- Create: `codebase/index.html`

- [ ] **Step 1: Write the full HTML**

```html
<!DOCTYPE html>
<html lang="it">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Ricetta Tiramisù — Chef Sasso</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>

<header class="hero">
    <h1>Ricetta Tiramisù</h1>
    <p class="chef">di <strong>Chef Sasso</strong></p>
    <p class="subtitle">Il tiramisù classico fatto in casa, passo dopo passo.</p>
</header>

<main class="container">
    <section class="ingredients-section">
        <h2>Ingredienti</h2>
        <div class="servings-control">
            <label for="servings-slider">Porzioni:</label>
            <input type="range" id="servings-slider" min="2" max="20" value="6">
            <span id="servings-display">6</span>
        </div>
        <ul id="ingredients-list">
            <li data-base="1000" data-unit="g" data-label="Mascarpone">1000 g di Mascarpone</li>
            <li data-base="8" data-unit="" data-label="Uova" data-round="ceil">8 uova</li>
            <li data-base="350" data-unit="g" data-label="Savoiardi">350 g di savoiardi (circa 42 pezzi)</li>
            <li data-base="200" data-unit="g" data-label="Zucchero">200 g di zucchero</li>
            <li data-base="200" data-unit="g" data-label="Caffè">200 g di caffè</li>
            <li data-base="0" data-unit="" data-label="Cacao">Cacao amaro in polvere q.b.</li>
        </ul>
    </section>

    <section class="preparation-section">
        <h2>Preparazione</h2>
        <ol id="steps-list">
            <li>
                <label class="step-label">
                    <input type="checkbox" class="step-checkbox" data-step="0">
                    <span class="step-text"><strong>Preparare il caffè.</strong> Prendere la moka, svitarla e togliere il filtro. Riempire il contenitore dell'acqua fino alla valvola, chiudere con il filtro e riempirlo di caffè in polvere formando una montagnetta. Riavvitare la moka e posizionarla sul piano cottura. Accendere il gas e attendere che il caffè esca dal canale di uscita e la parte superiore si riempia. Spegnere il gas, versare il caffè in una ciotola di vetro larga e bassa e lasciarlo raffreddare.</span>
                </label>
            </li>
            <li>
                <label class="step-label">
                    <input type="checkbox" class="step-checkbox" data-step="1">
                    <span class="step-text"><strong>Preparare la crema.</strong> In una ciotola di vetro, separare i tuorli dagli albumi. Aggiungere 100 g di zucchero ai tuorli e montare con una frusta elettrica fino a ottenere una consistenza liscia e giallina. Aggiungere il mascarpone con una marisa e montare ancora per 1 minuto.</span>
                </label>
            </li>
            <li>
                <label class="step-label">
                    <input type="checkbox" class="step-checkbox" data-step="2">
                    <span class="step-text"><strong>Montare gli albumi.</strong> Montare gli albumi con la frusta elettrica finché non diventano bianco neve e voluminosi.</span>
                </label>
            </li>
            <li>
                <label class="step-label">
                    <input type="checkbox" class="step-checkbox" data-step="3">
                    <span class="step-text"><strong>Unire.</strong> Aggiungere gli albumi montati alla crema di uova e mascarpone e amalgamare delicatamente.</span>
                </label>
            </li>
            <li>
                <label class="step-label">
                    <input type="checkbox" class="step-checkbox" data-step="4">
                    <span class="step-text"><strong>Comporre il tiramisù.</strong> Prendere una pirofila rettangolare e spalmare un cucchiaio di crema sul fondo. Aggiungere lo zucchero rimasto al caffè e mescolare. Inzuppare i savoiardi nel caffè uno alla volta e disporli nella pirofila, coprendo tutta la superficie. Coprire con uno strato di crema. Spolverare con cacao amaro usando un colino.</span>
                </label>
            </li>
            <li>
                <label class="step-label">
                    <input type="checkbox" class="step-checkbox" data-step="5">
                    <span class="step-text"><strong>Riposo in frigorifero.</strong> Coprire la pirofila con pellicola trasparente senza toccare il tiramisù e lasciare riposare in frigorifero per una notte.</span>
                </label>
            </li>
            <li>
                <label class="step-label">
                    <input type="checkbox" class="step-checkbox" data-step="6">
                    <span class="step-text"><strong>Servire.</strong> Il giorno dopo è pronto per essere mangiato.</span>
                </label>
            </li>
        </ol>
        <button id="reset-checklist" class="btn-reset">Reset checklist</button>
    </section>
</main>

<footer class="footer">
    <p>Ricetta di Chef Sasso</p>
</footer>

<script src="script.js"></script>
</body>
</html>
```

- [ ] **Step 2: Verify file created**

Run: `Test-Path -LiteralPath "codebase/index.html"`
Expected: True

---

### Task 2: CSS styling

**Files:**
- Create: `codebase/style.css`

- [ ] **Step 1: Write the full CSS**

```css
/* === Reset & Base === */
*, *::before, *::after {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
}

body {
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    background-color: #FFF8F0;
    color: #3C1F0E;
    line-height: 1.6;
}

/* === Hero Header === */
.hero {
    background: linear-gradient(135deg, #3C1F0E 0%, #6B3A2A 100%);
    color: #FFF8F0;
    text-align: center;
    padding: 3rem 1rem;
}

.hero h1 {
    font-family: Georgia, 'Times New Roman', Times, serif;
    font-size: 2.8rem;
    margin-bottom: 0.5rem;
    letter-spacing: 1px;
}

.hero .chef {
    font-size: 1.1rem;
    opacity: 0.9;
    margin-bottom: 0.5rem;
}

.hero .subtitle {
    font-size: 1rem;
    opacity: 0.75;
    font-style: italic;
}

/* === Layout === */
.container {
    max-width: 1100px;
    margin: 0 auto;
    padding: 2rem 1rem;
    display: grid;
    grid-template-columns: 1fr;
    gap: 2rem;
}

@media (min-width: 769px) {
    .container {
        grid-template-columns: 1fr 1.5fr;
    }
}

/* === Sections === */
section h2 {
    font-family: Georgia, 'Times New Roman', Times, serif;
    font-size: 1.8rem;
    color: #6B3A2A;
    border-bottom: 2px solid #6B3A2A;
    padding-bottom: 0.5rem;
    margin-bottom: 1.5rem;
}

/* === Servings Slider === */
.servings-control {
    display: flex;
    align-items: center;
    gap: 1rem;
    margin-bottom: 1.5rem;
    flex-wrap: wrap;
}

.servings-control label {
    font-weight: 600;
    font-size: 1.1rem;
}

#servings-slider {
    flex: 1;
    min-width: 150px;
    accent-color: #6B3A2A;
}

#servings-display {
    font-weight: 700;
    font-size: 1.3rem;
    color: #6B3A2A;
    min-width: 2rem;
    text-align: center;
}

/* === Ingredients List === */
#ingredients-list {
    list-style: none;
    padding: 0;
}

#ingredients-list li {
    padding: 0.6rem 0;
    border-bottom: 1px solid #F5E6D3;
    font-size: 1.05rem;
}

#ingredients-list li:last-child {
    border-bottom: none;
}

#ingredients-list li.ingredient-qb {
    font-style: italic;
    color: #6B3A2A;
}

/* === Steps List === */
#steps-list {
    padding-left: 0;
    list-style: none;
    counter-reset: step-counter;
}

#steps-list li {
    counter-increment: step-counter;
    margin-bottom: 1rem;
    padding: 1rem;
    background: #FFF8F0;
    border: 1px solid #F5E6D3;
    border-radius: 8px;
    transition: background 0.3s, opacity 0.3s;
}

#steps-list li::before {
    content: counter(step-counter) ".";
    font-weight: 700;
    font-size: 1.2rem;
    color: #6B3A2A;
    margin-right: 0.5rem;
}

.step-label {
    display: flex;
    align-items: flex-start;
    gap: 0.75rem;
    cursor: pointer;
}

.step-checkbox {
    margin-top: 0.25rem;
    width: 1.2rem;
    height: 1.2rem;
    accent-color: #4CAF50;
    flex-shrink: 0;
}

.step-text {
    flex: 1;
}

#steps-list li.completed {
    background: #E8F5E9;
    border-color: #4CAF50;
    opacity: 0.8;
}

#steps-list li.completed .step-text {
    text-decoration: line-through;
    color: #4CAF50;
}

/* === Reset Button === */
.btn-reset {
    display: inline-block;
    margin-top: 1rem;
    padding: 0.5rem 1.5rem;
    background: #6B3A2A;
    color: #FFF8F0;
    border: none;
    border-radius: 6px;
    font-size: 0.95rem;
    cursor: pointer;
    transition: background 0.2s;
}

.btn-reset:hover {
    background: #3C1F0E;
}

/* === Footer === */
.footer {
    text-align: center;
    padding: 2rem;
    color: #6B3A2A;
    opacity: 0.7;
    font-size: 0.9rem;
    border-top: 1px solid #F5E6D3;
    margin-top: 1rem;
}
```

- [ ] **Step 2: Verify file created**

Run: `Test-Path -LiteralPath "codebase/style.css"`
Expected: True

---

### Task 3: JavaScript interactivity

**Files:**
- Create: `codebase/script.js`

- [ ] **Step 1: Write the full JavaScript**

```javascript
const STORAGE_CHECKLIST_KEY = 'tiramisu-checklist';
const STORAGE_SERVINGS_KEY = 'tiramisu-porzioni';
const BASE_SERVINGS = 6;

// === Ingredients data ===
const ingredients = document.querySelectorAll('#ingredients-list li[data-base]');

// === DOM refs ===
const slider = document.getElementById('servings-slider');
const servingsDisplay = document.getElementById('servings-display');
const checkboxes = document.querySelectorAll('.step-checkbox');
const resetBtn = document.getElementById('reset-checklist');

// === Dose calculator ===
function updateQuantities() {
    const porzioni = parseInt(slider.value, 10);
    const factor = porzioni / BASE_SERVINGS;
    servingsDisplay.textContent = porzioni;

    ingredients.forEach(li => {
        const base = parseFloat(li.dataset.base);
        if (base === 0) return;
        const unit = li.dataset.unit || '';
        const label = li.dataset.label;
        const roundFn = li.dataset.round === 'ceil' ? Math.ceil : Math.round;
        const qty = roundFn(base * factor);
        li.textContent = `${qty} ${unit}di ${label}`.trim();
    });
}

slider.addEventListener('input', updateQuantities);

// === Checklist ===
function loadChecklist() {
    try {
        const saved = JSON.parse(localStorage.getItem(STORAGE_CHECKLIST_KEY));
        if (Array.isArray(saved) && saved.length === checkboxes.length) {
            checkboxes.forEach((cb, i) => {
                cb.checked = saved[i];
                updateStepStyle(cb, saved[i]);
            });
        }
    } catch {
        resetChecklist();
    }
}

function saveChecklist() {
    const state = Array.from(checkboxes).map(cb => cb.checked);
    localStorage.setItem(STORAGE_CHECKLIST_KEY, JSON.stringify(state));
}

function updateStepStyle(checkbox, checked) {
    const li = checkbox.closest('li');
    if (checked) {
        li.classList.add('completed');
    } else {
        li.classList.remove('completed');
    }
}

function resetChecklist() {
    checkboxes.forEach(cb => {
        cb.checked = false;
        updateStepStyle(cb, false);
    });
    saveChecklist();
}

checkboxes.forEach(cb => {
    cb.addEventListener('change', () => {
        updateStepStyle(cb, cb.checked);
        saveChecklist();
    });
});

resetBtn.addEventListener('click', resetChecklist);

// === Servings persistence ===
function loadServings() {
    try {
        const saved = localStorage.getItem(STORAGE_SERVINGS_KEY);
        if (saved !== null) {
            const val = parseInt(saved, 10);
            if (val >= 2 && val <= 20) {
                slider.value = val;
            }
        }
    } catch {
        // ignore, use default
    }
}

function saveServings() {
    localStorage.setItem(STORAGE_SERVINGS_KEY, slider.value);
}

slider.addEventListener('change', saveServings);

// === Init ===
loadServings();
updateQuantities();
loadChecklist();
```

- [ ] **Step 2: Verify file created**

Run: `Test-Path -LiteralPath "codebase/script.js"`
Expected: True

---

### Task 4: Verify everything works

- [ ] **Step 1: Confirm all three files exist**

Run: `Get-ChildItem -LiteralPath "codebase" | Select-Object Name`
Expected: index.html, style.css, script.js

- [ ] **Step 2: Open the page in a non-visual check**

Run: `Get-Content -LiteralPath "codebase/index.html" | Select-Object -First 3`
Expected: DOCTYPE html, html lang="it"
