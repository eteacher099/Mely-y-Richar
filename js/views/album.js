import { $, esc } from '../lib/dom.js';
import { storage } from '../lib/storage.js';

const MAX_SIDE = 600;   // px del lado mayor tras comprimir
const QUALITY = 0.7;    // calidad JPEG

function loadImage(file) {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => { URL.revokeObjectURL(url); resolve(img); };
    img.onerror = () => { URL.revokeObjectURL(url); reject(new Error('imagen inválida')); };
    img.src = url;
  });
}

/** Reduce la foto y la devuelve como data URL JPEG (para que quepa en localStorage). */
async function compress(file) {
  const img = await loadImage(file);
  const k = Math.min(1, MAX_SIDE / Math.max(img.width, img.height));
  const canvas = document.createElement('canvas');
  canvas.width = Math.round(img.width * k);
  canvas.height = Math.round(img.height * k);
  canvas.getContext('2d').drawImage(img, 0, 0, canvas.width, canvas.height);
  return canvas.toDataURL('image/jpeg', QUALITY);
}

export default function album() {
  const photos = storage.get('fotos', []);
  const gridHtml = () => photos.map(src => `<img src="${esc(src)}" alt="Foto del álbum" loading="lazy">`).join('');

  return {
    html: `
      <section class="s sea">
        <h2>Nuestro Álbum</h2>
        <p class="sub">Comparte tus fotos y videos</p>
        <label class="drop">
          <span class="drop-icon" aria-hidden="true">📷</span><br>
          <b>Sube tus recuerdos</b><br>
          <small>Toca para elegir fotos</small>
          <input type="file" id="fi" accept="image/*" multiple hidden>
        </label>
        <div class="grid" id="grid">${gridHtml()}</div>
      </section>`,

    mount(root) {
      const grid = $('#grid', root);
      $('#fi', root).addEventListener('change', async e => {
        const input = e.target;
        const added = [];
        for (const file of input.files) {
          try { added.push(await compress(file)); } catch { /* archivo no legible: se omite */ }
        }
        input.value = '';
        if (!added.length) return;

        photos.unshift(...added);
        if (!storage.set('fotos', photos)) {
          photos.splice(0, added.length);
          alert('No hay espacio para más fotos en este dispositivo.');
        }
        if (grid.isConnected) grid.innerHTML = gridHtml();
      });
    },
  };
}
