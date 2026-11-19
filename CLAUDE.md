# CLAUDE.md

Invitación web de la boda de **Mely & Richar**: 19 y 20 de diciembre de 2026 en Cartagena de
Indias, Colombia (Día 1 ceremonia + Fénix Beach Club, Día 2 Boat Day). Sitio estático, móvil
primero, sin build ni dependencias: HTML + CSS + JavaScript con módulos ES nativos.
Los textos de la interfaz van en español.

## Ejecutar en local

Los módulos ES **no cargan con `file://`** (abrir `index.html` con doble clic deja la
pantalla en blanco). Usa un servidor estático:

```bash
npx serve .            # o
python -m http.server 8000
```

o la extensión *Live Server* de VS Code. No hay tests ni linter configurados.

En local `APP_BUILD` vale `'dev'` y el Service Worker trabaja **red primero**, así que los
cambios se ven al recargar. Si algo se queda pegado: DevTools → Application → Service Workers
→ *Unregister* y *Clear site data*.

## Estructura

```
index.html              Shell: <head>, modulepreload de js/, #app, menú <nav id="menu">
version.js              ★ Versión de la app (APP_VERSION / APP_BUILD) — página y Service Worker
sw.js                   Service Worker: caché versionada y aviso de nueva versión
css/
  base.css              Tokens (:root), reset, layout (#app, .s, .sea, h2, .wave)
  components.css        .bar, .btn, .card, inputs, .menu, details, .pill, ranking
  views.css             Estilos por pantalla (home, itinerario, juegos, playlist…)
js/
  config.js             ★ TODO el contenido editable (nombres, fecha, trivia, FAQ, scores)
  main.js               Arranque: título, router, cola offline, Service Worker, versión en el menú
  router.js             Router por hash + barra superior + menú + ciclo de vida de vistas
  lib/dom.js            $, $$, esc (escape HTML), timeAgo, uid
  lib/storage.js        localStorage con prefijo "boda_" y JSON, nunca lanza
  lib/player.js         Nombre e id del invitado en este dispositivo
  lib/api.js            Cliente del Apps Script: POST/GET, cola offline, reintentos
  lib/scores.js         Puntajes de juegos y ranking (usa api.js)
  lib/menu.js           Elección del menú de la cena (usa api.js)
  lib/icons.js          Iconos SVG inline (icon('camera', 56)), rayitos de sol y gaviota
  lib/sw-register.js    Registra sw.js y muestra "✨ Hay una nueva versión" → Actualizar
  components/score-panel.js   Panel de resultado: estado del envío + ranking
  components/spinner.js       Spinner playero (pelota de playa) para esperas del Apps Script
  components/name-gate.js     Nombre obligatorio antes de los juegos con ranking
  views/index.js        Registro de rutas hash → vista
  views/*.js            Una pantalla por archivo
img/                    Ilustraciones SVG del storyboard (ver abajo)
google-scripts/         Apps Script (Web App) que guarda puntajes en Google Sheets
tools/personajes.py     Genera los SVG de los personajes (no hace falta para el sitio)
TODO.md                 Pendientes del proyecto
```

## Caché y versiones (Service Worker)

Las imágenes son SVG livianos (~70 KB en total); lo que hacía lenta la carga era la cascada de
~30 módulos JS pequeños sobre GitHub Pages (que solo cachea 10 min). Por eso:

- **`version.js`** es la fuente única de la versión: `APP_VERSION` (a mano, formato
  `AAAA.MM.DD-n`) y `APP_BUILD` (`'dev'` en local). Es un script clásico: lo carga
  `index.html` (se ve al pie del menú: `v2026.11.19-1 · abc1234`) y `sw.js` con `importScripts`.
- **El workflow de Pages** (`.github/workflows/static.yml`) reemplaza `APP_BUILD` por el commit
  corto en cada despliegue. Así **cada push a `main` crea una caché nueva** aunque no se cambie
  `APP_VERSION`. Sube `APP_VERSION` cuando quieras que la versión visible cambie.
