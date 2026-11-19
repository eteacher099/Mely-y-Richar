/**
 * Álbum compartido. Las fotos y videos se suben a un servicio externo (Drive, Google Fotos o
 * un Google Form) cuyo link se configura en CONFIG.album. Mientras no haya link: "Muy pronto".
 *
 * Antes las fotos se guardaban comprimidas en localStorage (solo las veía quien las subía y
 * cabían ~5 MB). Si este teléfono tiene fotos de esa versión, se muestran para no perderlas.
 */
import { CONFIG } from '../config.js';
import { $, esc } from '../lib/dom.js';
import { storage } from '../lib/storage.js';
import { icon } from '../lib/icons.js';

const LEGACY_KEY = 'fotos';

const linkBtn = (url, text, cls = '') =>
  `<a class="btn btn--block ${cls}" href="${esc(url)}" target="_blank" rel="noopener">${text}</a>`;

function shareHtml() {
  const { subir, ver, nota } = CONFIG.album ?? {};
  if (!subir) {
    return `
      <div class="card card--center album-soon">
        <span class="album-soon-icon" aria-hidden="true">📸</span>
        <b>¡Muy pronto!</b>
        <p>Muy pronto podrás compartir aquí tus fotos y videos de la boda con todos.</p>
      </div>`;
  }
  return `
    <div class="album-actions">
      ${linkBtn(subir, `${icon('camera', 22)}Subir fotos y videos`, 'btn--sun')}
      ${ver ? linkBtn(ver, '🖼️ Ver el álbum') : ''}
      ${nota ? `<p class="album-note">${esc(nota)}</p>` : ''}
    </div>`;
}

function legacyHtml(photos) {
  if (!photos.length) return '';
  return `
    <div class="album-legacy">
      <p class="sent-title">Tus fotos en este teléfono</p>
      <div class="grid">${photos.map(src => `<img src="${esc(src)}" alt="Foto guardada en este teléfono" loading="lazy">`).join('')}</div>
      <button type="button" class="btn btn--block album-clear" id="album-clear">Borrar estas fotos del teléfono</button>
    </div>`;
}

export default function album() {
  const photos = storage.get(LEGACY_KEY, []);

  return {
    html: `
      <section class="s sea">
        <img class="deco al-shell" src="img/shell.svg" alt="">
        ${icon('camera', 64, 'view-icon')}
        <h2>Nuestro Álbum</h2>
        <p class="sub">Comparte tus fotos y videos</p>
        ${shareHtml()}
        <div id="album-legacy">${legacyHtml(photos)}</div>
      </section>`,

    mount(root) {
      $('#album-clear', root)?.addEventListener('click', () => {
        if (!window.confirm('¿Borrar las fotos guardadas en este teléfono? No se pueden recuperar.')) return;
        storage.set(LEGACY_KEY, []);
        $('#album-legacy', root).innerHTML = '';
      });
    },
  };
}
