/* =====================================================
   GLOBAL SAFE INIT
===================================================== */
document.addEventListener("DOMContentLoaded", () => {

  /* =====================================================
     SAFE BACKGROUND CANVAS
  ===================================================== */

  const canvas = document.getElementById("bgCanvas");
  let ctx = null;

  if (canvas) {
    ctx = canvas.getContext("2d");

    function resizeCanvas() {
      canvas.width = window.innerWidth;
      canvas.height = document.body.scrollHeight;
    }

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    /* ======================
       AI + ROBOT PARTICLES
    ====================== */

    const PARTICLE_COUNT = 190;
    const ICON_RATIO = 0.35;
    const ICONS = ["🤖", "🧠", "⬡", "⛓"];
    const particles = [];

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const isIcon = Math.random() < ICON_RATIO;

      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: isIcon ? 14 : Math.random() * 2 + 1,
        speedY: Math.random() * 0.15 + 0.05,
        speedX: (Math.random() - 0.5) * 0.05,
        opacity: isIcon ? 0.16 : Math.random() * 0.12 + 0.05,
        type: isIcon ? "icon" : "dot",
        icon: isIcon ? ICONS[Math.floor(Math.random() * ICONS.length)] : null
      });
    }

    function drawParticle(p) {
      ctx.globalAlpha = p.opacity;

      if (p.type === "dot") {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = "#6ee7ff";
        ctx.fill();
      } else {
        ctx.font = `${p.size}px system-ui`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillStyle = "#ffffff";
        ctx.fillText(p.icon, p.x, p.y);
      }
    }

    function animateParticles() {
      if (!ctx) return;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach(p => {
        drawParticle(p);

        p.y -= p.speedY;
        p.x += p.speedX;

        if (p.y < -50) {
          p.y = canvas.height + 50;
          p.x = Math.random() * canvas.width;
        }

        if (p.x < -50) p.x = canvas.width + 50;
        if (p.x > canvas.width + 50) p.x = -50;
      });

      ctx.globalAlpha = 1;
      requestAnimationFrame(animateParticles);
    }

    animateParticles();
  }

  /* =====================================================
     PILL TYPING ANIMATION (SINGLE, FIXED)
  ===================================================== */

  const pillSelectors =
    ".pill, .features-pill, .ai-tag, .cap-pill, .wp-pill";

  const pills = document.querySelectorAll(pillSelectors);

  if (pills.length) {
    const pillObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach(entry => {
          if (!entry.isIntersecting) return;

          const pill = entry.target;
          observer.unobserve(pill);

          const text = pill.textContent.trim();
          pill.textContent = "";

          const cursor = document.createElement("span");
          cursor.className = "typing-cursor";
          cursor.textContent = "|";
          pill.appendChild(cursor);

          let i = 0;

          const interval = setInterval(() => {
            if (i < text.length) {
              cursor.insertAdjacentText("beforebegin", text[i]);
              i++;
            } else {
              clearInterval(interval);
              cursor.remove();
            }
          }, 45);
        });
      },
      { threshold: 0.6 }
    );

    pills.forEach(pill => pillObserver.observe(pill));
  }

  /* =====================================================
     COUNTDOWN TIMER
  ===================================================== */

  let total = 3 * 24 * 60 * 60 + 3 * 60 * 60 + 29 * 60 + 55;

  setInterval(() => {
    if (total <= 0) return;
    total--;

    const d = Math.floor(total / 86400);
    const h = Math.floor((total % 86400) / 3600);
    const m = Math.floor((total % 3600) / 60);
    const s = total % 60;

    document.getElementById("d").textContent = String(d).padStart(2, "0");
    document.getElementById("h").textContent = String(h).padStart(2, "0");
    document.getElementById("m").textContent = String(m).padStart(2, "0");
    document.getElementById("s").textContent = String(s).padStart(2, "0");
  }, 1000);

  /* =====================================================
     STATS COUNTING ANIMATION
  ===================================================== */

  const statsSection = document.querySelector('.stats');
  const statNumbers = document.querySelectorAll('.stat-number');

  if (statsSection && statNumbers.length) {
    const statsObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          statNumbers.forEach(stat => {
            const target = parseFloat(stat.getAttribute('data-target'));
            const originalText = stat.textContent;
            const isPercentage = originalText.includes('%');
            const hasK = originalText.includes('K+');
            const hasM = originalText.includes('M+') || originalText.includes('M');

            animateCount(stat, target, 2000, () => {
              // Format the final display
              if (hasM && target >= 1000000) {
                stat.textContent = (target / 1000000).toFixed(0) + 'M' + (originalText.includes('+') ? '+' : '');
              } else if (hasK && target >= 1000) {
                stat.textContent = (target / 1000).toFixed(0) + 'K' + (originalText.includes('+') ? '+' : '');
              } else if (isPercentage) {
                stat.textContent = target.toFixed(1) + '%';
              } else {
                stat.textContent = target.toLocaleString();
              }
            });
          });
          statsObserver.unobserve(statsSection);
        }
      });
    }, { threshold: 0.5 });

    statsObserver.observe(statsSection);
  }

  function animateCount(element, target, duration, callback) {
    const start = 0;
    const startTime = performance.now();

    function update(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Easing function for smooth animation
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      const current = start + (target - start) * easeOutQuart;

      // Format display during animation
      const originalText = element.textContent;
      const isPercentage = originalText.includes('%');
      const hasK = originalText.includes('K+');
      const hasM = originalText.includes('M+') || originalText.includes('M');

      if (hasM && target >= 1000000) {
        element.textContent = (current / 1000000).toFixed(1) + 'M' + (originalText.includes('+') ? '+' : '');
      } else if (hasK && target >= 1000) {
        element.textContent = (current / 1000).toFixed(1) + 'K' + (originalText.includes('+') ? '+' : '');
      } else if (isPercentage) {
        element.textContent = current.toFixed(1) + '%';
      } else {
        element.textContent = Math.floor(current).toLocaleString();
      }

      if (progress < 1) {
        requestAnimationFrame(update);
      } else {
        if (callback) callback();
      }
    }

    requestAnimationFrame(update);
  }

  /* =====================================================
     PREMIUM PARALLAX FLOAT TILES
  ===================================================== */

  const tiles = document.querySelectorAll(".float-tile");

  window.addEventListener("mousemove", e => {
    const x = (e.clientX / window.innerWidth - 0.5) * 30;
    const y = (e.clientY / window.innerHeight - 0.5) * 30;

    tiles.forEach((tile, i) => {
      tile.style.transform =
        `translate(${x * (i + 1) * 0.35}px, ${y * (i + 1) * 0.35}px)`;
    });
  });



  // Select all elements with .visual-card or .ai-image