- **`sw.js`**: caché `boda-<APP_VERSION>+<APP_BUILD>`. Archivos propios = caché primero (se
  precarga el `SHELL` y el resto se guarda la primera vez que se usa). Google Fonts = caché
  aparte revalidada en segundo plano. **Apps Script nunca se cachea** (siempre red).
- **Actualización**: el navegador detecta el `version.js`/`sw.js` nuevo → el SW nuevo queda
  esperando → `lib/sw-register.js` muestra "✨ Hay una nueva versión de la invitación" →
  *Actualizar* envía `SKIP_WAITING`, la página se recarga una vez y se borran las cachés viejas.
  También se busca versión nueva al volver a la pestaña y cada 30 min.
- **Nunca usar la caché HTTP del navegador** (GitHub Pages manda `max-age=600`): el SW se registra
  con `updateViaCache: 'none'` (si no, el `version.js` nuevo no se detecta) y todo lo que el SW
  baja usa `fresh(req)` = `cache: 'no-cache'` (revalida con ETag). Sin esto, una versión nueva
  llenaba su caché con los archivos viejos y los invitados que ya habían entrado no veían los cambios.
- **`index.html` precarga todos los módulos** con `<link rel="modulepreload">`. Si agregas un
  archivo en `js/`, agrégalo a esa lista (si falta solo se pierde la precarga, no se rompe nada).
  Si un archivo nuevo debe estar disponible sin red desde la primera visita, agrégalo a `SHELL`
  en `sw.js` (todo lo de `SHELL` debe existir: si uno falta, la instalación del SW falla).

## Arquitectura

**Rutas** (`js/views/index.js`): `#home`, `#historia`, `#itin`, `#carta` (menú de boda),
`#juego`, `#trivia`, `#marina`, `#tesla`, `#bingo`, `#playlist`, `#album`, `#mensajes`, `#info`.
Hash desconocido → home. **No usar `#menu`** como ruta: choca con `<nav id="menu">`.

**Contrato de una vista**: función que devuelve

```js
{ html: string, bar?: boolean, wave?: boolean /* ambos default true */, mount?: (root) => cleanup | void }
```

- `router.render()` ejecuta el cleanup anterior, pinta `bar + html + ola` en `#app` y
  llama a `mount(root)`.
- Todo `setInterval`/`setTimeout` de una vista **debe** limpiarse en el cleanup.
- Los eventos se enlazan en `mount` con `addEventListener` (sin `onclick` inline ni
  globales). Para actualizar la pantalla se modifica el DOM local; no se re-renderiza
  toda la vista.
- Las trivias se crean con `createQuiz({ game, title, questions, shuffle?, pick? })` (`views/quiz.js`).
  La marina usa `pick: 10`: cada partida toma 10 preguntas al azar del banco `CONFIG.marina`
  (32 hoy) y baraja preguntas y opciones. Para agregar preguntas basta con sumarlas al banco.
  Puntaje = suma de `answerPoints(ms)` por acierto (50 + hasta 150 por rapidez, `lib/scores.js`);
  se envían `puntaje` (puntos), `maximo` (preguntas) y `aciertos`.
- **Nombre obligatorio** en juegos con ranking: las rutas `trivia`, `marina` y `tesla` van envueltas
  en `withPlayerName()` (`components/name-gate.js`), que muestra "¿Quién juega?" si falta; el hub
  `#juego` también bloquea los enlaces sin nombre (mínimo 2 letras, `nameError()`).

**Agregar una pantalla**: crear `js/views/x.js`, registrarla en `views/index.js`,
añadir el enlace al `<nav id="menu">` de `index.html` y sus estilos en `css/views.css`.

## Diseño visual (storyboard)

El diseño sigue un storyboard ilustrado: playa, azul marino `--navy`, crema, títulos en
Kaushan Script, olas arriba (fondo de `.sea`) y abajo (`.wave`), rayitos de sol sobre los
títulos (`.sea h2::before`; se omiten si la pantalla tiene un `.view-icon`).

