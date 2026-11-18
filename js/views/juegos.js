import { CONFIG } from '../config.js';
import { $, esc } from '../lib/dom.js';
import { icon } from '../lib/icons.js';
import { player } from '../lib/player.js';

export default function juegos() {
  return {
    html: `
      <section class="s sea">
        <img class="deco hub-palm-l" src="img/palm.svg" alt="">
        <img class="deco hub-palm-r" src="img/palm.svg" alt="">
        <h2>Wedding Game</h2>
        <p class="sub">¿Quién conoce mejor a los novios?</p>
        <img class="hub-art" src="${esc(CONFIG.portada || 'img/couple.svg')}" alt="">

        <a class="btn btn--sun btn--big play-cta" href="#trivia">${icon('play', 30)}Jugar</a>

        <label class="field-label" for="jugador">Tu nombre para el ranking</label>
        <input type="text" id="jugador" maxlength="30" placeholder="Tu nombre" autocomplete="given-name"
          value="${esc(player.name)}">

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
      input.addEventListener('input', () => { player.name = input.value; });
    },
  };
}
