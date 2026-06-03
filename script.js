// Smooth active nav on scroll
const sections = document.querySelectorAll('section[id]');
const links = document.querySelectorAll('.nav-links a');
window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(s => {
    if (window.scrollY >= s.offsetTop - 120) current = s.id;
  });
  links.forEach(l => {
    l.style.color = l.getAttribute('href') === '#'+current ? 'var(--orange)' : '';
  });
});

// Live clock — Granada (Europe/Madrid)
function updateClock() {
  const el = document.getElementById('hero-clock');
  if (!el) return;
  const t = new Date().toLocaleTimeString('es-ES', {
    hour: '2-digit', minute: '2-digit', second: '2-digit',
    timeZone: 'Europe/Madrid'
  });
  el.textContent = t + ' · Granada';
}
updateClock();
setInterval(updateClock, 1000);

// Cube 3D — JS driven (auto-rotate + mouse follow)
(function() {
  const cubeEl = document.getElementById('hero-cube');
  const heroEl = document.getElementById('hero');
  if (!cubeEl || !heroEl) return;

  let rotX = 22, rotY = 0;
  let targetX = 22, targetY = 0;
  let isHovering = false;

  function lerp(a, b, t) { return a + (b - a) * t; }

  heroEl.addEventListener('mousemove', (e) => {
    isHovering = true;
    const r = heroEl.getBoundingClientRect();
    const nx = (e.clientX - r.left) / r.width - 0.5;
    const ny = (e.clientY - r.top)  / r.height - 0.5;
    targetX = 22 - ny * 40;
    targetY = rotY + nx * 70;
  });
  heroEl.addEventListener('mouseleave', () => { isHovering = false; });

  cubeEl.style.animation = 'none';

  function tick() {
    if (isHovering) {
      rotX = lerp(rotX, targetX, 0.07);
      rotY = lerp(rotY, targetY, 0.07);
    } else {
      rotY += 0.25;
      rotX = lerp(rotX, 22, 0.03);
      targetY = rotY;
    }
    cubeEl.style.transform = `rotateX(${rotX}deg) rotateY(${rotY}deg)`;
    requestAnimationFrame(tick);
  }
  tick();
})();

// Scroll reveal
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('revealed');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('[data-reveal]').forEach(el => revealObserver.observe(el));

// Trayectoria tabs
(function() {
  const tabs = document.querySelectorAll('.tray-tab');
  const panels = document.querySelectorAll('.tray-panel');
  if (!tabs.length) return;
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      const target = 'tray-' + tab.dataset.tab;
      panels.forEach(p => p.classList.toggle('hidden', p.id !== target));
    });
  });
})();

// Sticky projects scroll stack
(function() {
  const track = document.getElementById('proj-track');
  const slides = document.querySelectorAll('.proj-slide');
  const bar = document.getElementById('proj-progress-bar');
  const countEl = document.getElementById('proj-count');
  if (!track || !slides.length) return;

  const N = slides.length;
  let activeIdx = -1;

  function update() {
    const rect = track.getBoundingClientRect();
    const scrolled = -rect.top;
    const total = rect.height - window.innerHeight;
    if (scrolled < 0 || scrolled > total) return;

    const progress = scrolled / total;
    const idx = Math.min(Math.floor(progress * N), N - 1);

    if (idx !== activeIdx) {
      slides.forEach((slide, i) => {
        slide.classList.remove('active', 'exit');
        if (i === idx) slide.classList.add('active');
        else if (i < idx) slide.classList.add('exit');
      });
      activeIdx = idx;
      if (countEl) countEl.textContent = String(idx + 1).padStart(2,'0') + ' / ' + String(N).padStart(2,'0');
    }

    if (bar) bar.style.width = (progress * 100) + '%';
  }

  window.addEventListener('scroll', update, { passive: true });
  update();
})();
