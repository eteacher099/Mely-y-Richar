import { CONFIG } from '../config.js';
import { $, esc } from '../lib/dom.js';
import { submitScore } from '../lib/scores.js';
import { icon } from '../lib/icons.js';
import { scorePanelHtml, mountScorePanel } from '../components/score-panel.js';

/* ------------------------------------------------------------------
   Reglas del juego
   ------------------------------------------------------------------ */
const GAME_SECONDS = 60;
const LIVES = 3;

/** Emojis de playa (claros, fáciles de descartar). */
const LIGHT = ['🌴', '⛱️', '🐚', '🦀', '🏄', '🏖️', '🏐', '🌺', '⭐', '🪣', '🦩', '🐢', '🐠', '🍹', '🥥', '🕶️', '👙', '🩴', '🐬', '⚓'];
/** Animales y cosas oscuras que se confunden con Tesla (un bulldog negro). */
const DARK = ['🦅', '🐜', '🐒', '🫏', '🐈‍⬛', '🦍', '🐦‍⬛', '🦇', '🕷️', '🐻', '🦬', '🐗', '🐃', '🦫', '🐀', '🐧', '🦉', '🐌'];
/** Otros perros: solo en niveles altos. */
const LOOKALIKES = ['🐕‍⬛', '🐕', '🐩', '🐾'];

/**
 * Dificultad de cada nivel (nivel = perritos encontrados + 1).
 * Sube: cantidad de distractores, proporción de emojis oscuros, perros parecidos,
 * tamaño más pequeño, Tesla puede quedar tapado y girado.
 */
export function levelSettings(level) {
  const L = Math.max(1, Math.floor(level));
  return {
    decoys: Math.min(10 + (L - 1) * 5, 70),
    darkRatio: L < 2 ? 0 : Math.min(0.15 * (L - 1), 0.75),
    lookalikes: L >= 6 ? Math.min(L - 5, 6) : 0,
    minSize: Math.max(16, 26 - L),           // px de los distractores
    maxSize: Math.max(24, 38 - L),
    dogSize: Math.max(16, 34 - L * 1.6),     // px base de Tesla (la imagen mide 1.35em)
    covered: L >= 4,                         // Tesla puede quedar debajo de otros emojis
    rotate: L >= 5 ? Math.min(12 * (L - 4), 70) : 0,   // giro máximo en grados
  };
}

/**
 * Puntos por encontrar a Tesla: nivel × (50 + bono de rapidez de hasta 150).
 * Encontrarlo al instante en nivel 1 = 200; tardar 10 s o más = 50 × nivel.
 */
export function pointsFor(level, ms) {
  const speed = Math.max(0, 1 - ms / 10000);
  return Math.round(level * (50 + 150 * speed));
}

const pick = list => list[Math.floor(Math.random() * list.length)];
const rand = (min, max) => min + Math.random() * (max - min);
const shuffle = arr => {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
};

/* ------------------------------------------------------------------
   Vista
   ------------------------------------------------------------------ */
