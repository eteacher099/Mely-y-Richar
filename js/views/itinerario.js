import { CONFIG } from '../config.js';
import { $, $$, esc } from '../lib/dom.js';
import { icon } from '../lib/icons.js';

const UNITS = [['días', 864e5], ['hrs', 36e5], ['min', 6e4], ['seg', 1e3]];

/** Fecha de hoy (AAAA-MM-DD) en hora de Colombia, para abrir la pestaña del día en curso. */
const todayInColombia = () => new Date(Date.now() - 5 * 36e5).toISOString().slice(0, 10);

function eventHtml(ev) {
  const place = ev.lugar && CONFIG.lugares[ev.lugar];
  const links = [
    place?.mapa && `<a class="link" href="${esc(place.mapa)}" target="_blank" rel="noopener">📍 Ver mapa</a>`,
    ev.link && `<a class="link" href="${esc(ev.link[0])}">${esc(ev.link[1])}</a>`,
  ].filter(Boolean).join(' · ');

  return `
    <li>
      <i aria-hidden="true">${esc(ev.icono)}</i>
      <span>
        <b class="tl-hora">${esc(ev.hora)}</b>
        <b class="tl-titulo">${esc(ev.titulo)}</b>
        ${ev.detalle ? `<small class="tl-detalle">${esc(ev.detalle)}</small>` : ''}
        ${links ? `<small class="tl-links">${links}</small>` : ''}
      </span>
    </li>`;
}

export default function itinerario() {
  const today = todayInColombia();
  const initial = Math.max(0, CONFIG.dias.findIndex(d => d.dia === today));

  return {
    html: `
      <section class="s sea">
        <img class="deco it-starfish" src="img/starfish.svg" alt="">
        <h2>Itinerario</h2>
        <p class="sub">¡No te pierdas ningún momento!</p>

        <div class="day-tabs" role="tablist" aria-label="Días de la boda">
          ${CONFIG.dias.map((d, i) => `
            <button type="button" role="tab" id="tab-${i}" aria-controls="day-${i}"
              aria-selected="${i === initial}" tabindex="${i === initial ? 0 : -1}">
              ${esc(d.titulo)} · ${esc(d.corto)}
            </button>`).join('')}
        </div>

        ${CONFIG.dias.map((d, i) => `
          <div class="day" role="tabpanel" id="day-${i}" aria-labelledby="tab-${i}" ${i === initial ? '' : 'hidden'}>
            <p class="day-date">${esc(d.fecha)}</p>
            <ul class="tl">${d.eventos.map(eventHtml).join('')}</ul>
          </div>`).join('')}

        <div class="card card--sand card--center">
          <b class="cd-title">${icon('clock', 20)} Cuenta regresiva</b>
          <div class="cd" id="cd"></div>
        </div>
      </section>`,

    mount(root) {
      // Pestañas
      const tabs = $$('[role=tab]', root);
      const select = i => {
        tabs.forEach((t, j) => {
          t.setAttribute('aria-selected', String(i === j));
          t.tabIndex = i === j ? 0 : -1;
          $(`#day-${j}`, root).hidden = i !== j;
        });
      };
      tabs.forEach((t, i) => {
        t.addEventListener('click', () => select(i));
        t.addEventListener('keydown', e => {
          if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
          const next = (i + (e.key === 'ArrowRight' ? 1 : -1) + tabs.length) % tabs.length;
          select(next);
          tabs[next].focus();
        });
      });

      // Cuenta regresiva
      const el = $('#cd', root);
      const start = new Date(CONFIG.fecha).getTime();
      const end = new Date(CONFIG.fin || CONFIG.fecha).getTime();

      const tick = () => {
        const now = Date.now();
        let left = start - now;
        if (now > end) {
          el.innerHTML = '<span class="cd-done">¡Gracias por celebrar con nosotros! 💙</span>';
          return;
        }
        if (left < 0) {
          el.innerHTML = '<span class="cd-done">¡Hoy es el gran día! 🎉</span>';
          return;
        }
        el.innerHTML = UNITS.map(([label, ms]) => {
          const value = Math.floor(left / ms);
          left -= value * ms;
          return `<div>${String(value).padStart(2, '0')}<small>${label}</small></div>`;
        }).join('');
      };

      tick();
      const id = setInterval(tick, 1000);
      return () => clearInterval(id);
    },
  };
}
