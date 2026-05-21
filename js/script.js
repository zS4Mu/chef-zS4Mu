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
];

const home = document.getElementById('home');
const projectView = document.getElementById('project-view');
const projectTitle = document.getElementById('project-title');
const projectContent = document.getElementById('project-content');
const mosaicGrid = document.getElementById('mosaic-grid');
const btnBack = document.getElementById('btn-back');
const btnTop = document.getElementById('btn-top');

let currentProject = null;

function renderMosaic() {
  projects.forEach((p, i) => {
    const item = document.createElement('div');
    item.className = 'mosaic-item';
    item.dataset.index = i;

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
      const placeholder = document.createElement('div');
      placeholder.className = 'placeholder';
      placeholder.textContent = p.title;
      item.appendChild(placeholder);
    };
    img.src = p.thumb;
    img.alt = p.title;

    item.addEventListener('click', () => openProject(i));
    mosaicGrid.appendChild(item);
  });
}

function openProject(index) {
  const p = projects[index];
  currentProject = index;
  projectTitle.textContent = p.title;

  projectContent.innerHTML = '';
  const iframe = document.createElement('iframe');
  iframe.src = p.path;
  iframe.title = p.title;
  iframe.setAttribute('allow', 'camera *; microphone *');
  projectContent.appendChild(iframe);

  home.classList.add('hidden');
  projectView.classList.remove('hidden');
  projectView.scrollIntoView({ behavior: 'instant' });
}

function closeProject() {
  projectView.classList.add('hidden');
  home.classList.remove('hidden');
  window.scrollTo({ top: 0, behavior: 'instant' });
}

btnBack.addEventListener('click', closeProject);

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
      var n = noise1D(elapsed * 0.3 + it.phase * 10);
      var s = 1 + 0.12 * n;
      it.g.setAttribute('transform',
        'translate(' + it.cx + ',' + it.cy + ') scale(' + s + ') translate(' + (-it.cx) + ',' + (-it.cy) + ')');
    }
    requestAnimationFrame(animate);
  }
  requestAnimationFrame(animate);
}

renderMosaic();
initHeroAnimation();
