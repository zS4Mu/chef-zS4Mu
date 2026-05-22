# Sito Ricetta Tiramisù — Piano di Implementazione

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Single-page retro-futuristic recipe site for tiramisù, bilingue IT/EN.

**Architecture:** Tre file vanilla (HTML + CSS + JS), nessun build tool. La pagina si apre direttamente nel browser. I dati sono inclusi nello script come oggetti JavaScript. La scalatura porzioni è calcolata in tempo reale sul rapporto `(nuovo / 8) * base`. Il cambio lingua scambia il contenuto testuale tramite data-attribute.

**Tech Stack:** HTML5, CSS3, JavaScript ES6, Google Fonts (Anta)

---

### Task 1: Struttura HTML

**File:** Create `index.html`

- [ ] **Step 1: Creare index.html con struttura base**

```html
<!DOCTYPE html>
<html lang="it">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Tiramisù — Ricetta di Sasso</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Anta&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="style.css">
</head>
<body>
  <div class="container">
    <!-- Header -->
    <header>
      <div class="header-top">
        <div class="lang-toggle">
          <button class="lang-btn active" data-lang="it">IT</button>
          <button class="lang-btn" data-lang="en">EN</button>
        </div>
      </div>
      <h1 class="recipe-title" data-it="Tiramisù" data-en="Tiramisù">Tiramisù</h1>
      <p class="recipe-chef" data-it="Ricetta di Sasso" data-en="Recipe by Sasso">Ricetta di Sasso</p>
    </header>

    <!-- Porzioni -->
    <section class="portion-selector">
      <label data-it="Porzioni:" data-en="Servings:">Porzioni:</label>
      <select id="portion-select">
        <option value="2">2</option>
        <option value="4">4</option>
        <option value="6">6</option>
        <option value="8" selected>8</option>
        <option value="10">10</option>
        <option value="12">12</option>
        <option value="custom" data-it="Personalizzato" data-en="Custom">Personalizzato</option>
      </select>
      <input type="number" id="portion-custom" min="1" value="8" placeholder="N°">
    </section>

    <!-- Ingredienti -->
    <section class="ingredients">
      <h2 data-it="Ingredienti" data-en="Ingredients">Ingredienti</h2>
      <ul id="ingredient-list"></ul>
    </section>

    <!-- Preparazione -->
    <section class="steps">
      <h2 data-it="Preparazione" data-en="Preparation">Preparazione</h2>
      <ol id="steps-list"></ol>
    </section>

    <!-- Condivisione -->
    <section class="share">
      <button id="share-btn" data-it="Copia link" data-en="Copy link">Copia link</button>
      <span id="share-feedback" class="hidden" data-it="Link copiato!" data-en="Link copied!">Link copiato!</span>
    </section>
  </div>

  <!-- Footer -->
  <footer>
    <p data-it="Ricetta di Sasso — Tutti i diritti riservati" data-en="Recipe by Sasso — All rights reserved">Ricetta di Sasso — Tutti i diritti riservati</p>
  </footer>

  <script src="script.js"></script>
</body>
</html>
```

- [ ] **Step 2: Verificare apertura in browser**

Aprire `index.html` nel browser. Verificare che la pagina si carichi (anche senza stili/script è ok).

---

### Task 2: CSS Retro-Futuristico

**File:** Create `style.css`

- [ ] **Step 1: Scrivere style.css completo**