export default function tesla() {
  return {
    bar: false,
    html: `
      <section class="s s--compact tesla-screen">
        <div class="hud">
          <span id="hp" aria-label="Vidas"></span>
          <b class="pill pill--sun" id="lv"></b>
          <b class="pill" id="pt"></b>
        </div>
        <h2 class="banner">¡Encuentra a ${esc(CONFIG.perro)}!</h2>
        <p class="sub">Cada vez que lo encuentras sube el nivel. ¡Entre más rápido, más puntos! 🐾</p>
        <div class="beach" id="bc"></div>
        <div class="pill">${icon('clock', 20)}<span id="ck"></span></div>
        <div id="tesla-result"></div>
        <div class="game-actions"><a class="btn" href="#juego">Volver a juegos</a></div>
      </section>`,

    mount(root) {
      const beach = $('#bc', root);
      const result = $('#tesla-result', root);
      const startedAt = Date.now();
      let lives = LIVES;
      let points = 0;
      let level = 1;
      let secondsLeft = GAME_SECONDS;
      let roundStart = 0;
      let over = false;
      const findTimes = [];

      const hud = () => {
        $('#hp', root).textContent = '❤️'.repeat(lives) + '🤍'.repeat(LIVES - lives);
        $('#lv', root).textContent = `Nivel ${level}`;
        $('#pt', root).textContent = `Puntos: ${points}`;
        $('#ck', root).textContent = over ? `¡Fin! ${points} puntos` : `${secondsLeft} segundos`;
      };

      /** Texto flotante "+840 · 1.8 s" donde se tocó. */
      const floatText = (x, y, text, cls) => {
        const f = document.createElement('i');
        f.className = `float ${cls}`;
        f.textContent = text;
        f.style.left = `${x}px`;
        f.style.top = `${y}px`;
        beach.appendChild(f);
        f.addEventListener('animationend', () => f.remove());
      };

      const makeItem = (content, kind, size, maxRotate) => {
        const s = document.createElement('span');
        s.dataset.k = kind;
        if (kind === 'dog') s.innerHTML = `<img class="dog" src="img/tesla.svg" alt="${esc(CONFIG.perro)}">`;
        else s.textContent = content;
        s.style.left = `${rand(0, 88)}%`;
        s.style.top = `${rand(4, 89)}%`;
        s.style.fontSize = `${size}px`;
        if (maxRotate) s.style.transform = `rotate(${rand(-maxRotate, maxRotate)}deg)`;
        return s;
      };

      const newRound = () => {
        const cfg = levelSettings(level);
        const dark = Math.round(cfg.decoys * cfg.darkRatio);
        const emojis = [
          ...Array.from({ length: cfg.lookalikes }, () => pick(LOOKALIKES)),
          ...Array.from({ length: dark }, () => pick(DARK)),
        ];
        while (emojis.length < cfg.decoys) emojis.push(pick(LIGHT));

        const items = shuffle(emojis).map(e => makeItem(e, 'decoy', rand(cfg.minSize, cfg.maxSize), cfg.rotate));
        const dog = makeItem(null, 'dog', cfg.dogSize, cfg.rotate);
        // Niveles bajos: Tesla siempre encima. Altos: en cualquier capa (puede quedar tapado).
        const at = cfg.covered ? Math.floor(Math.random() * (items.length + 1)) : items.length;
        items.splice(at, 0, dog);

        beach.replaceChildren(...items);
        roundStart = performance.now();
      };

      const end = () => {
        if (over) return;
        over = true;
        clearInterval(clock);
        hud();
        const avg = findTimes.length ? findTimes.reduce((a, b) => a + b, 0) / findTimes.length / 1000 : null;
        result.innerHTML = `
          <p class="tesla-summary">Nivel alcanzado: <b>${level}</b>${avg != null ? ` · Tiempo promedio: <b>${avg.toFixed(1)} s</b>` : ''}</p>
          ${scorePanelHtml()}`;
        mountScorePanel(result, 'tesla', submitScore({
          game: 'tesla', score: points, level, durationMs: Date.now() - startedAt,
        }));
      };

      beach.addEventListener('click', e => {
        const target = e.target.closest('[data-k]');
        const kind = target?.dataset.k;
        if (over || !kind) return;

        const box = beach.getBoundingClientRect();
        const x = e.clientX - box.left;
        const y = e.clientY - box.top;

        if (kind === 'dog') {
          const ms = performance.now() - roundStart;
          const gained = pointsFor(level, ms);
          findTimes.push(ms);
          points += gained;
          level++;
          newRound();
          floatText(x, y, `+${gained} · ${(ms / 1000).toFixed(1)} s`, 'float--ok');
        } else {
          lives--;
          target.remove();
          floatText(x, y, '✗', 'float--bad');
          if (lives <= 0) return end();
        }
        hud();
      });

      const clock = setInterval(() => {
        secondsLeft--;
        if (secondsLeft <= 0) {
          secondsLeft = 0;
          end();
          return;
        }
        hud();
      }, 1000);

      newRound();
      hud();
      return () => clearInterval(clock);
    },
  };
}
