const STORAGE_CHECKLIST_KEY = 'tiramisu-checklist';
const STORAGE_SERVINGS_KEY = 'tiramisu-porzioni';
const BASE_SERVINGS = 6;

const ingredients = document.querySelectorAll('#ingredients-list li[data-base]');
const slider = document.getElementById('servings-slider');
const servingsDisplay = document.getElementById('servings-display');
const checkboxes = document.querySelectorAll('.step-checkbox');
const resetBtn = document.getElementById('reset-checklist');

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
    }
}

function saveServings() {
    localStorage.setItem(STORAGE_SERVINGS_KEY, slider.value);
}

slider.addEventListener('change', saveServings);

loadServings();
updateQuantities();
loadChecklist();
