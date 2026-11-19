/**
 * Menú de boda (cena del Día 1). Estilo del PDF menu_boda_mely_richar_19122026.pdf.
 * El invitado elige plato + postre y la elección se guarda en Google Sheets (lib/menu.js).
 */
import { CONFIG, coupleName } from '../config.js';
import { $, esc } from '../lib/dom.js';
import { player } from '../lib/player.js';
import { saveMenuChoice, savedMenuChoice } from '../lib/menu.js';
import { spinner } from '../components/spinner.js';

const DATE_DOTS = '19 · 12 · 2026';
const DATE_SHORT = '19.12.2026';

const MESSAGES = {
  sent: '✓ ¡Guardado! Puedes cambiar tu elección cuando quieras.',
  local: '✓ Elección guardada en este dispositivo.',
  queued: '📶 Sin conexión: enviaremos tu elección cuando vuelva el internet.',
  rejected: 'No pudimos guardar tu elección 😕 Inténtalo de nuevo o escríbenos por WhatsApp.',
};

const option = (group, [name, desc], checked) => `
  <label class="mn-opt">
    <input type="radio" name="${group}" value="${esc(name)}" ${checked ? 'checked' : ''}>
    <span class="mn-mark" aria-hidden="true"></span>
    <span class="mn-text"><b>${esc(name)}</b>${desc ? `<small>${esc(desc)}</small>` : ''}</span>
  </label>`;

function whatsappUrl(choice) {
  const text = [
    `Hola, soy ${choice.nombre}.`,
    `Plato principal: ${choice.plato}`,
    `Postre: ${choice.postre}`,
    `Alergias o restricciones: ${choice.restricciones || 'Ninguna'}`,
  ].join('\n');
  return `https://wa.me/${CONFIG.menu.whatsapp}?text=${encodeURIComponent(text)}`;
}

export default function menu() {
  const saved = savedMenuChoice() ?? {};
  const upper = esc(coupleName.toUpperCase());

  return {
    wave: false,
    html: `
      <section class="s menu-screen">
        <div class="mn-frame">
          <header class="mn-head">
            <p class="mn-couple">${upper}</p>
            <p class="mn-kicker">${DATE_DOTS}</p>
            <h2 class="mn-title">Menú de boda</h2>
            <p class="mn-lead">Una selección para disfrutar y celebrar</p>
            <hr class="mn-rule">
          </header>

          <form id="mn-form" novalidate>
            <fieldset class="mn-section">
              <legend class="mn-h3">Plato principal</legend>
              <p class="mn-note">Elige una sola opción.</p>
              <div class="mn-list">
                ${CONFIG.menu.principales.map(p => option('plato', p, saved.plato === p[0])).join('')}
              </div>
            </fieldset>

            <hr class="mn-divider">

            <header class="mn-head">
              <p class="mn-couple">${upper}</p>
              <p class="mn-kicker">EL TOQUE FINAL</p>
              <h3 class="mn-title">Postres</h3>
              <p class="mn-lead">Un dulce final para acompañar la celebración</p>
              <hr class="mn-rule">
            </header>

            <fieldset class="mn-section">
              <legend class="mn-note">Elige una sola opción.</legend>
              <div class="mn-list mn-list--desserts">
                ${CONFIG.menu.postres.map(p => option('postre', p, saved.postre === p[0])).join('')}
              </div>
            </fieldset>

            <hr class="mn-divider">

            <div class="mn-section mn-confirm">
              <h3 class="mn-h3">¿Cómo confirmar?</h3>
              <p class="mn-note">Completa tus datos y guarda tu elección:</p>
              <label class="mn-field">
                <span>Tu nombre completo</span>
                <input type="text" name="nombre" maxlength="60" autocomplete="name" required
                  value="${esc(saved.nombre ?? player.name)}">
              </label>
              <label class="mn-field">
                <span>Alergias, restricciones o ingredientes a tener en cuenta</span>
                <textarea name="restricciones" maxlength="300" rows="3" placeholder="Opcional">${esc(saved.restricciones ?? '')}</textarea>
              </label>
              <button type="submit" class="mn-btn">Guardar mi elección</button>
              <p class="mn-status" id="mn-status" aria-live="polite"></p>
              <p id="mn-wa"></p>
              <hr class="mn-rule">
              <p class="mn-lead">Nos hace mucha ilusión celebrar contigo.</p>
            </div>
          </form>
        </div>
        <p class="mn-foot">${upper} · ${DATE_SHORT}</p>
      </section>`,

    mount(root) {
      const form = $('#mn-form', root);
      const status = $('#mn-status', root);
      const wa = $('#mn-wa', root);

      form.addEventListener('submit', async e => {
        e.preventDefault();
        const data = new FormData(form);
        const choice = {
          nombre: String(data.get('nombre') || '').trim(),
          plato: data.get('plato'),
          postre: data.get('postre'),
          restricciones: String(data.get('restricciones') || '').trim(),
        };

        const missing = [!choice.nombre && 'tu nombre', !choice.plato && 'un plato principal', !choice.postre && 'un postre'].filter(Boolean);
        if (missing.length) {
          status.className = 'mn-status is-error';
          status.textContent = `Falta elegir ${missing.join(', ')}.`;
          return;
        }

        if (!player.name) player.name = choice.nombre.split(' ')[0];
        const btn = form.querySelector('.mn-btn');
        btn.disabled = true;
        status.className = 'mn-status';
        status.innerHTML = spinner('Guardando tu elección…');

        const { status: result } = await saveMenuChoice(choice);
        if (!status.isConnected) return;
        btn.disabled = false;
        status.className = `mn-status ${result === 'rejected' ? 'is-error' : 'is-ok'}`;
        status.textContent = MESSAGES[result];
        wa.innerHTML = CONFIG.menu.whatsapp
          ? `<a class="mn-wa" href="${esc(whatsappUrl(choice))}" target="_blank" rel="noopener">Enviar también por WhatsApp</a>`
          : '';
      });
    },
  };
}
