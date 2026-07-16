/* AviatorGames.ai – main.js */

/* ── Navbar scroll ── */
const nav = document.getElementById('mainNav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 50);
});

/* ── Active nav link ── */
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-link');
window.addEventListener('scroll', () => {
  let cur = '';
  sections.forEach(s => { if (window.scrollY >= s.offsetTop - 120) cur = s.id; });
  navLinks.forEach(l => l.classList.toggle('active-nav', l.getAttribute('href') === '#' + cur));
});

/* ── Live bets table auto-update ── */
const names = ['J***o','M***a','K***i','A***n','P***r','O***s','W***a','B***e','D***k','S***l'];
const betAmounts = [250,500,750,1000,1500,2000,2500];
const tbody = document.getElementById('liveBetsBody');

function addRow() {
  if (!tbody) return;
  const rows = tbody.querySelectorAll('tr');
  if (rows.length >= 6) tbody.removeChild(tbody.firstElementChild);
  const bet  = betAmounts[Math.floor(Math.random() * betAmounts.length)];
  const mult = (1.01 + Math.random() * 9).toFixed(2);
  const cashed = Math.random() > 0.38;
  const lost   = !cashed && Math.random() > 0.45;
  const name   = names[Math.floor(Math.random() * names.length)];
  const profit = cashed ? '+' + Math.round(bet * mult - bet).toLocaleString() : lost ? '-' + bet.toLocaleString() : '—';
  const statusBadge = cashed ? '<span class="b-cash">Cashed</span>' : lost ? '<span class="b-lost">Lost</span>' : '<span class="b-fly">Flying</span>';
  const multDisplay = cashed ? `<span class="grn-txt">${mult}x</span>` : `<span class="red-txt">—</span>`;
  const profitClass = cashed ? 'grn-txt' : lost ? 'danger-txt' : 'muted-txt';
  const tr = document.createElement('tr');
  tr.innerHTML = `<td>${name}</td><td>${bet.toLocaleString()}</td><td>${multDisplay}</td><td>${statusBadge}</td><td class="${profitClass}">${profit}</td>`;
  tbody.appendChild(tr);
}
setInterval(addRow, 2400);

/* ── Player count flicker ── */
const pcEl = document.getElementById('playerCount');
setInterval(() => {
  if (!pcEl) return;
  const base = 1200 + Math.floor(Math.random() * 200);
  pcEl.textContent = base.toLocaleString() + ' Players Online';
}, 4000);

/* ── Scroll reveal ── */
const revealEls = document.querySelectorAll('.trust-card,.tcard,.fl-step,.game-demo-card,.pf-chip,.stat-unit,.img-frame');
revealEls.forEach(el => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(24px)';
  el.style.transition = 'opacity .6s ease, transform .6s ease';
});
const observer = new IntersectionObserver(entries => {
  entries.forEach((e, i) => {
    if (e.isIntersecting) {
      setTimeout(() => {
        e.target.style.opacity = '1';
        e.target.style.transform = 'translateY(0)';
      }, i * 70);
      observer.unobserve(e.target);
    }
  });
}, { threshold: 0.1 });
revealEls.forEach(el => observer.observe(el));



/* ── Aviator Simulator Engine ── */
const simScreen = document.getElementById('simScreen');
const simPlane = document.getElementById('simPlane');
const simMult = document.getElementById('simMultiplier');
const simStatus = document.getElementById('simStatus');

if (simScreen && simPlane && simMult && simStatus) {
  let simInterval = null;
  let flightState = 'idle'; // 'idle', 'flying', 'flewaway'
  
  function startSimulationLoop() {
    flightState = 'idle';
    simStatus.style.display = 'block';
    simStatus.textContent = 'Waiting for next round...';
    simStatus.style.color = 'var(--muted)';
    simMult.textContent = '1.00x';
    simMult.classList.remove('flying');
    simPlane.style.display = 'none';
    simPlane.style.left = '20px';
    simPlane.style.bottom = '20px';
    simPlane.style.transform = 'rotate(-15deg)';
    
    let countdown = 5;
    const countdownInterval = setInterval(() => {
      countdown--;
      if (countdown > 0) {
        simStatus.textContent = `Waiting for next round (${countdown}s)...`;
      } else {
        clearInterval(countdownInterval);
        startFlight();
      }
    }, 1000);
  }
  
  function startFlight() {
    flightState = 'flying';
    simStatus.style.display = 'none';
    simPlane.style.display = 'block';
    simMult.classList.add('flying');
    
    let currentMultiplier = 1.00;
    const peak = 1.1 + Math.random() * 8.9;
    const speed = 40;
    let elapsed = 0;
    
    simInterval = setInterval(() => {
      elapsed += speed;
      currentMultiplier = parseFloat((1.00 + Math.pow(elapsed / 2500, 2)).toFixed(2));
      simMult.textContent = currentMultiplier.toFixed(2) + 'x';
      
      const progress = Math.min(elapsed / 4500, 0.85);
      const x = 20 + progress * 320; 
      const y = 20 + Math.pow(progress, 1.5) * 160;
      simPlane.style.left = x + 'px';
      simPlane.style.bottom = y + 'px';
      
      if (currentMultiplier >= peak) {
        clearInterval(simInterval);
        flewAway(currentMultiplier);
      }
    }, speed);
  }
  
  function flewAway(finalMult) {
    flightState = 'flewaway';
    simStatus.style.display = 'block';
    simStatus.textContent = 'Flew Away!';
    simStatus.style.color = 'var(--red)';
    simMult.classList.remove('flying');
    simMult.style.color = '#ef4444';
    
    simPlane.style.transition = 'left 0.8s cubic-bezier(0.25, 1, 0.5, 1), bottom 0.8s cubic-bezier(0.25, 1, 0.5, 1)';
    setTimeout(() => {
      simPlane.style.left = '500px';
      simPlane.style.bottom = '350px';
    }, 50);
    
    setTimeout(() => {
      simPlane.style.transition = '';
      simMult.style.color = '';
      startSimulationLoop();
    }, 3000);
  }
  
  startSimulationLoop();
}

/* ── Game Showcase Interactive Switcher ── */
const gameCards = document.querySelectorAll('.game-demo-card');
const portfolioMockup = document.getElementById('portfolioMockup');

if (gameCards.length > 0 && portfolioMockup) {
  gameCards.forEach(card => {
    card.addEventListener('mouseenter', () => {
      gameCards.forEach(c => c.classList.remove('active'));
      card.classList.add('active');
      
      const newSrc = card.getAttribute('data-preview');
      if (newSrc && portfolioMockup.getAttribute('src') !== newSrc) {
        portfolioMockup.style.opacity = '0';
        portfolioMockup.style.transform = 'scale(0.97)';
        
        setTimeout(() => {
          portfolioMockup.setAttribute('src', newSrc);
          portfolioMockup.style.opacity = '1';
          portfolioMockup.style.transform = 'scale(1)';
        }, 150);
      }
    });
    
    card.addEventListener('click', (e) => {
      if (e.target.closest('.btn-play-demo')) return;
      const url = card.getAttribute('data-url');
      if (url) {
        window.open(url, '_blank');
      }
    });
  });
}


