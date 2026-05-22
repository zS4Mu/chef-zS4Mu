const BASE_PORTIONS = 8;
let currentLang = 'it';
let currentPortions = BASE_PORTIONS;

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
  updateStepTexts();
}

document.querySelectorAll('.lang-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.lang-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    setLang(btn.dataset.lang);
  });
});

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

function updateStepTexts() {
  const list = document.getElementById('steps-list');
  list.querySelectorAll('li').forEach((li, i) => {
    li.textContent = steps[i][currentLang];
  });
}

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

renderIngredients();
