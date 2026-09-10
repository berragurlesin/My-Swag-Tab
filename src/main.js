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

    if (titleEl) titleEl.textContent = data.title;
    if (expEl) expEl.textContent = data.explanation;

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
    console.error('NASA API Error:', error);
    const titleEl = document.getElementById('nasa-title');
    if (titleEl) {
      titleEl.textContent = 'Image couldn\'t be loaded :(';
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
    a.rel = 'noopener noreferrer';
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

const INIT_STICKER_1_X = 450;
const INIT_STICKER_1_Y = 280;

const INIT_STICKER_2_X = 1346;
const INIT_STICKER_2_Y = 600;

const INIT_STICKER_3_X = 253;
const INIT_STICKER_3_Y = 305;

const INIT_STICKER_4_X = 1160;
const INIT_STICKER_4_Y = 28;

const INIT_STICKER_6_X = 953;
const INIT_STICKER_6_Y = 246;

const INIT_STICKER_7_X = 1241;
const INIT_STICKER_7_Y = 184;

const INIT_STICKER_8_X = 1280;
const INIT_STICKER_8_Y = 66;

let activeStickers = JSON.parse(localStorage.getItem('saved_stickers'));

if (!activeStickers || !Array.isArray(activeStickers) || activeStickers.length === 0) {
  activeStickers = [
    { 
      id: 'default-1', 
      src: `${basePath}starsticker.png`, 
      x: INIT_STICKER_1_X, 
      y: INIT_STICKER_1_Y, 
      size: 100,
      isDefault: true,
      canBeDeleted: false
    },
    { 
      id: 'default-2', 
      src: `${basePath}lesticker.png`, 
      x: INIT_STICKER_2_X, 
      y: INIT_STICKER_2_Y, 
      size: 100,
      isDefault: true,
      canBeDeleted: false
    },
    { 
      id: 'default-3', 
      src: `${basePath}coolsticker.png`, 
      x: INIT_STICKER_3_X, 
      y: INIT_STICKER_3_Y, 
      size: 200,
      isDefault: true,
      canBeDeleted: true
    },
    { 
      id: 'default-4', 
      src: `${basePath}flowersticker.png`, 
      x: INIT_STICKER_4_X, 
      y: INIT_STICKER_4_Y, 
      size: 200,
      isDefault: true,
      canBeDeleted: true
    },
    { 
      id: 'default-6', 
      src: `${basePath}musticker.png`, 
      x: INIT_STICKER_6_X, 
      y: INIT_STICKER_6_Y, 
      size: 80,
      isDefault: true,
      canBeDeleted: true
    },
    { 
      id: 'default-7', 
      src: `${basePath}sharksticker.png`, 
      x: INIT_STICKER_7_X, 
      y: INIT_STICKER_7_Y, 
      size: 200,
      isDefault: true,
      canBeDeleted: true
    },
    { 
      id: 'default-8', 
      src: `${basePath}spidersticker.png`, 
      x: INIT_STICKER_8_X, 
      y: INIT_STICKER_8_Y, 
      size: 200,
      isDefault: true,
      canBeDeleted: true
    }
  ];
}

const stickerContainer = document.getElementById('stickers-container');
const stickerPreviewGrid = document.getElementById('sticker-list-preview');
const stickerFileInput = document.getElementById('sticker-file-input');

function renderStickers() {
  if (!stickerContainer || !stickerPreviewGrid) return;
  
  stickerContainer.innerHTML = '';
  stickerPreviewGrid.innerHTML = '';

  activeStickers.forEach((sticker) => {
  
    const img = document.createElement('img');
    img.src = sticker.src;
    img.className = 'draggable-sticker';
    img.style.left = `${sticker.x}px`;
    img.style.top = `${sticker.y}px`;
  if (!sticker.size) sticker.size = 100;
    img.style.width = `${sticker.size}px`;
    img.style.height = 'auto';
    img.dataset.id = sticker.id;

    makeStickerDraggable(img, sticker);
    stickerContainer.appendChild(img);

    const previewItem = document.createElement('div');
    previewItem.className = 'sticker-preview-item';

    const previewImg = document.createElement('img');
    previewImg.src = sticker.src;
    previewImg.alt = 'Sticker preview';
    previewItem.appendChild(previewImg);

    if (!sticker.isDefault || sticker.canBeDeleted) {
      const delBtn = document.createElement('button');
      delBtn.className = 'delete-sticker-btn';
      delBtn.innerText = '×';
      delBtn.onclick = () => removeSticker(sticker.id);
      previewItem.appendChild(delBtn);
    }

    stickerPreviewGrid.appendChild(previewItem);
  });

  saveStickersToStorage();
}

function makeStickerDraggable(element, stickerData) {
  let isDragging = false;
  let startX = 0;
  let startY = 0;
  let initialLeft = 0;
  let initialTop = 0;

  const onPointerDown = (e) => {
    isDragging = true;
    startX = e.clientX;
    startY = e.clientY;
    initialLeft = element.offsetLeft;
    initialTop = element.offsetTop;

    element.setPointerCapture(e.pointerId);
    element.addEventListener('pointermove', onPointerMove);
    element.addEventListener('pointerup', onPointerUp);
  };

  const onPointerMove = (e) => {
    if (!isDragging) return;
    const dx = e.clientX - startX;
    const dy = e.clientY - startY;

    const newX = initialLeft + dx;
    const newY = initialTop + dy;

    element.style.left = `${newX}px`;
    element.style.top = `${newY}px`;

    stickerData.x = newX;
    stickerData.y = newY;
  };

  const onPointerUp = (e) => {
    if (!isDragging) return;
    isDragging = false;
    element.releasePointerCapture(e.pointerId);
    element.removeEventListener('pointermove', onPointerMove);
    element.removeEventListener('pointerup', onPointerUp);
    saveStickersToStorage();
  };

  element.addEventListener('pointerdown', onPointerDown);
}

if (stickerFileInput) {
  stickerFileInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const newSticker = {
        id: 'sticker-' + Date.now(),
        src: event.target.result,
        x: Math.max(20, Math.floor(window.innerWidth / 2 - 45)),
        y: Math.max(20, Math.floor(window.innerHeight / 2 - 45)),
        size: 100,
        isDefault: false,
        canBeDeleted: true
      };

      activeStickers.push(newSticker);
      renderStickers();
    };
    reader.readAsDataURL(file);
  });
}

function removeSticker(id) {
  activeStickers = activeStickers.filter(s => s.id !== id);
  renderStickers();
}

function saveStickersToStorage() {
  localStorage.setItem('saved_stickers', JSON.stringify(activeStickers));
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', renderStickers);
} else {
  renderStickers(); }

const userNameInput = document.getElementById('user-name-input');

if (userNameInput) {
  const savedName = localStorage.getItem('mynameis');
  if (savedName) {
    userNameInput.value = savedName;
  }

  userNameInput.addEventListener('input', (e) => {
    localStorage.setItem('mynameis', e.target.value);
  });
}