import { CONFIG } from '../config.js';
import { $, esc } from '../lib/dom.js';
import { icon } from '../lib/icons.js';
import { player } from '../lib/player.js';
import { nameError } from '../components/name-gate.js';
import { spinner } from '../components/spinner.js';
import { apiEnabled } from '../lib/api.js';
import { getLeaderboard } from '../lib/scores.js';

/**
 * Columnas del top en el hub: [id del juego, título corto].
 * Solo los juegos que generan puntaje, en el mismo orden que los íconos de "Otros juegos"
 * (Tesla, [Bingo: sin puntaje], Trivia Marina). Para sumar otro juego, agrégalo aquí.
 */
const BOARDS = [['tesla', 'Encuentra a Tesla'], ['marina', 'Trivia Marina']];
const TOP = 5;

const boardHtml = rows => rows.length
  ? `<ol class="rank-mini">${rows.map(r => `
      <li class="${r.me ? 'me' : ''}">
        <span class="rm-pos">${esc(r.pos)}</span>
        <span class="rm-name" title="${esc(r.nombre)}">${esc(r.nombre)}</span>
        <b class="rm-score">${esc(r.puntaje)}</b>
      </li>`).join('')}</ol>`
  : '<p class="rm-empty">¡Sé el primero! 🏁</p>';

export default function juegos() {
  return {
    html: `
      <section class="s sea">
        <img class="deco hub-palm-l" src="img/palm.svg" alt="">
        <img class="deco hub-palm-r" src="img/palm.svg" alt="">
        <h2>Wedding Game</h2>
        <p class="sub">¿Quién conoce mejor a los novios?</p>
        <div class="hub-trio">
          <img class="trio-richar" src="img/richar.svg" alt="Richar">
          <img class="trio-tesla" src="img/tesla.svg" alt="${esc(CONFIG.perro)}">
          <img class="trio-mely" src="img/mely.svg" alt="Mely">
        </div>

        <a class="btn btn--sun btn--big play-cta" href="#trivia">${icon('play', 30)}Jugar</a>

        <label class="field-label" for="jugador">Tu nombre para el ranking <span aria-hidden="true">*</span></label>
        <input type="text" id="jugador" maxlength="30" placeholder="Tu nombre (obligatorio)" autocomplete="given-name"
          required aria-describedby="jugador-error" value="${esc(player.name)}">
        <p class="form-error" id="jugador-error" aria-live="polite"></p>

        <div class="games-card">
          <p class="strong">Otros juegos:</p>
          <div class="mini">
            <a href="#tesla"><span aria-hidden="true">🔍</span>Encuentra a ${esc(CONFIG.perro)}</a>
            <a href="#bingo"><span aria-hidden="true">🎯</span>Bingo de la Boda</a>
            <a href="#marina"><span aria-hidden="true">🐙</span>Trivia Marina</a>
          </div>
        </div>

        ${apiEnabled ? `
        <div class="hub-rankings" aria-label="Top de jugadores">
          <p class="strong">🏆 Top jugadores</p>
          <div class="rank-cols">
            ${BOARDS.map(([game, label]) => `
              <div class="rank-col" data-board="${game}">
                <b class="rank-title">${esc(label)}</b>
                <div class="rank-body">${spinner('Cargando…', { small: true })}</div>
              </div>`).join('')}
          </div>
        </div>` : ''}
      </section>`,

    mount(root) {
      const input = $('#jugador', root);
      const error = $('#jugador-error', root);
      input.addEventListener('input', () => {
        player.name = input.value;
        if (!nameError(input.value)) {
          error.textContent = '';
          input.removeAttribute('aria-invalid');
        }
      });

      // Top de cada juego (mismo endpoint 'leaderboard' del Apps Script, en paralelo)
      BOARDS.forEach(([game]) => {
        const body = root.querySelector(`[data-board="${game}"] .rank-body`);
        if (!body) return;
        getLeaderboard(game, TOP)
          .then(rows => { if (body.isConnected) body.innerHTML = boardHtml(rows); })
          .catch(() => { if (body.isConnected) body.innerHTML = '<p class="rm-empty">Sin conexión</p>'; });
      });

      // Sin nombre no se entra a los juegos con ranking (el bingo no lleva puntaje).
      root.addEventListener('click', e => {
        const link = e.target.closest('a[href="#trivia"], a[href="#marina"], a[href="#tesla"]');
        if (!link) return;
        const msg = nameError(input.value);
        if (!msg) return;
        e.preventDefault();
        error.textContent = msg;
        input.setAttribute('aria-invalid', 'true');
        input.focus();
        input.scrollIntoView({ block: 'center', behavior: 'smooth' });
      });
    },
  };
}
