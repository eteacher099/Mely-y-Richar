import { CONFIG } from '../config.js';
import { esc } from '../lib/dom.js';

export default function info() {
  return {
    html: `
      <section class="s sea">
        <h2>Información</h2>
        <div class="card">
          <b class="card-title">👔 Dress code</b><br>${esc(CONFIG.vestimenta)}
        </div>
        <div class="card">
          <b class="card-title">📍 ¿Cómo llegar?</b><br>${esc(CONFIG.lugar)}<br>
          <a class="link" href="${esc(CONFIG.mapa)}" target="_blank" rel="noopener">Mapa aquí ↗</a>
        </div>
        <div class="card">
          <b class="card-title">❓ Preguntas frecuentes</b>
          ${CONFIG.faq.map(([q, a]) => `<details><summary>${esc(q)}</summary><p>${esc(a)}</p></details>`).join('')}
        </div>
        <div class="info-deco" aria-hidden="true">⛵🗼</div>
      </section>`,
  };
}
