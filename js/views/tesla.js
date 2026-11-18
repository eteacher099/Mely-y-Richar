import { CONFIG } from '../config.js';
import { $, esc } from '../lib/dom.js';
import { submitScore } from '../lib/scores.js';
import { icon } from '../lib/icons.js';
import { scorePanelHtml, mountScorePanel } from '../components/score-panel.js';

const DECOYS = ['🌴', '⛱️', '🐚', '🦀', '🏄', '🏖️', '🏐', '🌺', '⭐', '🪣'];
const DECOY_COUNT = 22;
const GAME_SECONDS = 60;
const LIVES = 3;
const POINTS_PER_FIND = 100;

export default function tesla() {
  return {
    bar: false,
    html: `
      <section class="s s--compact tesla-screen">
        <div class="hud"><span id="hp"></span><b class="pill" id="pt"></b></div>
        <h2 class="banner">¡Encuentra a ${esc(CONFIG.perro)}!</h2>
        <p class="sub">Busca a nuestro perrito en la playa 🐾</p>
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
      let secondsLeft = GAME_SECONDS;
      let over = false;

      const hud = () => {
        $('#hp', root).textContent = '❤️'.repeat(lives) + '🤍'.repeat(LIVES - lives);
        $('#pt', root).textContent = `Puntos: ${points}`;
        $('#ck', root).textContent = over ? `¡Fin! ${points} puntos` : `${secondsLeft} segundos`;
      };

      const place = (emoji, kind) => {
        const s = document.createElement('span');
        if (kind === 'dog') s.innerHTML = `<img class="dog" src="img/tesla.svg" alt="${esc(CONFIG.perro)}">`;
        else s.textContent = emoji;
        s.dataset.k = kind;
        s.style.left = `${Math.random() * 88}%`;
        s.style.top = `${Math.random() * 85 + 4}%`;
        s.style.fontSize = `${22 + Math.random() * 14}px`;
        beach.appendChild(s);
      };

      const newRound = () => {
        beach.replaceChildren();
        for (let i = 0; i < DECOY_COUNT; i++) place(DECOYS[i % DECOYS.length], 'decoy');
        place(null, 'dog');
      };

      const end = () => {
        if (over) return;
        over = true;
        clearInterval(clock);
        hud();
        result.innerHTML = scorePanelHtml();
        mountScorePanel(result, 'tesla', submitScore({
          game: 'tesla', score: points, durationMs: Date.now() - startedAt,
        }));
      };

      beach.addEventListener('click', e => {
        const target = e.target.closest('[data-k]');
        const kind = target?.dataset.k;
        if (over || !kind) return;
        if (kind === 'dog') {
          points += POINTS_PER_FIND;
          newRound();
        } else {
          lives--;
          target.remove();
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