Ilustraciones en `img/`, todas SVG dibujadas a mano (nítidas en cualquier pantalla):
`couple.svg` (retrato de Mely, Richar y Tesla; portada e Historia), `mely.svg` y `richar.svg`
(cuerpo entero; trío de pie en Wedding Game junto a Tesla), `tesla.svg` (perrito del juego
y de Mensajes), `beach.svg` (fondo de portada, juego y carátula de la playlist) y
decoraciones (`sun`, `palm`, `palm-leaves`, `hibiscus`, `starfish`, `shell`, `surfboard`,
`lighthouse`). Las decoraciones usan `<img class="deco ...">` posicionadas en CSS;
dentro de `.sea` quedan detrás del contenido. Para usar arte final (PNG/JPG), cambiar
`CONFIG.portada`; si la imagen no carga, la portada vuelve a `img/couple.svg`.

## Datos de la boda

Todo sale de `js/config.js`: `fecha`/`fin` con desfase `-05:00` (la cuenta regresiva es
correcta en cualquier zona horaria), `dias` (itinerario por día; cada evento puede tener
`lugar` → clave de `lugares` con su mapa, y `link` interno), `lugares`, `menu`
(platos incluidos, sin costo extra, del PDF `menu_boda_mely_richar_19122026.pdf`),
`vestimenta` por día, `rsvp`, `viaje`, `historia` y `faq`. Fuente de los textos: la
invitación de Canva (meliyrichar.my.canva.site).

La pantalla `#carta` usa su propio estilo (el del PDF: crema, dorado, Cormorant Garamond)
con variables `--mn-*` dentro de `.menu-screen`; no lleva olas (`wave:false`, sin `.sea`).

## Juego "Encuentra a Tesla" (`js/views/tesla.js`)

Nivel = perritos encontrados + 1. `levelSettings(level)` define la dificultad (distractores,
proporción de emojis oscuros `DARK`, perros parecidos `LOOKALIKES` desde el nivel 6, tamaño
y giro desde el 5). Tesla siempre es el último hijo de `#bc` (capa superior): nunca queda tapado. `pointsFor(level, ms)` = nivel × (50 + hasta 150
por rapidez con `speedFactor()` de `lib/scores.js`; 0 de bono a los 10 s). `supportedEmojis()` descarta los emojis que el dispositivo no
puede dibujar (comparando contra el glifo de "caja vacía" en un canvas). El nivel se envía como
`nivel` y se guarda en la columna `Nivel`; `GAMES.tesla` en `scores.gs` limita puntaje y nivel.

**Personajes:** estilo caricatura chibi (cabeza grande, ojos grandes, contorno marrón, degradados
suaves) según las ilustraciones de referencia de la pareja, con la ropa de "playa de boda".
Richar: pelo oscuro ondulado con volumen, gafas de sol, barba completa recortada, camisa hawaiana
azul con flores blancas, bermuda beige y sandalias. Mely: pelo largo ondulado de raíz castaña a
puntas rubias, ojos cafés grandes, pecas, aretes dorados, sombrero de paja con cinta y moño rojos,
vestido blanco de tiras. Tesla: bulldog francés negro (cabeza ancha y cuadrada, orejas de murciélago,
hocico corto con pliegue sobre la nariz, belfos, lengua afuera, cuerpo robusto), cuello blanco y
corbatín rojo (el corbatín ayuda a distinguirlo en el juego).
**Los cuatro SVG se generan con `tools/personajes.py`** (Python, solo librería estándar): las
cabezas se definen una vez y se reutilizan en las figuras y en `couple.svg`. Para cambiar un
rasgo, edita el script y ejecuta `python tools/personajes.py`; no edites los SVG a mano.

## Esperas del Apps Script y rankings

- Toda espera al Apps Script muestra `spinner(texto, { small })` (`components/spinner.js`):
  guardar puntaje, cargar ranking, guardar el menú y el top del hub.
- El hub `#juego` muestra el **Top 5 de los juegos con puntaje**, una columna por juego y en el
  orden de los íconos de "Otros juegos": Encuentra a Tesla, Trivia Marina (el bingo no tiene
  puntaje). Se configura en `BOARDS` (`views/juegos.js`) y usa el endpoint `leaderboard`.
