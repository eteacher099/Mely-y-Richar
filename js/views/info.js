import { CONFIG } from '../config.js';
import { esc } from '../lib/dom.js';
import { icon } from '../lib/icons.js';

export default function info() {
  return {
    html: `
      <section class="s sea">
        ${icon('info', 60, 'view-icon')}
        <h2>Información</h2>

        <div class="info-row">
          <span class="info-ic" aria-hidden="true">👔</span>
          <div><h3>Dress code</h3>${esc(CONFIG.vestimenta)}</div>
        </div>

        <div class="info-row">
          <span class="info-ic">${icon('pin', 34)}</span>
          <div>
            <h3>¿Cómo llegar?</h3>${esc(CONFIG.lugar)}<br>
            <a class="link" href="${esc(CONFIG.mapa)}" target="_blank" rel="noopener">Mapa aquí ↗</a>
          </div>
        </div>

        <div class="info-row">
          <span class="info-ic navy">${icon('help', 36)}</span>
          <div>
            <h3>Preguntas frecuentes</h3>
            ${CONFIG.faq.map(([q, a]) => `<details><summary>${esc(q)}</summary><p>${esc(a)}</p></details>`).join('')}
          </div>
        </div>

        <img class="info-scene" src="img/lighthouse.svg" alt="">
      </section>`,
  };
}
