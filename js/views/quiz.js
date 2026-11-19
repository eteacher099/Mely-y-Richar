import { $, $$, esc } from '../lib/dom.js';
import { submitScore } from '../lib/scores.js';
import { scorePanelHtml, mountScorePanel } from '../components/score-panel.js';

const FEEDBACK_MS = 1000;

const shuffle = arr => {
  const out = [...arr];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
};

/** Baraja preguntas y opciones, recalculando el índice de la respuesta correcta. */
export function shuffleQuestions(questions) {
  return shuffle(questions).map(({ q, o, a }) => {
    const order = shuffle(o.map((_, i) => i));
    return { q, o: order.map(i => o[i]), a: order.indexOf(a) };
  });
}

/**
 * Crea una vista de trivia.
 * @param {{game: string, title: string, questions: {q: string, o: string[], a: number}[], shuffle?: boolean}} opts
 *   game:    id con el que se guarda el puntaje (debe existir en GAMES de google-scripts/scores.gs)
 *   shuffle: barajar preguntas y opciones en cada partida
 */
export function createQuiz({ game, title, questions: source, shuffle: mix = false }) {
  return () => {
    const questions = mix ? shuffleQuestions(source) : source;

    return {
      html: `
        <section class="s sea">
          <h2>${esc(title)}</h2>
          <div id="quiz"></div>
        </section>`,

      mount(root) {
        const box = $('#quiz', root);
        const total = questions.length;
        const startedAt = Date.now();
        let index = 0;
        let score = 0;
        let pending;

        const ask = () => {
          const q = questions[index];
          box.innerHTML = `
            <p class="sub">Pregunta ${index + 1} de ${total}</p>
            <p class="q">${esc(q.q)}</p>
            ${q.o.map((opt, j) => `<button type="button" class="o" data-j="${j}">${esc(opt)}</button>`).join('')}`;
        };

        const finish = () => {
          box.innerHTML = `
            <div class="result-emoji" aria-hidden="true">${score === total ? '🏆' : '🎉'}</div>
            <p class="q">Acertaste ${score} de ${total}</p>
            ${scorePanelHtml()}
            <a class="btn" href="#juego">Más juegos</a>`;
          mountScorePanel(box, game, submitScore({ game, score, max: total, durationMs: Date.now() - startedAt }));
        };

        box.addEventListener('click', e => {
          const btn = e.target.closest('.o');
          if (!btn || btn.disabled) return;

          const q = questions[index];
          const options = $$('.o', box);
          options.forEach(o => { o.disabled = true; });

          if (Number(btn.dataset.j) === q.a) {
            score++;
            btn.classList.add('ok');
          } else {
            btn.classList.add('no');
            options[q.a]?.classList.add('ok');
          }

          index++;
          pending = setTimeout(index < total ? ask : finish, FEEDBACK_MS);
        });

        ask();
        return () => clearTimeout(pending);
      },
    };
  };
}
