import { CONFIG } from '../config.js';
import { esc } from '../lib/dom.js';
import { icon } from '../lib/icons.js';

const rsvpUrl = () => `https://wa.me/${CONFIG.rsvp.whatsapp}?text=${encodeURIComponent(CONFIG.rsvp.mensaje)}`;
const external = (url, text) => `<a class="link" href="${esc(url)}" target="_blank" rel="noopener">${esc(text)}</a>`;

export default function info() {
  return {
    html: `
      <section class="s sea">
        ${icon('info', 60, 'view-icon')}
        <h2>Información</h2>

        <div class="info-row">
          <span class="info-ic" aria-hidden="true">👗</span>
          <div>
            <h3>Dress code</h3>
            ${CONFIG.vestimenta.map(v => `
              <p class="dress"><b>${esc(v.dia)}: ${esc(v.estilo)}</b><br><small>${esc(v.tip)}</small></p>`).join('')}
          </div>
        </div>

        <div class="info-row">
          <span class="info-ic">${icon('pin', 34)}</span>
          <div>
            <h3>¿Cómo llegar?</h3>
            ${Object.values(CONFIG.lugares).map(l => `
              <p class="place"><b>${esc(l.nombre)}</b> · <small>${esc(l.detalle)}</small><br>${external(l.mapa, 'Ver mapa ↗')}</p>`).join('')}
          </div>
        </div>

        <a class="card menu-card" href="#carta">
          <span class="info-ic" aria-hidden="true">🍽️</span>
          <span><b>Menú de la cena</b><br><small>Elige tu plato principal y postre</small></span>
        </a>

        <div class="info-row">
          <span class="info-ic" aria-hidden="true">🧳</span>
          <div>
            <h3>Planifica tu viaje</h3>
            ${CONFIG.viaje.map(([titulo, texto, links]) => `
              <p class="trip"><b>${esc(titulo)}</b><br><small>${esc(texto)}</small><br>
                ${links.map(([n, u]) => external(u, n)).join(' · ')}</p>`).join('')}
          </div>
        </div>

        <div class="info-row">
          <span class="info-ic navy">${icon('help', 36)}</span>
          <div>
            <h3>Preguntas frecuentes</h3>
            ${CONFIG.faq.map(([q, a]) => `<details><summary>${esc(q)}</summary><p>${esc(a)}</p></details>`).join('')}
          </div>
        </div>

        <a class="btn btn--sun rsvp" href="${esc(rsvpUrl())}" target="_blank" rel="noopener">✅ Confirma tu asistencia</a>
        <p class="sub rsvp-note">Nos vemos en Cartagena…</p>

        <img class="info-scene" src="img/lighthouse.svg" alt="">
      </section>`,
  };
}
