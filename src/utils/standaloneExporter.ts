import { INITIAL_CARDS } from '../data/vocabData';

export function generateStandaloneVanillaHtml(): string {
  const cardsJson = JSON.stringify(INITIAL_CARDS, null, 2);

  return `<!DOCTYPE html>
<html lang="de">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Achsoo — German Vocabulary & Grammar Flashcards</title>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600;9..144,700&family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
  <style>
    :root {
      --bg: #FAF8F5;
      --surface: #FFFFFF;
      --surface-subtle: #F3EFEA;
      --text: #1C1917;
      --text-muted: #57534E;
      --border: #E7E5E4;
      --accent: #2E6650;
      --der-color: #0284c7;
      --die-color: #dc2626;
      --das-color: #059669;
    }
    html.dark {
      --bg: #0d1117;
      --surface: #161b22;
      --surface-subtle: #1f2631;
      --text: #f5f5f4;
      --text-muted: #a8a29e;
      --border: #262c36;
      --accent: #74B094;
      --der-color: #38bdf8;
      --die-color: #f87171;
      --das-color: #34d399;
    }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      background: var(--bg);
      color: var(--text);
      min-height: 100vh;
      line-height: 1.5;
      transition: background 0.2s ease, color 0.2s ease;
    }
    header {
      max-width: 1200px;
      margin: 0 auto;
      padding: 1rem 1.5rem;
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-bottom: 1px solid var(--border);
    }
    .brand {
      font-family: 'Fraunces', serif;
      font-size: 1.35rem;
      font-weight: 600;
      color: var(--text);
      text-decoration: none;
    }
    .nav-links { display: flex; gap: 1.5rem; align-items: center; }
    .nav-btn {
      background: none;
      border: none;
      color: var(--text-muted);
      font: inherit;
      font-size: 0.9rem;
      font-weight: 500;
      cursor: pointer;
      padding: 0.35rem 0;
      border-bottom: 2px solid transparent;
    }
    .nav-btn.active { color: var(--text); border-bottom-color: var(--accent); }
    .container { max-width: 1120px; margin: 0 auto; padding: 2rem 1.5rem; }
    .perspective-stage {
      perspective: 1400px;
      max-width: 680px;
      margin: 0 auto;
      height: 430px;
    }
    .flip-card-inner {
      position: relative;
      width: 100%;
      height: 100%;
      transition: transform 0.55s cubic-bezier(0.16, 1, 0.3, 1);
      transform-style: preserve-3d;
      cursor: pointer;
    }
    .flip-card-inner.is-flipped { transform: rotateY(180deg); }
    .flip-card-face {
      position: absolute;
      inset: 0;
      backface-visibility: hidden;
      -webkit-backface-visibility: hidden;
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: 16px;
      padding: 2.25rem;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
    }
    .flip-card-back { transform: rotateY(180deg); }
    .lemma {
      font-family: 'Fraunces', serif;
      font-size: clamp(2.25rem, 4vw, 3.25rem);
      font-weight: 600;
    }
    .rating-dock {
      max-width: 680px;
      margin: 1.25rem auto 0;
      display: grid;
      grid-template-columns: repeat(5, 1fr);
      gap: 0.5rem;
    }
    .rate-btn {
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: 10px;
      padding: 0.65rem 0.4rem;
      color: var(--text);
      font: inherit;
      cursor: pointer;
      text-align: center;
      transition: transform 0.12s ease, border-color 0.12s ease;
    }
    .rate-btn:hover { transform: translateY(-1px); border-color: var(--accent); }
    .hidden { display: none !important; }
  </style>
</head>
<body>
  <header>
    <a href="#study" class="brand" id="brandLink">Achsoo</a>
    <nav class="nav-links">
      <button class="nav-btn active" id="tabStudy">Lernstudio</button>
    </nav>
    <button class="nav-btn" id="themeBtn">Erscheinungsbild</button>
  </header>
  <main class="container">
    <section id="studyView">
      <div style="max-width:680px;margin:0 auto 1rem;display:flex;justify-content:space-between;font-size:0.875rem;color:var(--text-muted);">
        <span id="deckTitleLabel">Alle Karten · Loop</span>
        <span id="progressLabel" style="font-variant-numeric:tabular-nums;">Sicher: 0 / 0</span>
      </div>
      <div class="perspective-stage">
        <div class="flip-card-inner" id="cardInner">
          <div class="flip-card-face" id="cardFront"></div>
          <div class="flip-card-face flip-card-back" id="cardBack"></div>
        </div>
      </div>
      <div class="rating-dock" id="ratingDock">
        <button class="rate-btn" data-rate="1"><strong>1</strong><br><small>Gar nicht</small></button>
        <button class="rate-btn" data-rate="2"><strong>2</strong><br><small>Kaum</small></button>
        <button class="rate-btn" data-rate="3"><strong>3</strong><br><small>Mühsam</small></button>
        <button class="rate-btn" data-rate="4"><strong>4</strong><br><small>Gut</small></button>
        <button class="rate-btn" data-rate="5"><strong>5</strong><br><small>Sicher</small></button>
      </div>
    </section>
  </main>
  <script>
    const CARDS = ${cardsJson};
    const GAPS = { 1: 2, 2: 5, 3: 8, 4: 14, 5: 30 };
    let nowClock = 0;
    let isFlipped = false;
    let activePool = [];
    let waiting = CARDS.map((c) => c.id);
    let cleared = new Set();
    let meta = {};
    let currentId = null;

    function admitOne() {
      if (waiting.length === 0 || activePool.length >= 10) return;
      const minDue = activePool.length === 0 ? Infinity : Math.min(...activePool.map((id) => meta[id].dueAt));
      if (activePool.length > 0 && minDue <= nowClock) return;
      const nextId = waiting.shift();
      meta[nextId] = { dueAt: nowClock, consHigh: 0 };
      activePool.push(nextId);
    }

    function pickNext() {
      admitOne();
      if (activePool.length === 0) {
        currentId = null;
        return;
      }
      activePool.sort((a, b) => meta[a].dueAt - meta[b].dueAt);
      currentId = activePool[0];
    }

    function speak(text) {
      if (!('speechSynthesis' in window)) return;
      window.speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(text);
      u.lang = 'de-DE';
      u.rate = 0.94;
      window.speechSynthesis.speak(u);
    }

    function renderCard() {
      const c = CARDS.find((x) => x.id === currentId);
      document.getElementById('progressLabel').textContent = 'Sicher: ' + cleared.size + ' / ' + CARDS.length;
      if (!c) {
        document.getElementById('cardFront').innerHTML = '<div style="margin:auto;text-align:center;"><h2>Deck geschafft!</h2><p style="margin-top:0.5rem;color:var(--text-muted);">Alle Karten sicher verankert.</p></div>';
        document.getElementById('cardBack').innerHTML = '';
        return;
      }
      const inner = document.getElementById('cardInner');
      inner.classList.toggle('is-flipped', isFlipped);
      document.getElementById('cardFront').innerHTML = \`
        <div style="display:flex;justify-content:space-between;color:var(--text-muted);font-size:0.85rem;">
          <span>\${c.cefr} · \${c.grammarLabel}</span>
          <button onclick="event.stopPropagation();speak('\${c.spokenText.replace(/'/g, "\\\\'")}')" style="background:none;border:1px solid var(--border);border-radius:8px;padding:0.25rem 0.6rem;color:var(--text);cursor:pointer;">Audio [A]</button>
        </div>
        <div style="text-align:center;margin:auto 0;">
          <div class="lemma">\${c.lemma}</div>
        </div>
        <div style="text-align:center;color:var(--text-muted);font-size:0.8rem;">Klicken oder Leertaste zum Umdrehen</div>
      \`;
      document.getElementById('cardBack').innerHTML = \`
        <div style="font-size:0.85rem;color:var(--text-muted);">\${c.lemma} · \${c.cefr}</div>
        <div>
          <div style="font-size:1.5rem;font-weight:600;margin-bottom:0.75rem;">\${c.translation}</div>
          <div style="font-size:1.02rem;font-weight:500;line-height:1.6;margin-bottom:0.25rem;">„\${c.exampleDe}“</div>
          <div style="font-size:0.875rem;line-height:1.5;color:var(--text-muted);">\${c.exampleEn}</div>
        </div>
        <div style="font-size:0.75rem;color:var(--text-muted);">Vertrauen bewerten (Tasten 1–5)</div>
      \`;
    }

    function rateCard(ratingNum) {
      if (!currentId) return;
      nowClock += 1;
      const m = meta[currentId];
      m.consHigh = ratingNum >= 4 ? m.consHigh + 1 : 0;
      if (m.consHigh >= 2) {
        activePool = activePool.filter((id) => id !== currentId);
        cleared.add(currentId);
      } else {
        m.dueAt = nowClock + (GAPS[ratingNum] || 3);
      }
      isFlipped = false;
      pickNext();
      renderCard();
    }

    document.querySelectorAll('.rate-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        const r = Number(btn.getAttribute('data-rate'));
        if (r >= 1 && r <= 5) rateCard(r);
      });
    });

    document.getElementById('cardInner').addEventListener('click', () => {
      isFlipped = !isFlipped;
      renderCard();
    });

    document.getElementById('themeBtn').addEventListener('click', () => {
      document.documentElement.classList.toggle('dark');
    });

    window.addEventListener('keydown', (e) => {
      if (e.code === 'Space') { e.preventDefault(); isFlipped = !isFlipped; renderCard(); }
      if (['1','2','3','4','5'].includes(e.key)) { e.preventDefault(); if (isFlipped) rateCard(Number(e.key)); else { isFlipped = true; renderCard(); } }
      if (e.key.toLowerCase() === 'a') { const c = CARDS.find((x) => x.id === currentId); if (c) speak(c.spokenText); }
    });

    pickNext();
    renderCard();
  </script>
</body>
</html>`;
}
