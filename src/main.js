import './style.css';

function updateClock() {
  const now = new Date();
  
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');

  const basePath = import.meta.env.BASE_URL;

  const colons = document.querySelectorAll('.colon');
  colons.forEach(colon => {
    colon.src = `${basePath}digits/Colon.png`;
  });

  const h1 = document.getElementById('h1');
  const h2 = document.getElementById('h2');
  const m1 = document.getElementById('m1');
  const m2 = document.getElementById('m2');
  const s1 = document.getElementById('s1');
  const s2 = document.getElementById('s2');

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
<<<<<<< HEAD
setInterval(updateClock, 1000);
=======
setInterval(updateClock, 1000);
>>>>>>> 447cfc1dbe6974ea14fabd8def906cb171e6b2ac