const aiBoxes = document.querySelectorAll('.visual-card, .ai-image');

aiBoxes.forEach(aiBox => {
  const video = aiBox.querySelector('video');
  if (!video) return;

  // Initial state
  video.pause();
  video.currentTime = 0;

  aiBox.addEventListener('click', () => {
    if (video.paused) {
      video.play();
      aiBox.classList.add('playing');
    } else {
      video.pause();
      video.currentTime = 0; // remove if you want resume instead
      aiBox.classList.remove('playing');
    }
  });

  // Reset when video ends
  video.addEventListener('ended', () => {
    aiBox.classList.remove('playing');
    video.currentTime = 0;
  });
});


const canva = document.getElementById("background-canvas");
const ctx2 = canva.getContext("2d");

let cw = 0, ch = 0;

/* 🔹 Helpers */
function random(min, max) {
  return Math.random() * (max - min) + min;
}

function getBaseSize() {
  if (window.innerWidth < 480) return random(20, 28);
  if (window.innerWidth < 768) return random(22, 34);
  return random(24, 40);
}

/* 🔹 Resize canvas (DPR LIMITED) */
function resizeCanva() {
  const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
  cw = canva.clientWidth;
  ch = canva.clientHeight;

  canva.width = cw * dpr;
  canva.height = ch * dpr;

  ctx2.setTransform(dpr, 0, 0, dpr, 0, 0);
}
resizeCanva();
window.addEventListener("resize", resizeCanva);

/* ==============================
   IMAGE CONFIG
============================== */
const imageConfig = [
  { src: "assets/Robot.png", scale: 1 },
  { src: "assets/LockIcon.png", scale: 1.4 },
  { src: "assets/FingerprintIcon.png", scale: 1.6 }
];

const images = [];
let loaded = 0;

/* 🔹 Load images */
imageConfig.forEach(item => {
  const img = new Image();
  img.src = item.src;
  img.onload = () => {
    images.push({
      img,
      scale: item.scale,
      aspect: img.naturalWidth / img.naturalHeight
    });
    loaded++;
    if (loaded === imageConfig.length) {
      initParticles();
      requestAnimationFrame(animate);
    }
  };
});

/* ==============================
   PARTICLES
============================== */
const particles = [];
const COUNT = window.innerWidth < 768 ? 80 : 120;

function initParticles() {
  particles.length = 0;

  for (let i = 0; i < COUNT; i++) {
    const item = images[Math.floor(Math.random() * images.length)];

    particles.push({
      x: random(0, cw),
      y: random(0, ch),
      baseSize: getBaseSize(),
      speedX: random(-0.3, 0.3),
      speedY: random(-1.8, -0.6) / item.scale,
      img: item.img,
      scale: item.scale,
      aspect: item.aspect
    });
  }
}

/* ==============================
   ANIMATION (FPS LIMITED)
============================== */
let lastTime = 0;
const FPS = 40;
const frameInterval = 1000 / FPS;

function animate(time) {
  if (time - lastTime < frameInterval) {
    requestAnimationFrame(animate);
    return;
  }
  lastTime = time;

  ctx2.clearRect(0, 0, cw, ch);

  for (let i = 0; i < particles.length; i++) {
    const p = particles[i];

    p.x += p.speedX;
    p.y += p.speedY;

    if (p.y + p.baseSize * p.scale < 0) {
      p.y = ch + p.baseSize;
      p.x = random(0, cw);

      const item = images[Math.floor(Math.random() * images.length)];
      p.img = item.img;
      p.scale = item.scale;
      p.aspect = item.aspect;
    }

    const h = p.baseSize * p.scale;
    const w = h * p.aspect;

    ctx2.drawImage(
      p.img,
      p.x - w / 2,
      p.y,
      w,
      h
    );
  }

  requestAnimationFrame(animate);
}

/* ==============================
   VISIBILITY OPTIMIZATION
============================== */
document.addEventListener("visibilitychange", () => {
  if (document.hidden) {
    lastTime = 0;
  }
});




});
