// Smooth active nav on scroll (posiciones en caché y como mucho una vez por frame)
const sections = Array.from(document.querySelectorAll('section[id]'));
const links = document.querySelectorAll('.nav-links a');
let sectionTops = [], navTicking = false, navCurrent = null;
function measureSections() { sectionTops = sections.map(s => s.offsetTop); }
function updateNav() {
  navTicking = false;
  let current = '';
  sectionTops.forEach((top, i) => { if (window.scrollY >= top - 120) current = sections[i].id; });
  if (current === navCurrent) return;
  navCurrent = current;
  links.forEach(l => {
    l.style.color = l.getAttribute('href') === '#'+current ? 'var(--accent)' : '';
  });
}
window.addEventListener('scroll', () => {
  if (!navTicking) { navTicking = true; requestAnimationFrame(updateNav); }
}, { passive: true });
window.addEventListener('resize', measureSections);
window.addEventListener('load', () => { measureSections(); updateNav(); });
measureSections();

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

// Hero visual — red neuronal de fondo + terminal
(function() {
  const visual = document.getElementById('hero-visual');
  const heroEl = document.getElementById('hero');
  if (!visual || !heroEl) return;
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Solo se anima mientras la portada está en pantalla y la pestaña visible
  let heroOnScreen = true;
  const isActive = () => heroOnScreen && !document.hidden;
  new IntersectionObserver(([entry]) => {
    heroOnScreen = entry.isIntersecting;
    if (isActive()) resumeNet();
  }).observe(heroEl);
  document.addEventListener('visibilitychange', () => { if (isActive()) resumeNet(); });

  // Ratón → variables --mx / --my (-0.5 … 0.5), una vez por frame
  let pointer = null, pointerTicking = false;
  heroEl.addEventListener('mousemove', (e) => {
    pointer = e;
    if (pointerTicking) return;
    pointerTicking = true;
    requestAnimationFrame(() => {
      pointerTicking = false;
      const r = heroEl.getBoundingClientRect();
      visual.style.setProperty('--mx', ((pointer.clientX - r.left) / r.width - 0.5).toFixed(3));
      visual.style.setProperty('--my', ((pointer.clientY - r.top) / r.height - 0.5).toFixed(3));
      const c = canvas && canvas.getBoundingClientRect();
      if (c) mouse = { x: pointer.clientX - c.left, y: pointer.clientY - c.top };
    });
  }, { passive: true });
  heroEl.addEventListener('mouseleave', () => {
    visual.style.setProperty('--mx', 0);
    visual.style.setProperty('--my', 0);
  });

  // Terminal que se escribe sola
  const term = document.getElementById('term-body');
  const script = [
    { cmd: 'git push origin main' },
    { out: 'Vercel: desplegando eat-em…', cls: 't-dim' },
    { out: '✓ Listo en eat-em.vercel.app', cls: 't-ok' },
    { cmd: 'npm run scraper' },
    { out: '✓ Precios de 4 supermercados al día', cls: 't-ok' },
    { cmd: 'npx cap run android' },
    { out: '✓ Run-In-Out instalada en el móvil', cls: 't-ok' },
    { cmd: 'ia --plan "semana de carrera"' },
    { out: '✓ Plan ajustado a tu carga y recuperación', cls: 't-ok' },
  ];
  const esc = (t) => t.replace(/&/g, '&amp;').replace(/</g, '&lt;');
  let html = '';
  function render(extra) {
    term.innerHTML = html + (extra || '') + '<span class="term-cursor"></span>';
  }
  async function runTerminal() {
    const wait = async (ms) => {
      await new Promise(r => setTimeout(r, ms));
      while (!isActive()) await new Promise(r => setTimeout(r, 400));
    };
    while (true) {
      html = '';
      for (const step of script) {
        if (step.cmd) {
          const pre = '<span class="t-prompt">$</span> ';
          for (let i = 1; i <= step.cmd.length; i++) {
            render(pre + esc(step.cmd.slice(0, i)));
            await wait(38 + Math.random() * 40);
          }
          html += pre + esc(step.cmd) + '\n';
          render();
          await wait(350);
        } else {
          html += '<span class="' + step.cls + '">' + esc(step.out) + '</span>\n';
          render();
          await wait(450);
        }
      }
      await wait(3500);
    }
  }
  if (term) {
    if (reduceMotion) {
      html = script.map(s => s.cmd ? '<span class="t-prompt">$</span> ' + esc(s.cmd) : '<span class="' + s.cls + '">' + esc(s.out) + '</span>').join('\n') + '\n';
      render();
    } else {
      runTerminal();
    }
  }

  // Red neuronal en canvas (detrás de la terminal)
  const canvas = document.getElementById('net-canvas');
  const ctx = canvas && canvas.getContext('2d');
  let nodes = [], W = 0, H = 0, mouse = null, netRunning = false;
  function sizeCanvas() {
    const dpr = window.devicePixelRatio || 1;
    W = canvas.clientWidth; H = canvas.clientHeight;
    canvas.width = W * dpr; canvas.height = H * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    if (!nodes.length) {
      nodes = Array.from({ length: 64 }, () => ({
        x: Math.random() * W, y: Math.random() * H,
        vx: (Math.random() - 0.5) * 0.35, vy: (Math.random() - 0.5) * 0.35,
        r: 2 + Math.random() * 2.5,
      }));
    }
  }
  heroEl.addEventListener('mouseleave', () => { mouse = null; });
  const accent = getComputedStyle(document.documentElement).getPropertyValue('--accent').trim() || '#2b3bff';
  function drawNet() {
    ctx.clearRect(0, 0, W, H);
    for (const n of nodes) {
      if (!reduceMotion) {
        n.x += n.vx; n.y += n.vy;
        if (n.x < 0 || n.x > W) n.vx *= -1;
        if (n.y < 0 || n.y > H) n.vy *= -1;
        if (mouse) {
          const dx = mouse.x - n.x, dy = mouse.y - n.y, d = Math.hypot(dx, dy);
          if (d < 140) { n.x += dx * 0.012; n.y += dy * 0.012; }
        }
      }
    }
    ctx.strokeStyle = accent;
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const a = nodes[i], b = nodes[j], d = Math.hypot(a.x - b.x, a.y - b.y);
        if (d < 110) {
          ctx.globalAlpha = (1 - d / 110) * 0.45;
          ctx.lineWidth = 1;
          ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
        }
      }
      if (mouse) {
        const a = nodes[i], d = Math.hypot(a.x - mouse.x, a.y - mouse.y);
        if (d < 160) {
          ctx.globalAlpha = (1 - d / 160) * 0.8;
          ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(mouse.x, mouse.y); ctx.stroke();
        }
      }
    }
    ctx.globalAlpha = 1;
    for (const n of nodes) {
      ctx.fillStyle = n.r > 3.8 ? accent : '#0e0e12';
      ctx.beginPath(); ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2); ctx.fill();
    }
    if (netRunning && !reduceMotion && isActive()) requestAnimationFrame(drawNet);
    else netPaused = true;
  }
  let netPaused = false;
  function resumeNet() {
    if (netRunning && netPaused && !reduceMotion) { netPaused = false; requestAnimationFrame(drawNet); }
  }
  function startNet() {
    if (!canvas || netRunning) return;
    netRunning = true;
    sizeCanvas();
    drawNet();
  }
  window.addEventListener('resize', () => { if (netRunning) sizeCanvas(); });

  // Solo se anima si la portada está visible (ahorra batería en móvil, donde se oculta)
  if (canvas && getComputedStyle(visual).display !== 'none') startNet();
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

