// ==== STARFIELD BACKGROUND ====

const canvas = document.getElementById("stars");
const ctx = canvas.getContext("2d");

let stars = [];
const numStars = 250;

// -- Canvas formaat aanpassen --
function resize() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  initStars();
}
window.addEventListener("resize", resize);

// -- Willekeurige sterren verdelen --
function initStars() {
  stars = [];
  for (let i = 0; i < numStars; i++) {
    stars.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      z: Math.random() * canvas.width,
      size: Math.random() * 1.8 + 0.2,
      speed: Math.random() * 0.3 + 0.05,
      flicker: Math.random() * 0.8 + 0.2
    });
  }
}

// -- Animatie --
function animate() {
  ctx.fillStyle = "rgba(0,0,0,0.6)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  for (let s of stars) {
    s.z -= s.speed;
    if (s.z <= 0) s.z = canvas.width;

    const k = 128.0 / s.z;
    const px = (s.x - canvas.width / 2) * k + canvas.width / 2;
    const py = (s.y - canvas.height / 2) * k + canvas.height / 2;

    if (px >= 0 && px <= canvas.width && py >= 0 && py <= canvas.height) {
      const brightness = (1 - s.z / canvas.width) * s.flicker;
      ctx.fillStyle = `rgba(255,255,255,${brightness})`;
      ctx.beginPath();
      ctx.arc(px, py, s.size, 0, 2 * Math.PI);
      ctx.fill();
    }

    // subtiele twinkle-variatie
    s.flicker += (Math.random() - 0.5) * 0.05;
    if (s.flicker < 0.2) s.flicker = 0.2;
    if (s.flicker > 1.0) s.flicker = 1.0;
  }

  requestAnimationFrame(animate);
}

resize();
animate();
