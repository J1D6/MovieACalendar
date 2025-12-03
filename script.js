let openedDays = 2

let movies = {
  1: "Last Christmas",
  2: "A Charlie Brown Christmas"
}

let ratings = JSON.parse(localStorage.getItem("ratings")) || {}

// abrir casilla
function openDay(day) {
  const modal = document.getElementById("modal")
  const title = document.getElementById("modal-title")
  const text = document.getElementById("modal-text")

  let movie = movies[day] || `Película sorpresa del día ${day}`
  movies[day] = movie

  title.innerText = `Día ${day}`
  text.innerText = movie

  generateStars(day)

  // marcar como abierta
  const dayDivs = document.querySelectorAll(".day")
  if (!dayDivs[day - 1].classList.contains("opened")) {
    dayDivs[day - 1].classList.add("opened")
    openedDays++
    document.getElementById("counter").innerText = openedDays
    dayDivs[day - 1].querySelector(".movie").classList.remove("hidden")
  }

  modal.style.display = "flex"
}

// cerrar modal
function closeModal() {
  document.getElementById("modal").style.display = "none"
}

// generar estrellas
function generateStars(day) {
  const starsDiv = document.getElementById("stars")
  starsDiv.innerHTML = ""

  let currentRating = ratings[day] || 0

  for (let i = 1; i <= 5; i++) {
    const star = document.createElement("span")
    star.innerHTML = "★"
    star.classList.add("star")

    if (i <= currentRating) {
      star.classList.add("active")
    }

    star.onclick = () => {
      ratings[day] = i
      localStorage.setItem("ratings", JSON.stringify(ratings))
      generateStars(day)
    }

    starsDiv.appendChild(star)
  }
}

// TOP 3
function showTop3() {
  let sorted = Object.entries(ratings)
    .sort((a,b) => b[1] - a[1])
    .slice(0, 3)

  if (sorted.length === 0) {
    alert("Aún no has calificado ninguna película 🎬")
    return
  }

  let text = "🎬 Tu TOP 3 actual:\n\n"

  sorted.forEach((item, index) => {
    const day = item[0]
    const score = item[1]
    const movie = movies[day] || `Día ${day}`
    text += `${index+1}. ${movie} — ⭐ ${score}/5\n`
  })

  alert(text)
}

/* ❄️ TORMENTA DE NIEVE REALISTA */
const canvas = document.getElementById("snow")
const ctx = canvas.getContext("2d")

function resize() {
  const dpr = window.devicePixelRatio || 1
  canvas.width = window.innerWidth * dpr
  canvas.height = window.innerHeight * dpr
  ctx.setTransform(dpr,0,0,dpr,0,0)
}
resize()
window.addEventListener("resize", resize)

let flakes = []
const COUNT = 350

function initSnow() {
  flakes = []
  for (let i = 0; i < COUNT; i++) {
    flakes.push({
      x: Math.random() * innerWidth,
      y: Math.random() * innerHeight,
      r: Math.random() * 3 + 1,
      speed: Math.random() * 1.5 + 0.5,
      wind: Math.random() * 0.6 - 0.3,
      swing: Math.random() * Math.PI*2
    })
  }
}
initSnow()

let mouseX = 0

window.addEventListener("mousemove", e => {
  mouseX = (e.clientX / innerWidth - 0.5) * 2
})

function snow() {
  ctx.clearRect(0,0,canvas.width,canvas.height)

  for (let f of flakes) {
    f.swing += 0.01
    let drift = Math.sin(f.swing) * 1.5

    f.y += f.speed
    f.x += drift + (mouseX * 0.8) + f.wind

    ctx.beginPath()
    ctx.fillStyle = "rgba(255,255,255,0.9)"
    ctx.arc(f.x, f.y, f.r, 0, Math.PI*2)
    ctx.fill()

    if (f.y > innerHeight) {
      f.y = -10
      f.x = Math.random() * innerWidth
    }
  }

  requestAnimationFrame(snow)
}
snow()
