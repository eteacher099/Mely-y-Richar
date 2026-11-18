import { CONFIG, coupleName } from '../config.js';
import { $, esc } from '../lib/dom.js';
import { icon } from '../lib/icons.js';
import { storage } from '../lib/storage.js';

const songItem = song => `<p class="sug-item">🎶 ${esc(song)}</p>`;

export default function playlist() {
  const songs = storage.get('sug', []);

  return {
    html: `
      <section class="s sea">
        <img class="deco pl-hibiscus" src="img/hibiscus.svg" alt="">
        <img class="deco pl-surf" src="img/surfboard.svg" alt="">
        ${icon('music', 64, 'view-icon')}
        <h2>Nuestra Playlist</h2>
        <p class="sub">Dale play a la mejor banda sonora 🎵</p>

        <div class="player">
          <div class="row">
            <div class="cover" aria-hidden="true"></div>
            <div><b class="player-title">Nuestra Boda</b><br>${esc(coupleName)} ♡</div>
          </div>
          <div class="prog"><i></i></div>
          <div class="times" aria-hidden="true"><span>0:00</span><span>-3:24</span></div>
          <div class="ctl">
            ${icon('shuffle', 24)}${icon('prev', 28)}
            <button type="button" class="play" id="pl" aria-label="Reproducir">${icon('play', 30)}</button>
            ${icon('next', 28)}${icon('repeat', 24)}
          </div>
        </div>

        <a class="btn btn--sun spotify" href="${esc(CONFIG.playlist)}" target="_blank" rel="noopener">
          <span class="spotify-dot" aria-hidden="true">${icon('music', 16)}</span>Abrir en Spotify
        </a>

        <div class="card suggest">
          <b class="suggest-title">Sugiere una canción</b>
          <input type="text" id="sg" placeholder="Canción – Artista" maxlength="80">
          <button type="button" class="btn btn--block" id="sgb">Enviar</button>
          <div id="sgl">${songs.map(songItem).join('')}</div>
        </div>
      </section>`,

    mount(root) {
      const playBtn = $('#pl', root);
      let playing = false;
      playBtn.addEventListener('click', () => {
        playing = !playing;
        playBtn.innerHTML = playing ? '<b aria-hidden="true">❚❚</b>' : icon('play', 30);
        playBtn.setAttribute('aria-label', playing ? 'Pausar' : 'Reproducir');
      });

      const input = $('#sg', root);
      const list = $('#sgl', root);
      const add = () => {
        const song = input.value.trim();
        if (!song) return;
        songs.push(song);
        storage.set('sug', songs);
        list.insertAdjacentHTML('beforeend', songItem(song));
        input.value = '';
      };
      $('#sgb', root).addEventListener('click', add);
      input.addEventListener('keydown', e => { if (e.key === 'Enter') add(); });
    },
  };
}
