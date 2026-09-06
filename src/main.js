import './style.css';

const basePath = import.meta.env.BASE_URL;

const h1 = document.getElementById('h1');
const h2 = document.getElementById('h2');
const m1 = document.getElementById('m1');
const m2 = document.getElementById('m2');
const s1 = document.getElementById('s1');
const s2 = document.getElementById('s2');

const colons = document.querySelectorAll('.colon');
colons.forEach(colon => {
  colon.src = `${basePath}digits/Colon.png`;
});

function updateClock() {
  const now = new Date();
  
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');

  if (h1 && h2 && m1 && m2 && s1 && s2) {
    h1.src = `${basePath}digits/${hours[0]}.png`;
    h2.src = `${basePath}digits/${hours[1]}.png`;
    
    m1.src = `${basePath}digits/${minutes[0]}.png`;
    m2.src = `${basePath}digits/${minutes[1]}.png`;
    
    s1.src = `${basePath}digits/${seconds[0]}.png`;
    s2.src = `${basePath}digits/${seconds[1]}.png`;
  }
}

updateClock();
setInterval(updateClock, 1000);

// NASA API Ayarları
const NASA_API_KEY = import.meta.env.VITE_NASA_API_KEY || 'DEMO_KEY';
const APOD_URL = `https://api.nasa.gov/planetary/apod?api_key=${NASA_API_KEY}`;

async function fetchNASAImage() {
  try {
    const response = await fetch(APOD_URL);
    if (!response.ok) throw new Error(`Couldn't be loaded:(`);
    
    const data = await response.json();
    
    const titleEl = document.getElementById('nasa-title');
    const imageEl = document.getElementById('nasa-image');
    const expEl = document.getElementById('nasa-explanation');

    if (titleEl) {
      titleEl.textContent = data.title;
    }
    if (expEl) {
      expEl.textContent = data.explanation;
    }

    if (data.media_type === 'image' && imageEl) {
      imageEl.src = data.hdurl || data.url;
      imageEl.style.display = 'block';
    } else if (data.media_type === 'video') {
      const container = document.getElementById('nasa-media-container');
      if (container) {
        container.innerHTML = `<iframe src="${data.url}" frameborder="0" allowfullscreen style="width:100%; height:300px; border-radius:12px; border: 2px solid #000;"></iframe>`;
      }
    }
  } catch (error) {
    console.error('ERROR', error);
    const titleEl = document.getElementById('nasa-title');
    if (titleEl) {
      titleEl.textContent = 'Image couldn\'t be loaded:(';
    }
  }
}

fetchNASAImage();

let myApps = JSON.parse(localStorage.getItem('my_y2k_apps')) || [
  { name: 'GitHub', url: 'https://github.com' },
  { name: 'YouTube', url: 'https://youtube.com' },
  { name: 'Stardance Challenge', url: 'https://stardance.hackclub.com/home' }
];

const gridEl = document.querySelector('#shortcuts-grid');
const modalEl = document.querySelector('#app-modal');
const closeBtn = document.querySelector('#close-modal-btn');
const saveBtn = document.querySelector('#save-app-btn');
const nameInput = document.querySelector('#app-name-input');
const urlInput = document.querySelector('#app-url-input');

function renderApps() {
  if (!gridEl) return;
  gridEl.innerHTML = '';

  myApps.forEach((app, index) => {
    const wrapper = document.createElement('div');
    wrapper.className = 'shortcut-item';

    const a = document.createElement('a');
    a.href = app.url;
    a.className = 'app-icon';
    a.target = '_blank';
    a.title = app.name;

    const img = document.createElement('img');
    try {
      const domain = new URL(app.url).hostname;
      img.src = `https://www.google.com/s2/favicons?domain=${domain}&sz=64`;
    } catch (e) {
      img.src = `https://www.google.com/s2/favicons?domain=${app.url}&sz=64`;
    }
    img.alt = app.name;

    a.appendChild(img);
    wrapper.appendChild(a);

    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'delete-shortcut-btn';
    deleteBtn.textContent = '×';
    deleteBtn.title = 'Remove shortcut';

    deleteBtn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();

      myApps.splice(index, 1);
      localStorage.setItem('my_y2k_apps', JSON.stringify(myApps));

      renderApps();
    });

    wrapper.appendChild(deleteBtn);
    gridEl.appendChild(wrapper);
  });
  
  const addBtn = document.createElement('button');
  addBtn.className = 'add-box-btn';
  addBtn.textContent = '+';
  addBtn.title = 'Add New Shortcut';
  addBtn.addEventListener('click', () => modalEl.classList.remove('hidden'));
  
  gridEl.appendChild(addBtn);
}

