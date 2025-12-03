// — — — Datos base de películas (1 a 24) — — —
const movieList = {
  1: "Last Christmas",
  2: "A Charlie Brown Christmas",
  3: "Home Alone",
  4: "It's a Wonderful Life",
  5: "Elf",
  6: "The Holiday",
  7: "Klaus",
  8: "Miracle on 34th Street",
  9: "Love Actually",
  10: "The Nightmare Before Christmas",
  11: "How the Grinch Stole Christmas",
  12: "The Santa Clause",
  13: "A Christmas Story",
  14: "National Lampoon's Christmas Vacation",
  15: "Frosty the Snowman",
  16: "The Polar Express",
  17: "Die Hard",
  18: "Home Alone 2: Lost in New York",
  19: "The Muppet Christmas Carol",
  20: "Arthur Christmas",
  21: "Tokyo Godfathers",
  22: "Jingle All the Way",
  23: "Little Women",
  24: "The Shop Around the Corner"
};

// Variables para usuario + datos
let currentUser = null;
let userData = {};  // objeto: { opened: {day: true}, ratings: {day: rating} }

// — — Manejo de interfaz de login — —
const btnLogin = document.getElementById("btnLogin");
btnLogin.onclick = () => {
  const name = document.getElementById("usernameInput").value.trim();
  if (!name) {
    alert("Ingresa un nombre para continuar");
    return;
  }
  currentUser = name;
  loadUserData();
  document.querySelector(".user-login").style.display = "none";
  document.getElementById("mainContent").style.display = "block";
  renderCalendar();
  updateCounter();
};

// — — Cargar o inicializar datos desde localStorage — —
function loadUserData() {
  const all = JSON.parse(localStorage.getItem("adv_users") || "{}");
  if (!all[currentUser]) {
    all[currentUser] = { opened: {}, ratings: {} };
    localStorage.setItem("adv_users", JSON.stringify(all));
  }
  userData = all[currentUser];
}

// — — Guardar datos usuario — —
function saveUserData() {
  const all = JSON.parse(localStorage.getItem("adv_users") || "{}");
  all[currentUser] = userData;
  localStorage.setItem("adv_users", JSON.stringify(all));
}

// — — Renderizar calendario — —
function renderCalendar() {
  const container = document.getElementById("calendar");
  container.innerHTML = "";
  for (let day = 1; day <= 24; day++) {
    const div = document.createElement("div");
    div.classList.add("day");
    if (userData.opened[day]) div.classList.add("opened");
    div.setAttribute("data-day", day);
    div.innerHTML = `<span class="number">${day}</span>`;
    div.onclick = () => openDay(day, div);
    container.appendChild(div);
  }
}

// — — Abrir día / ver película / calificar — —
function openDay(day, elementDiv) {
  const modal = document.getElementById("modal");
  const title = document.getElementById("modal-title");
  const text = document.getElementById("modal-text");

  const movie = movieList[day] || `Película Día ${day}`;
  title.innerText = `Día ${day}`;
  text.innerText = movie;

  // … dentro de openDay(day, elementDiv) …
  const audio = document.getElementById("bgAudio");
  audio.volume = 0.08;          // volumen suave (0.0 a 1.0)
  audio.currentTime = 0;
  audio.play();

  // cortar el audio luego de 15 segundos (o cuando termine)
  setTimeout(() => {
    audio.pause();
  }, 9000);



  // marcar como abierto para este usuario
  if (!userData.opened[day]) {
    userData.opened[day] = true;
    elementDiv.classList.add("opened");
    saveUserData();
    updateCounter();
  }

  generateStars(day);
  modal.style.display = "flex";
}

// — — Cerrar modal — —
function closeModal() {
  document.getElementById("modal").style.display = "none";
}

// — — Generar estrellas según rating guardado / actualizar rating — —
function generateStars(day) {
  const starsDiv = document.getElementById("stars");
  starsDiv.innerHTML = "";

  const current = userData.ratings[day] || 0;

  for (let i = 1; i <= 5; i++) {
    const span = document.createElement("span");
    span.classList.add("star");
    if (i <= current) span.classList.add("active");
    span.innerText = "★";
    span.onclick = () => {
      userData.ratings[day] = i;
      saveUserData();
      generateStars(day);
    };
    starsDiv.appendChild(span);
  }
}

// — — Contador de días abiertos — —
function updateCounter() {
  const count = Object.keys(userData.opened).length;
  document.getElementById("counter").innerText = count;
}

// — — Top 3 según rating — —
function showTop3() {
  const rated = Object.entries(userData.ratings)
    .filter(([d, r]) => r > 0)
    .map(([d, r]) => ({ day: parseInt(d), rating: r, movie: movieList[d] }));

  if (rated.length === 0) {
    alert("Aún no has calificado ninguna película 🎬");
    return;
  }

  rated.sort((a, b) => b.rating - a.rating);

  const top = rated.slice(0, 3);
  let text = "🎬 Tu TOP 3 navideño:\n\n";
  top.forEach((item, i) => {
    text += `${i+1}. ${item.movie} — ⭐ ${item.rating}/5\n`;
  });
  alert(text);
}

// — — ❄️ Nieve realista — ❄️
const canvas = document.getElementById("snow");
const ctx = canvas.getContext("2d");

function resizeCanvas() {
  const dpr = window.devicePixelRatio || 1;
  canvas.width = window.innerWidth * dpr;
  canvas.height = window.innerHeight * dpr;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
}
resizeCanvas();
window.addEventListener("resize", resizeCanvas);

let flakes = [];
const MAX_FLAKES = 350;

function initSnow() {
  flakes = [];
  for (let i = 0; i < MAX_FLAKES; i++) {
    flakes.push({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      r: Math.random() * 3 + 1,
      speed: Math.random() * 1.5 + 0.5,
      wind: Math.random() * 0.6 - 0.3,
      swing: Math.random() * Math.PI * 2
    });
  }
}
initSnow();

let mouseX = 0;
window.addEventListener("mousemove", e => {
  mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
});

function snowLoop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  for (let f of flakes) {
    f.swing += 0.01;
    const drift = Math.sin(f.swing) * 1.5;
    f.y += f.speed;
    f.x += drift + mouseX * 0.8 + f.wind;

    ctx.beginPath();
    ctx.fillStyle = "rgba(255,255,255,0.9)";
    ctx.arc(f.x, f.y, f.r, 0, Math.PI * 2);
    ctx.fill();

    if (f.y > window.innerHeight) {
      f.y = -10;
      f.x = Math.random() * window.innerWidth;
    }
    if (f.x > window.innerWidth + 50) f.x = -50;
    if (f.x < -50) f.x = window.innerWidth + 50;
  }

  requestAnimationFrame(snowLoop);
}
snowLoop();
