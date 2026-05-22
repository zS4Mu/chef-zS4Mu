const projects = [
  {
    id: 'hands',
    title: 'Hands',
    path: 'progetto hands/index.html',
    thumb: 'assets/thumbnails/hands.jpg',
  },
  {
    id: 'pattern',
    title: 'Pattern',
    path: 'progetto pattern/index.html',
    thumb: 'assets/thumbnails/pattern.jpg',
  },
  {
    id: 'tiramisu',
    title: 'Ricetta Tiramisù',
    path: 'progetto ricetta tiramisù/codebase/index.html',
    thumb: 'assets/thumbnails/tiramisu.jpg',
  },
  {
    id: 'sound',
    title: 'Sound Responsive',
    path: 'progetto sound responsive/index.html',
    thumb: 'assets/thumbnails/sound-responsive.jpg',
  },
  {
    id: 'progetto5',
    title: 'Nuovo Progetto',
    path: '',
    thumb: '',
  },
  {
    id: 'progetto6',
    title: 'Nuovo Progetto',
    path: '',
    thumb: '',
  },
  {
    id: 'progetto7',
    title: 'Nuovo Progetto',
    path: '',
    thumb: '',
  },
];

const home = document.getElementById('home');
const projectView = document.getElementById('project-view');
const projectTitle = document.getElementById('project-title');
const projectContent = document.getElementById('project-content');
const mosaicGrid = document.getElementById('mosaic-grid');
const btnBack = document.getElementById('btn-back');
const btnTop = document.getElementById('btn-top');

let hoveredIndex = null;
let currentProject = null;

const rowGroups = [
  [0, 1],
  [2, 3],
  [4],
  [5, 6],
];

const defaultSizes = [
  { flex: 2, height: 600 },
  { flex: 1, height: 600 },
  { flex: 1, height: 300 },
  { flex: 2, height: 600 },
  { flex: 1, height: 200 },
  { flex: 1, height: 400 },
  { flex: 1, height: 700 },
];


function createItemEl(p, itemIndex) {
  const item = document.createElement('div');
  item.className = 'mosaic-item';
  item.dataset.index = itemIndex;
  item.style.flex = defaultSizes[itemIndex].flex;
  item.style.height = defaultSizes[itemIndex].height + 'px';

  item.addEventListener('mouseenter', () => onItemHover(itemIndex));
  item.addEventListener('mouseleave', onItemLeave);
  item.addEventListener('click', () => openProject(itemIndex));

  if (p.thumb) {
    const img = new Image();
    img.onload = () => {
      item.innerHTML = '';
      item.appendChild(img);
      const label = document.createElement('div');
      label.className = 'mosaic-label';
      label.textContent = p.title;
      item.appendChild(label);
    };
    img.onerror = () => {
      item.innerHTML = '';
      const ph = document.createElement('div');
      ph.className = 'placeholder';
      ph.textContent = p.title;
      item.appendChild(ph);
    };
    img.src = p.thumb;
    img.alt = p.title;
  } else {
    const ph = document.createElement('div');
    ph.className = 'placeholder';
    ph.textContent = p.title;
    item.appendChild(ph);
  }

  return item;
}

function onItemHover(index) {
  hoveredIndex = index;
  const rowIdx = rowGroups.findIndex(row => row.includes(index));
  const row = rowGroups[rowIdx];
  const rowDiv = mosaicGrid.children[rowIdx];
  const items = rowDiv.children;

  for (let i = 0; i < row.length; i++) {
    const itemIdx = row[i];
    if (itemIdx === index) {
      items[i].style.flex = 2;
      items[i].style.height = Math.round(defaultSizes[itemIdx].height * 1.5) + 'px';
    } else {
      items[i].style.flex = 1;
      items[i].style.height = Math.round(defaultSizes[itemIdx].height * 0.75) + 'px';
    }
  }
}

function onItemLeave() {
  if (hoveredIndex === null) return;
  const prevRowIdx = rowGroups.findIndex(row => row.includes(hoveredIndex));
  const prevRow = rowGroups[prevRowIdx];
  const prevRowDiv = mosaicGrid.children[prevRowIdx];
  const prevItems = prevRowDiv.children;

  for (let i = 0; i < prevRow.length; i++) {
    const itemIdx = prevRow[i];
    prevItems[i].style.flex = defaultSizes[itemIdx].flex;
    prevItems[i].style.height = defaultSizes[itemIdx].height + 'px';
  }

  hoveredIndex = null;
}

