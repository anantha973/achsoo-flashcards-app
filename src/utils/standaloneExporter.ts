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
      --accent: #B45309;
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
      --accent: #f59e0b;
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
    .stats-row {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 1rem;
      margin-bottom: 2rem;
    }
    .stat-card {
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: 12px;
      padding: 1.25rem;
    }
    .stat-value {
      font-family: 'Fraunces', serif;
      font-size: 1.85rem;
      font-weight: 600;
      font-variant-numeric: tabular-nums;
    }
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
      grid-template-columns: repeat(4, 1fr);
      gap: 0.75rem;
    }
    .rate-btn {
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: 10px;
      padding: 0.75rem;
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
    <a href="#dashboard" class="brand" id="brandLink">Achsoo</a>
    <nav class="nav-links">
      <button class="nav-btn active" id="tabDashboard">Decks & Übersicht</button>
      <button class="nav-btn" id="tabStudy">Lernstudio</button>
      <span id="streakDisplay" style="font-size:0.85rem;font-variant-numeric:tabular-nums;">Serie: 1 Tag</span>
    </nav>
    <button class="nav-btn" id="themeBtn">Erscheinungsbild</button>
  </header>
  <main class="container">
    <section id="dashboardView">
      <div class="stats-row" id="statsRow"></div>
      <div id="deckList" style="display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:1rem;"></div>
    </section>
    <section id="studyView" class="hidden">
      <div style="max-width:680px;margin:0 auto 1rem;display:flex;justify-content:space-between;font-size:0.875rem;color:var(--text-muted);">
        <span id="deckTitleLabel">Alle Karten</span>
        <span id="progressLabel" style="font-variant-numeric:tabular-nums;">Karte 1 von 20</span>
      </div>
      <div class="perspective-stage">
        <div class="flip-card-inner" id="cardInner">
          <div class="flip-card-face" id="cardFront"></div>
          <div class="flip-card-face flip-card-back" id="cardBack"></div>
        </div>
      </div>
      <div class="rating-dock" id="ratingDock">
        <button class="rate-btn" data-rate="again"><strong>Nochmal</strong><br><small>&lt; 1 Min. [1]</small></button>
        <button class="rate-btn" data-rate="hard"><strong>Schwer</strong><br><small>10 Min. [2]</small></button>
        <button class="rate-btn" data-rate="good"><strong>Gut</strong><br><small>1 Tag [3]</small></button>
        <button class="rate-btn" data-rate="easy"><strong>Leicht</strong><br><small>4 Tage [4]</small></button>
      </div>
    </section>
  </main>
  <script>
    const CARDS = ${cardsJson};
    let currentIndex = 0;
    let isFlipped = false;
    let activeCards = [...CARDS];
    let srs = JSON.parse(localStorage.getItem('wortschatz_srs_v1') || '{}');

    function speak(text) {
      if (!('speechSynthesis' in window)) return;
      window.speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(text);
      u.lang = 'de-DE';
      u.rate = 0.94;
      window.speechSynthesis.speak(u);
    }

    function renderCard() {
      const c = activeCards[currentIndex];
      if (!c) return;
      const inner = document.getElementById('cardInner');
      inner.classList.toggle('is-flipped', isFlipped);
      document.getElementById('progressLabel').textContent = 'Karte ' + (currentIndex + 1) + ' von ' + activeCards.length;
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
      let grammarHtml = '';
      if (c.verbDetails) {
        grammarHtml = \`<div>Präsens: <strong>\${c.verbDetails.praesens}</strong> · Präteritum: <strong>\${c.verbDetails.praeteritum}</strong> · Perfekt: <strong>\${c.verbDetails.perfekt}</strong> (Hilfsverb: \${c.verbDetails.auxiliary})</div>\`;
      } else if (c.nounDetails) {
        grammarHtml = \`<div>Genus: <strong>\${c.nounDetails.gender} (\${c.nounDetails.genderLabel})</strong> · Plural: <strong>\${c.nounDetails.plural}</strong></div>\`;
      } else if (c.prepDetails) {
        grammarHtml = \`<div>Kasus: <strong>\${c.prepDetails.governedCase}</strong> · \${c.prepDetails.collocations.join(' · ')}</div>\`;
      }
      document.getElementById('cardBack').innerHTML = \`
        <div style="font-size:0.85rem;color:var(--text-muted);">\${c.lemma} · \${c.cefr}</div>
        <div>
          <div style="font-size:1.5rem;font-weight:600;margin-bottom:0.75rem;">\${c.translation}</div>
          <div style="font-size:0.9rem;padding:0.75rem;background:var(--surface-subtle);border-radius:8px;margin-bottom:0.75rem;">\${grammarHtml}</div>
          <div style="font-size:1.02rem;font-weight:500;line-height:1.6;margin-bottom:0.25rem;">„\${c.exampleDe}“</div>
          <div style="font-size:0.875rem;line-height:1.5;color:var(--text-muted);">\${c.exampleEn}</div>
        </div>
        <div style="font-size:0.75rem;color:var(--text-muted);">Bewertung wählen (Tasten 1–4)</div>
      \`;
    }

    function rateCard(rating) {
      const c = activeCards[currentIndex];
      if (!c) return;
      const prev = srs[c.id] || { intervalMinutes: 0, reviewCount: 0 };
      const mult = rating === 'again' ? 1 : rating === 'hard' ? 6 : rating === 'good' ? 10 : 11520;
      const nextInterval = prev.reviewCount === 0
        ? mult
        : rating === 'again'
        ? 5
        : Math.max(1440, Math.round((prev.intervalMinutes || 1440) * (rating === 'hard' ? 1.2 : rating === 'good' ? 2.5 : 3.5)));
      srs[c.id] = {
        cardId: c.id,
        intervalMinutes: nextInterval,
        reviewCount: (prev.reviewCount || 0) + 1,
        dueDate: new Date(Date.now() + nextInterval * 60000).toISOString(),
        lastRating: rating,
      };
      localStorage.setItem('wortschatz_srs_v1', JSON.stringify(srs));
      isFlipped = false;
      currentIndex = (currentIndex + 1) % activeCards.length;
      renderCard();
    }

    document.querySelectorAll('.rate-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        const r = btn.getAttribute('data-rate');
        if (r) rateCard(r);
      });
    });

    document.getElementById('cardInner').addEventListener('click', () => {
      isFlipped = !isFlipped;
      renderCard();
    });

    window.addEventListener('keydown', (e) => {
      if (e.code === 'Space') { e.preventDefault(); isFlipped = !isFlipped; renderCard(); }
      if (e.key === '1') { e.preventDefault(); rateCard('again'); }
      if (e.key === '2') { e.preventDefault(); rateCard('hard'); }
      if (e.key === '3') { e.preventDefault(); rateCard('good'); }
      if (e.key === '4') { e.preventDefault(); rateCard('easy'); }
      if (e.key.toLowerCase() === 'a') { const c = activeCards[currentIndex]; if (c) speak(c.spokenText); }
      if (e.key === 'ArrowRight') { currentIndex = (currentIndex + 1) % activeCards.length; isFlipped = false; renderCard(); }
      if (e.key === 'ArrowLeft') { currentIndex = (currentIndex - 1 + activeCards.length) % activeCards.length; isFlipped = false; renderCard(); }
    });

    renderCard();
  </script>
</body>
</html>`;
}
