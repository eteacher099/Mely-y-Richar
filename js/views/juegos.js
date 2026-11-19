import { CONFIG } from '../config.js';
import { $, esc } from '../lib/dom.js';
import { icon } from '../lib/icons.js';
import { player } from '../lib/player.js';
import { nameError } from '../components/name-gate.js';

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
