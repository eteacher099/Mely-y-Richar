import { CONFIG } from '../config.js';
import { $, esc } from '../lib/dom.js';

const FALLBACK_EMOJI = '🐶';

export default function home() {
  const [first, second] = CONFIG.nombres.map(esc);
  const cover = CONFIG.portada;

  return {
    bar: false,
    html: `
      <section class="s hero">
        <span class="sun-deco" aria-hidden="true">☀️</span>
        <span class="tropical palm-left" aria-hidden="true">🌴</span>
        <span class="tropical flower-right" aria-hidden="true">🌺</span>

        <h1 class="home-names">
          <span class="name-line-one">${first} <span>&amp;</span> <span class="heart" aria-hidden="true">♥</span></span>
          <span class="name-line-two">${second}</span>
        </h1>

        <p class="home-subtitle">Nuestra Boda</p>
        <p class="home-tagline">Una aventura juntos</p>

        <div class="home-illustration" id="pic" role="img" aria-label="Ilustración de los novios"
          style="${cover ? `background-image:url('${esc(cover)}')` : ''}">${cover ? '' : FALLBACK_EMOJI}</div>

        <a class="btn home-enter" href="#itin">Entrar →</a>
        <span class="starfish" aria-hidden="true">⭐</span>
      </section>`,

    mount(root) {
      if (!cover) return;
      const pic = $('#pic', root);
      const probe = new Image();
      probe.onerror = () => {
        pic.style.backgroundImage = '';
        pic.textContent = FALLBACK_EMOJI;
      };
      probe.src = cover;
    },
  };
}