- `getLeaderboard()` guarda los rankings 30 s en memoria; `submitScore()` invalida el del juego
  y el panel de resultado pide `{ fresh: true }` para mostrar el puntaje recién guardado.

## Google Sheets (puntajes + menú)

Flujo juegos: juego termina → `submitScore()` → `POST` (`action:'score'`) → fila en `Scores`
→ `getLeaderboard()` → ranking en `score-panel`.
Flujo menú: `#carta` → `saveMenuChoice()` → `POST` (`action:'menu'`) → **una fila por
invitado** (playerId) en `Menu`; la última elección reemplaza a la anterior. La pestaña
`Resumen menú` la reescribe el script con **valores** (no fórmulas: en hojas en español el
separador es `;` y las fórmulas con `,` dan `#ERROR!`).

- Se activa al poner la URL `/exec` en `CONFIG.scores.endpoint`. Vacío = solo local
  (mejor puntaje por dispositivo).
- `POST` con `Content-Type: text/plain` a propósito: evita el preflight CORS, que
  Apps Script no soporta. No cambiar a `application/json`.
- Sin red, el envío va a la cola `boda_scoreQueue` y se reintenta al cargar o en el
  evento `online`. Cada envío tiene `id` único y el servidor deduplica.
- Los ids de juego (`trivia`, `marina`, `tesla`) deben coincidir con `GAMES` en
  `google-scripts/scores.gs`; un juego nuevo hay que registrarlo en ambos lados.
- Cambios en `scores.gs` requieren redesplegar como **nueva versión de la misma
  implementación** para conservar la URL (ver `google-scripts/README.md`).

## Convenciones

- **Seguridad**: todo dato variable en un template HTML pasa por `esc()`, incluidos los
  valores de `CONFIG` y lo que escriba el invitado.
- **Contenido** solo en `js/config.js`; las vistas no traen textos de datos fijos.
- **CSS**: colores desde las variables de `:root`; modificadores estilo `.btn--sun`,
  `.card--center`. No usar estilos inline salvo valores dinámicos (posiciones de
  Tesla, imagen de portada).
- No reutilizar el nombre de una clase para dos cosas: `.sun` servía a la vez para el
  sol decorativo (absolute + animación) y para el botón amarillo, y rompía los botones.
  Ahora son `.sun-deco` y `.btn--sun`.
- Ancho de diseño: 430 px (`#app`). Probar en móvil y respetar `env(safe-area-inset-*)`.
- Accesibilidad: emojis decorativos con `aria-hidden="true"`, botones con `type="button"`
  y `aria-label` cuando solo tienen icono.

## Mensajes, canciones y álbum

- **Mensajes** (`#mensajes`) y **canciones sugeridas** (`#playlist`) se envían a la hoja con
  `sendMessage()` / `suggestSong()` (`lib/notes.js` → `send()`, con cola offline). Son
  **privados**: van a las pestañas `Mensajes` y `Canciones` y solo los novios los leen; no hay GET.
  Cada invitado ve "Tus mensajes" / "Tus sugerencias" (historial local `msgs` / `sug`) con
  estado (`components/sent-list.js`): ✓ Enviado, 📶 Pendiente (`isQueued(id)` en la cola) o
  "Solo en este teléfono" (ítems de antes de conectar con Sheets, sin `id`; no se envían).
  El nombre es obligatorio (`nameError()`) y actualiza `player.name`.
- **Álbum** (`#album`): las fotos y videos se suben a un servicio externo cuyo link va en
  `CONFIG.album.subir` (y `ver`, `nota`). Vacío → tarjeta "Muy pronto". Ya no se guardan fotos
  en `localStorage`; si un teléfono tenía fotos de la versión anterior, se muestran con botón
  para borrarlas. Proveedor pendiente de decidir (ver TODO).
- **Menú de boda**: cada plato es `[nombre, descripción, emojis]` (máx. 3; 🌿 = vegetariano).
  El valor guardado en la hoja es solo el nombre (sin emojis).

## Limitaciones conocidas

El bingo se guarda solo en el `localStorage` del invitado. El reproductor de la playlist es
decorativo. Ver `TODO.md`.
