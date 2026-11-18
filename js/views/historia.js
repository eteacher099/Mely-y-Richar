import { CONFIG } from '../config.js';
import { esc } from '../lib/dom.js';
import { icon } from '../lib/icons.js';

export default function historia() {
  return {
    html: `
      <section class="s sea">
        <img class="deco pl-hibiscus" src="img/hibiscus.svg" alt="">
        <h2>Nuestra historia</h2>
        <p class="sub">${esc(CONFIG.intro)}</p>
        <img class="story-art" src="${esc(CONFIG.portada || 'img/couple.svg')}" alt="">
        <div class="card story">
          ${CONFIG.historia.map(p => `<p>${esc(p)}</p>`).join('')}
        </div>
        <a class="btn btn--sun" href="#itin">${icon('clock', 22)}Ver itinerario</a>
      </section>`,
  };
}
