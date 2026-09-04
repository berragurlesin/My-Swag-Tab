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


const NASA_API_KEY = 'm0LmROXySEE7cHB0zwmssIxVPyUauHCXJLID6MMF'; 
const APOD_URL = `https://api.nasa.gov/planetary/apod?api_key=${NASA_API_KEY}`;

async function fetchNASAImage() {
  try {
    const response = await fetch(APOD_URL);
    if (!response.ok) throw new Error(`HTTP ERROR: ${response.status}`);
    
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
    console.error('ERROR', error);
    const titleEl = document.getElementById('nasa-title');
    if (titleEl) titleEl.textContent = 'Image couldn\'t be loaded:(';
  }
}

fetchNASAImage();
