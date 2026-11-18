import { CONFIG } from '../config.js';
import { $, esc } from '../lib/dom.js';
import { player } from '../lib/player.js';

export default function juegos() {
  return {
    html: `
      <section class="s sea">
        <h2>Wedding Game</h2>
        <p class="sub">¿Quién conoce mejor a los novios?</p>
        <div class="big-emoji" aria-hidden="true">🤵👰🐶</div>

        <label class="field-label" for="jugador">Tu nombre para el ranking</label>
        <input type="text" id="jugador" maxlength="30" placeholder="Tu nombre" autocomplete="given-name"
          value="${esc(player.name)}">

        <a class="btn btn--sun play-cta" href="#trivia">▶ Jugar</a>

        <p class="strong">Otros juegos:</p>
        <div class="mini">
          <a href="#tesla"><span aria-hidden="true">🔍</span>Encuentra a ${esc(CONFIG.perro)}</a>
          <a href="#bingo"><span aria-hidden="true">🎯</span>Bingo de la Boda</a>
          <a href="#marina"><span aria-hidden="true">🐙</span>Trivia Marina</a>
        </div>
      </section>`,

    mount(root) {
      const input = $('#jugador', root);
      input.addEventListener('input', () => { player.name = input.value; });
    },
  };
}