```css
/* === RESET & BASE === */
*, *::before, *::after {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: system-ui, -apple-system, sans-serif;
  background: #0d0b1a;
  color: #e0dcd0;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  overflow-x: hidden;
}

/* Grain texture overlay */
body::before {
  content: '';
  position: fixed;
  inset: 0;
  z-index: 0;
  opacity: 0.035;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
  background-repeat: repeat;
  background-size: 256px 256px;
  pointer-events: none;
}

.container {
  position: relative;
  z-index: 1;
  max-width: 720px;
  width: 100%;
  padding: 2rem 1.5rem;
}

/* === TIPOGRAFIA === */
h1, h2 {
  font-family: 'Anta', sans-serif;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

h1 {
  font-size: 3rem;
  background: linear-gradient(135deg, #FF6B35, #FF1493);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-shadow: none;
  margin-bottom: 0.25rem;
}

h2 {
  font-size: 1.5rem;
  color: #00B4D8;
  margin-bottom: 1rem;
  border-bottom: 2px solid #00B4D8;
  padding-bottom: 0.5rem;
}

/* === HEADER === */
header {
  text-align: center;
  margin-bottom: 2rem;
  position: relative;
}

.header-top {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 1rem;
}

.lang-toggle {
  display: flex;
  gap: 0;
  border: 2px solid #00B4D8;
  border-radius: 0;
  overflow: hidden;
}

.lang-btn {
  font-family: 'Anta', sans-serif;
  background: transparent;
  color: #e0dcd0;
  border: none;
  padding: 0.4rem 0.8rem;
  cursor: pointer;
  font-size: 0.85rem;
  transition: all 0.2s;
}

.lang-btn.active {
  background: #00B4D8;
  color: #0d0b1a;
}

.lang-btn:hover:not(.active) {
  background: rgba(0, 180, 216, 0.2);
}

.recipe-chef {
  color: #888;
  font-style: italic;
  font-size: 0.95rem;
}

/* === SEZIONE PORZIONI === */
.portion-selector {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 2rem;
  padding: 1rem;
  border: 1px solid rgba(255, 107, 53, 0.4);
  background: rgba(255, 107, 53, 0.06);
}

.portion-selector label {
  font-family: 'Anta', sans-serif;
  color: #FF6B35;
  font-size: 1rem;
}

#portion-select {
  background: transparent;
  color: #e0dcd0;
  border: 1px solid #FF6B35;
  padding: 0.4rem 0.6rem;
  font-size: 1rem;
  cursor: pointer;
  font-family: inherit;
}

#portion-select:focus {
  outline: none;
  box-shadow: 0 0 8px rgba(255, 107, 53, 0.5);
}

#portion-custom {
  background: transparent;
  color: #e0dcd0;
  border: 1px solid #FF1493;
  padding: 0.4rem 0.6rem;
  font-size: 1rem;
  width: 70px;
  display: none;
  font-family: inherit;
}

#portion-custom:focus {
  outline: none;
  box-shadow: 0 0 8px rgba(255, 20, 147, 0.5);
}

/* === INGREDIENTI === */
.ingredients {
  margin-bottom: 2.5rem;
  padding: 1.5rem;
  border: 1px solid rgba(0, 180, 216, 0.3);
  background: rgba(0, 180, 216, 0.04);
}

#ingredient-list {
  list-style: none;
}

#ingredient-list li {
  padding: 0.4rem 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  font-size: 1.05rem;
}

#ingredient-list li:last-child {
  border-bottom: none;
}

.ingredient-qty {
  color: #FF6B35;
  font-weight: bold;
}

/* === STEP PREPARAZIONE === */
.steps {
  margin-bottom: 2.5rem;
}

#steps-list {
  list-style: none;
  counter-reset: step-counter;
}

#steps-list li {
  counter-increment: step-counter;
  padding: 0.8rem 0 0.8rem 2.5rem;
  position: relative;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  cursor: pointer;
  transition: background 0.2s;
}

#steps-list li:hover {
  background: rgba(255, 255, 255, 0.02);
}

#steps-list li::before {
  content: counter(step-counter);
  position: absolute;
  left: 0;
  top: 0.8rem;
  width: 1.6rem;
  height: 1.6rem;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: 'Anta', sans-serif;
  font-size: 0.8rem;
  border: 1px solid #FF1493;
  color: #FF1493;
}

#steps-list li.done {
  text-decoration: line-through;
  opacity: 0.5;
}

#steps-list li.done::before {
  background: #FF1493;
  color: #0d0b1a;
  content: '✓';
  border-color: #FF1493;
}

/* === CONDIVISIONE === */
.share {
  text-align: center;
  margin-bottom: 2rem;
}

#share-btn {
  font-family: 'Anta', sans-serif;
  background: transparent;
  color: #00B4D8;
  border: 2px solid #00B4D8;
  padding: 0.7rem 2rem;
  font-size: 1rem;
  cursor: pointer;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  transition: all 0.2s;
}

#share-btn:hover {
  background: #00B4D8;
  color: #0d0b1a;
  box-shadow: 0 0 16px rgba(0, 180, 216, 0.5);
}

#share-feedback {
  display: inline-block;
  margin-left: 0.75rem;
  color: #FF6B35;
  font-size: 0.9rem;
  opacity: 0;
  transition: opacity 0.3s;
}

#share-feedback.visible {
  opacity: 1;
}

.hidden {
  display: none;
}

/* === FOOTER === */
footer {
  position: relative;
  z-index: 1;
  text-align: center;
  padding: 1.5rem;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
  width: 100%;
  max-width: 720px;
  font-size: 0.85rem;
  color: #666;
}
```

- [ ] **Step 2: Verificare apertura in browser**

