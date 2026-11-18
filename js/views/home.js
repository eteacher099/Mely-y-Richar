import { CONFIG } from '../config.js';
import { $, esc } from '../lib/dom.js';
import { bird } from '../lib/icons.js';

const FALLBACK = 'img/couple.svg';

export default function home() {
  const [first, second] = CONFIG.nombres.map(esc);
  const cover = CONFIG.portada || FALLBACK;

  return {
    bar: false,
    wave: false,
    html: `
      <section class="s hero">
        <img class="deco hero-leaves" src="img/palm-leaves.svg" alt="">
        <img class="deco hero-palm" src="img/palm.svg" alt="">
        <img class="deco sun-deco" src="img/sun.svg" alt="">

        <h1 class="home-names">
          <span class="name-line-one">${first} <span class="amp">&amp;</span><span class="heart" aria-hidden="true">♥</span></span>
          <span class="name-line-two">${second}</span>
        </h1>
        <p class="home-subtitle">Nuestra Boda</p>
        <p class="home-tagline">Una aventura juntos</p>
        ${bird}

        <div class="home-art">
          <img class="home-illustration" id="pic" src="${esc(cover)}" alt="Ilustración de ${first}, ${second} y ${esc(CONFIG.perro)}">
          <a class="btn home-enter" href="#itin">Entrar →</a>
        </div>

        <img class="deco hero-hibiscus" src="img/hibiscus.svg" alt="">
        <img class="deco hero-starfish" src="img/starfish.svg" alt="">
      </section>`,

    mount(root) {
      // Si la portada configurada no existe, vuelve a la ilustración incluida.
      const pic = $('#pic', root);
      pic.addEventListener('error', () => { if (!pic.src.endsWith(FALLBACK)) pic.src = FALLBACK; }, { once: true });
    },
  };
}