// Mazo de webs: pulsar la tarjeta pasa a la siguiente
(function() {
  const deck = document.getElementById('deck');
  if (!deck) return;
  const cards = Array.from(deck.querySelectorAll('.proj-slide'));
  const countEl = document.getElementById('proj-count');
  const N = cards.length;
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let order = cards.slice();   // order[0] = tarjeta de delante
  let busy = false;

  function layout() {
    order.forEach((card, pos) => {
      card.dataset.pos = pos;
      card.setAttribute('aria-hidden', pos === 0 ? 'false' : 'true');
      card.querySelectorAll('a').forEach(a => a.tabIndex = pos === 0 ? 0 : -1);
    });
    const front = Number(order[0].dataset.idx) + 1;
    if (countEl) countEl.textContent = String(front).padStart(2, '0') + ' / ' + String(N).padStart(2, '0');
  }

  function next() {
    if (busy || N < 2) return;
    const top = order[0];
    if (reduceMotion) { order.push(order.shift()); layout(); return; }
    busy = true;
    top.classList.add('flying');
    setTimeout(() => {
      order.push(order.shift());
      top.classList.remove('flying');
      layout();
      busy = false;
    }, 230);
  }

  function prev() {
    if (busy || N < 2) return;
    const last = order[N - 1];
    if (reduceMotion) { order.unshift(order.pop()); layout(); return; }
    busy = true;
    // La última carta aparece desde donde salen las cartas y vuelve delante
    last.style.transition = 'none';
    last.classList.add('flying');
    void last.offsetWidth;
    last.style.transition = '';
    order.unshift(order.pop());
    layout();
    requestAnimationFrame(() => {
      last.classList.remove('flying');
      setTimeout(() => { busy = false; }, 280);
    });
  }

  deck.addEventListener('click', (e) => {
    if (e.target.closest('a')) return;           // el botón "Ver proyecto" abre la web
    if (e.target.closest('.proj-slide') === order[0]) next();
  });
  deck.addEventListener('keydown', (e) => {
    if (e.target.closest('a')) return;           // Enter en el enlace abre la web
    if (e.key === 'ArrowRight' || e.key === 'Enter' || e.key === ' ') { e.preventDefault(); next(); }
    if (e.key === 'ArrowLeft') { e.preventDefault(); prev(); }
  });
  const btnNext = document.getElementById('deck-next');
  const btnPrev = document.getElementById('deck-prev');
  btnNext && btnNext.addEventListener('click', next);
  btnPrev && btnPrev.addEventListener('click', prev);

  layout();
})();