Aprire `index.html`. La pagina dovrebbe mostrare lo sfondo scuro con texture grain, titolo con gradiente arancione/rosa, header, sezione porzioni, e sezioni vuote per ingredienti/steps.

---

### Task 3: JavaScript — Dati e Lingua

**File:** Modify `script.js` (creato in questo task)

- [ ] **Step 1: Scrivere i dati della ricetta e la logica lingua**

```javascript
// === DATA ===
const BASE_PORTIONS = 8;

const ingredients = [
  { name: { it: 'Mascarpone', en: 'Mascarpone' }, qty: 1000, unit: 'g' },
  { name: { it: 'Uova', en: 'Eggs' }, qty: 8, unit: '' },
  { name: { it: 'Savoiardi', en: 'Ladyfingers' }, qty: 350, unit: 'g' },
  { name: { it: 'Zucchero', en: 'Sugar' }, qty: 200, unit: 'g' },
  { name: { it: 'Caffè', en: 'Coffee' }, qty: 200, unit: 'g' },
  { name: { it: 'Cacao amaro', en: 'Dark cocoa powder' }, qty: null, unit: 'q.b.' }
];

const steps = [
  {
    it: 'Preparare il caffè. Prendere la moka, svitarla e togliere il filtro. Riempire il contenitore dell\'acqua fino alla valvola, chiudere con il filtro e riempirlo di caffè in polvere formando una montagnetta. Riavvitare la moka e posizionarla sul piano cottura. Accendere il gas e attendere che il caffè esca dal canale di uscita e la parte superiore si riempia. Spegnere il gas, versare il caffè in una ciotola di vetro larga e bassa e lasciarlo raffreddare.',
    en: 'Prepare the coffee. Take the moka pot, unscrew it and remove the filter. Fill the water chamber up to the valve, close with the filter and fill it with coffee powder forming a small mound. Screw the moka back on and place it on the stove. Turn on the gas and wait for the coffee to come out of the outlet channel and fill the top chamber. Turn off the gas, pour the coffee into a wide, low glass bowl and let it cool.'
  },
  {
    it: 'Preparare la crema. In una ciotola di vetro, separare i tuorli dagli albumi. Aggiungere 100 g di zucchero ai tuorli e montare con una frusta elettrica fino a ottenere una consistenza liscia e giallina. Aggiungere il mascarpone con una marisa e montare ancora per 1 minuto.',
    en: 'Prepare the cream. In a glass bowl, separate the yolks from the whites. Add 100 g of sugar to the yolks and whip with an electric mixer until smooth and pale yellow. Add the mascarpone with a spatula and mix for another minute.'
  },
  {
    it: 'Montare gli albumi. Montare gli albumi con la frusta elettrica finché non diventano bianco neve e voluminosi.',
    en: 'Whip the egg whites. Whip the egg whites with an electric mixer until they become snow-white and voluminous.'
  },
  {
    it: 'Unire. Aggiungere gli albumi montati alla crema di uova e mascarpone e amalgamare delicatamente.',
    en: 'Combine. Add the whipped egg whites to the egg and mascarpone cream and fold gently.'
  },
  {
    it: 'Comporre il tiramisù. Prendere una pirofila rettangolare e spalmare un cucchiaio di crema sul fondo. Aggiungere lo zucchero rimasto al caffè e mescolare. Inzuppare i savoiardi nel caffè uno alla volta e disporli nella pirofila, coprendo tutta la superficie. Coprire con uno strato di crema. Spolverare con cacao amaro usando un colino.',
    en: 'Assemble the tiramisù. Take a rectangular baking dish and spread a spoonful of cream on the bottom. Add the remaining sugar to the coffee and stir. Dip the ladyfingers in the coffee one at a time and arrange them in the dish, covering the entire surface. Cover with a layer of cream. Dust with bitter cocoa using a strainer.'
  },
  {
    it: 'Riposo in frigorifero. Coprire la pirofila con pellicola trasparente senza toccare il tiramisù e lasciare riposare in frigorifero per una notte.',
    en: 'Rest in the refrigerator. Cover the dish with plastic wrap without touching the tiramisù and let it rest in the refrigerator overnight.'
  },
  {
    it: 'Servire. Il giorno dopo è pronto per essere mangiato.',
    en: 'Serve. The next day it is ready to be eaten.'
  }
];

// === LANGUAGE ===
let currentLang = 'it';

function setLang(lang) {
  currentLang = lang;
  document.querySelectorAll('[data-it]').forEach(el => {
    const text = el.getAttribute('data-' + lang);
    if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
      el.placeholder = text;
    } else {
      el.textContent = text;
    }
  });
  renderIngredients();
  renderSteps();
}

document.querySelectorAll('.lang-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.lang-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    setLang(btn.dataset.lang);
  });
});
```