function renderMosaic() {
  mosaicGrid.innerHTML = '';
  rowGroups.forEach(row => {
    const rowDiv = document.createElement('div');
    rowDiv.className = 'mosaic-row';

    let maxH = 0;
    const items = [];
    row.forEach(itemIndex => {
      const el = createItemEl(projects[itemIndex], itemIndex);
      rowDiv.appendChild(el);
      items.push(el);
      maxH = Math.max(maxH, defaultSizes[itemIndex].height);
    });
    const totalFlex = row.reduce((s, i) => s + defaultSizes[i].flex, 0);
    let leftPct = 0;
    row.forEach((itemIndex, i) => {
      const wPct = (defaultSizes[itemIndex].flex / totalFlex) * 100;
      const gapH = maxH - defaultSizes[itemIndex].height;
      if (gapH > 0) {
        const gt = document.createElement('div');
        gt.className = 'row-gap-text';
        gt.style.left = leftPct + '%';
        gt.style.width = wPct + '%';
        gt.style.height = gapH + 'px';
        const h2 = document.createElement('h2');
        const p = document.createElement('p');
        if (itemIndex === 2) {
          h2.textContent = 'HELLO!';
          p.textContent = "Mi chiamo Samuele, ho 22 anni e sono un progettista grafico cresciuto sulle pendici dell'Etna, a Zafferana Etnea. Guardo il mondo come un curioso detective: alleno il senso critico, metto alla prova il mio giudizio e cerco quello che gli altri non vedono ancora. È da questa tensione verso l'osservazione che nasce il mio approccio al design. Mi muovo a mio agio tra il minimal e lo sperimentale. Costruisco la mia indipendenza pixel per pixel.";
        } else if (itemIndex === 5) {
          h2.textContent = 'No brain, No Gain';
          p.textContent = "Workshop di whateverDev (Andrea Maffei & Rocco Lorenzo Modugno), 18-22 Maggio 2026 — Interaction Design 2 (Prof. Alessia Scudieri) & Interaction Design 3 (Prof. Marcantonio D'Antoni, Prof. Andrea Leonardi) — ABADIR, Accademia di Design e Comunicazione Visiva, Sant'Agata li Battiati CT, AA 2025-26.";
        }
        gt.appendChild(h2);
        gt.appendChild(p);
        rowDiv.appendChild(gt);
      }
      leftPct += wPct;
    });

    mosaicGrid.appendChild(rowDiv);
  });
}


function showProject(index) {
  const p = projects[index];
  currentProject = index;
  projectTitle.textContent = p.title;

  projectContent.innerHTML = '';
  if (p.path) {
    const iframe = document.createElement('iframe');
    iframe.src = p.path;
    iframe.title = p.title;
    iframe.setAttribute('allow', 'camera *; microphone *');
    projectContent.appendChild(iframe);
  } else {
    projectContent.innerHTML = '<p style="padding:2rem;font-size:1.7rem;color:#999;">Progetto in arrivo...</p>';
  }

  home.classList.add('hidden');
  projectView.classList.remove('hidden');
  projectView.scrollIntoView({ behavior: 'instant' });
}

function openProject(index) {
  showProject(index);
  history.pushState({ view: 'project', index: index }, '');
}

function closeProject() {
  history.back();
}

btnBack.addEventListener('click', closeProject);

window.addEventListener('popstate', function (e) {
  if (e.state && e.state.view === 'project') {
    showProject(e.state.index);
  } else {
    projectView.classList.add('hidden');
    home.classList.remove('hidden');
    window.scrollTo({ top: 0, behavior: 'instant' });
    currentProject = null;
  }
});

btnTop.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

function initHeroAnimation() {
  var cellsG = document.getElementById('cells');
  if (!cellsG) return;
  var items = Array.from(cellsG.querySelectorAll('path')).map(function(p) {
    var bb = p.getBBox();
    var cx = bb.x + bb.width / 2;
    var cy = bb.y + bb.height / 2;
    var g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    p.parentNode.insertBefore(g, p);
    g.appendChild(p);
    return { g: g, cx: cx, cy: cy, phase: Math.random() * Math.PI * 2 };
  });
  var p = [];
  for (var i = 0; i < 256; i++) p[i] = i;
  for (var i = 255; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1));
    var tmp = p[i]; p[i] = p[j]; p[j] = tmp;
  }
  var perm = p.concat(p);
  function fade(t) { return t * t * t * (t * (t * 6 - 15) + 10); }
  function lerp(t, a, b) { return a + t * (b - a); }
  function grad(h, x) { return (h & 1) ? -x : x; }
  function noise1D(x) {
    var xi = Math.floor(x) & 255;
    var xf = x - Math.floor(x);
    var u = fade(xf);
    return lerp(u, grad(perm[xi], xf), grad(perm[xi + 1], xf - 1));
  }
  var startTime = null;
  function animate(time) {
    if (!startTime) startTime = time;
    var elapsed = (time - startTime) / 1000;
    for (var i = 0; i < items.length; i++) {
      var it = items[i];
      var n = noise1D(elapsed * 0.8 + it.phase * 10);
      var s = 1 + 0.3 * n;
      it.g.setAttribute('transform',
        'translate(' + it.cx + ',' + it.cy + ') scale(' + s + ') translate(' + (-it.cx) + ',' + (-it.cy) + ')');
    }
    requestAnimationFrame(animate);
  }
  requestAnimationFrame(animate);
}

renderMosaic();
initHeroAnimation();
