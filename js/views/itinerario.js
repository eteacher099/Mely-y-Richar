import { CONFIG } from '../config.js';
import { $, esc } from '../lib/dom.js';
import { icon } from '../lib/icons.js';

const UNITS = [['días', 864e5], ['hrs', 36e5], ['min', 6e4], ['seg', 1e3]];

export default function itinerario() {
  return {
    html: `
      <section class="s sea">
        <img class="deco it-starfish" src="img/starfish.svg" alt="">
        <h2>Itinerario</h2>
        <p class="sub">¡No te pierdas ningún momento!</p>
        <ul class="tl">
          ${CONFIG.itinerario.map(([emoji, hora, actividad]) => `
            <li><i aria-hidden="true">${esc(emoji)}</i><span><b>${esc(hora)}</b>${esc(actividad)}</span></li>`).join('')}
        </ul>
        <div class="card card--sand card--center">
          <b class="cd-title">${icon('clock', 20)} Cuenta regresiva</b>
          <div class="cd" id="cd"></div>
        </div>
      </section>`,

    mount(root) {
      const el = $('#cd', root);
      const target = new Date(CONFIG.fecha).getTime();

      const tick = () => {
        let left = target - Date.now();
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
