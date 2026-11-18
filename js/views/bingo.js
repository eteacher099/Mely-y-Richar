import { CONFIG } from '../config.js';
import { $, esc } from '../lib/dom.js';
import { storage } from '../lib/storage.js';

export default function bingo() {
  const marked = new Set(storage.get('bingo', []));

  return {
    html: `
      <section class="s sea">
        <h2>Bingo de la Boda</h2>
        <p class="sub">Toca cada momento cuando lo veas</p>
        <div class="bing">
          ${CONFIG.bingo.map((text, i) => `
            <button type="button" class="${marked.has(i) ? 'on' : ''}" data-i="${i}" aria-pressed="${marked.has(i)}">${esc(text)}</button>`).join('')}
        </div>
        <p id="bm" class="strong" aria-live="polite"></p>
      </section>`,

    mount(root) {
      const msg = $('#bm', root);
      const check = () => {
        msg.textContent = marked.size === CONFIG.bingo.length ? '🎉 ¡Bingo! Avísale a los novios' : '';
      };

      $('.bing', root).addEventListener('click', e => {
        const btn = e.target.closest('button[data-i]');
        if (!btn) return;
        const i = Number(btn.dataset.i);
        if (marked.has(i)) marked.delete(i);
        else marked.add(i);
        btn.classList.toggle('on', marked.has(i));
        btn.setAttribute('aria-pressed', String(marked.has(i)));
        storage.set('bingo', [...marked]);
        check();
      });

      check();
    },
  };
}