- [ ] **Step 2: Aprire nel browser e testare cambio lingua**

Aprire `index.html`. Cliccare IT/EN. Il titolo, le label e le sezioni dovrebbero cambiare lingua (ingredienti/steps ancora vuoti).

---

### Task 4: JavaScript — Porzioni e Ingredienti

**File:** Modify `script.js`

- [ ] **Step 1: Aggiungere logica porzioni e render ingredienti**

Aggiungere dopo il blocco lingua:

```javascript
// === PORTIONS ===
let currentPortions = BASE_PORTIONS;

function renderIngredients() {
  const list = document.getElementById('ingredient-list');
  list.innerHTML = '';
  ingredients.forEach(ing => {
    const li = document.createElement('li');
    if (ing.qty === null) {
      li.innerHTML = `<span class="ingredient-name">${ing.name[currentLang]}</span> <span class="ingredient-qty">${ing.unit}</span>`;
    } else {
      const scaled = Math.round((ing.qty / BASE_PORTIONS) * currentPortions * 10) / 10;
      li.innerHTML = `<span class="ingredient-qty">${scaled}${ing.unit}</span> <span class="ingredient-name">${ing.name[currentLang]}</span>`;
    }
    list.appendChild(li);
  });
}

const portionSelect = document.getElementById('portion-select');
const portionCustom = document.getElementById('portion-custom');

portionSelect.addEventListener('change', () => {
  if (portionSelect.value === 'custom') {
    portionCustom.style.display = 'inline-block';
    portionCustom.focus();
  } else {
    portionCustom.style.display = 'none';
    currentPortions = parseInt(portionSelect.value);
    renderIngredients();
  }
});

portionCustom.addEventListener('input', () => {
  const val = parseInt(portionCustom.value);
  if (val > 0) {
    currentPortions = val;
    renderIngredients();
  }
});

// Init
renderIngredients();
```

- [ ] **Step 2: Testare il selettore porzioni**

Aprire `index.html`. Cambiare il numero di porzioni — le quantità degli ingredienti dovrebbero scalare. Selezionare "Personalizzato" e scrivere un numero manualmente.

---

### Task 5: JavaScript — Step Checkbox e Condivisione

**File:** Modify `script.js`

- [ ] **Step 1: Aggiungere render steps e logica checkbox + share**

Aggiungere dopo il blocco porzioni:

```javascript
// === STEPS ===
function renderSteps() {
  const list = document.getElementById('steps-list');
  list.innerHTML = '';
  steps.forEach((step, i) => {
    const li = document.createElement('li');
    li.textContent = step[currentLang];
    li.dataset.index = i;
    li.addEventListener('click', () => {
      li.classList.toggle('done');
    });
    list.appendChild(li);
  });
}

renderSteps();

// === SHARE ===
document.getElementById('share-btn').addEventListener('click', () => {
  navigator.clipboard.writeText(window.location.href).then(() => {
    const feedback = document.getElementById('share-feedback');
    feedback.classList.remove('hidden');
    feedback.classList.add('visible');
    setTimeout(() => {
      feedback.classList.remove('visible');
      setTimeout(() => feedback.classList.add('hidden'), 300);
    }, 2000);
  });
});
```

- [ ] **Step 2: Test completo**

Aprire `index.html`. Verificare:
- Cambio lingua IT/EN funziona per tutti i testi
- Porzioni scalano ingredienti
- Click sugli step li spunta/barrati
- Click "Copia link" mostra feedback
- Custom portion input funziona

---

### Task 6: Test di regressione manuale

- [ ] **Step 1: Verifica completa nel browser**

Aprire `index.html` e testare:
1. La pagina si carica con lo stile retro-futuristico (sfondo scuro, grain texture, gradienti)
2. Titolo e chef sono visibili
3. Porzioni: selezionare 4 → ingredienti si dimezzano. Selezionare 12 → raddoppiano. Custom: inserire 3 → si scalano correttamente.
4. Cambiare lingua da IT a EN e tornare a IT — tutto si traduce correttamente
5. Click su ogni step — si barrano. Ricliccare — si ripristinano.
6. Click "Copia link" — appare "Link copiato!" che scompare dopo 2 secondi
7. Footer visibile con crediti

- [ ] **Step 2: Correggere eventuali bug**

Se qualcosa non funziona, correggere il problema nel file pertinente e ritestare.