renderApps();

if (closeBtn) {
  closeBtn.addEventListener('click', () => modalEl.classList.add('hidden'));
}

if (saveBtn) {
  saveBtn.addEventListener('click', () => {
    const name = nameInput.value.trim();
    let url = urlInput.value.trim();

    if (name && url) {
      if (!url.startsWith('http://') && !url.startsWith('https://')) {
        url = 'https://' + url;
      }

      myApps.push({ name, url });
      localStorage.setItem('my_y2k_apps', JSON.stringify(myApps));
      
      renderApps();
      nameInput.value = '';
      urlInput.value = '';
      modalEl.classList.add('hidden');
    }
  });
} 

const settingsBtn = document.getElementById('settings-toggle-btn');
const settingsModal = document.getElementById('settings-modal');
const closeSettingsBtn = document.getElementById('close-settings-btn');
const saveSettingsBtn = document.getElementById('save-settings-btn');
const bgFileInput = document.getElementById('bg-file-input');
const bgOptions = document.querySelectorAll('.bg-option');

let selectedBg = localStorage.getItem('my_y2k_bg') || 'default';

if (settingsBtn && settingsModal) {
  settingsBtn.addEventListener('click', () => {
    selectedBg = localStorage.getItem('my_y2k_bg') || 'default';
    updateOptionActiveState();
    settingsModal.classList.remove('hidden');
  });
}

if (closeSettingsBtn && settingsModal) {
  closeSettingsBtn.addEventListener('click', () => {
    settingsModal.classList.add('hidden');
  });
}

if (saveSettingsBtn && settingsModal) {
  saveSettingsBtn.addEventListener('click', () => {
    localStorage.setItem('my_y2k_bg', selectedBg);
    applySavedBackground();
    settingsModal.classList.add('hidden');
  });
}

function applySavedBackground() {
  const savedBg = localStorage.getItem('my_y2k_bg');
  if (!savedBg) return;

  if (savedBg === 'default') {
    document.body.style.backgroundImage = 'none';
    document.body.style.backgroundColor = '#2554EB';
  } 
  else if (savedBg.startsWith('#')) {
    document.body.style.backgroundImage = 'none';
    document.body.style.backgroundColor = savedBg;
  } 
  else if (savedBg.startsWith('data:image') || savedBg.startsWith('http') || savedBg.startsWith('/')) {
    document.body.style.backgroundImage = `url('${savedBg}')`;
    document.body.style.backgroundSize = 'cover';
    document.body.style.backgroundPosition = 'center';
    document.body.style.backgroundAttachment = 'fixed';
  }
}

function updateOptionActiveState() {
  bgOptions.forEach(btn => {
    if (btn.getAttribute('data-bg') === selectedBg) {
      btn.classList.add('selected');
    } else {
      btn.classList.remove('selected');
    }
  });
}

bgOptions.forEach(btn => {
  btn.addEventListener('click', () => {
    selectedBg = btn.getAttribute('data-bg');
    updateOptionActiveState();
  });
});

if (bgFileInput) {
  bgFileInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = function(event) {
        selectedBg = event.target.result;
        updateOptionActiveState();
      };
      reader.readAsDataURL(file);
    }
  });
}

applySavedBackground();
