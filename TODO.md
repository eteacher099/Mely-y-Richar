# TODO

Sitio publicado: https://eteacher099.github.io/Mely-y-Richar/ (GitHub Pages, se despliega al hacer push a `main`).
Apps Script publicado y verificado (health check, ranking con nivel, puntajes de Tesla > 20 000 aceptados).

## 🚀 Pendiente en Google Sheets / despliegue
- [ ] **Trivia por rapidez:** pegar el `scores.gs` nuevo, ejecutar `setup()` (agrega la columna `Aciertos`)
      y desplegar como *Nueva versión* **antes** de publicar el sitio: el script actual rechaza puntos de
      trivia > 50. Luego borrar las filas viejas de trivia/marina (estaban en escala de aciertos, no de puntos)
- [ ] Probar desde el celular: elegir menú, jugar y revisar que lleguen las filas; borrar filas de prueba
      (en el ranking hay entradas "prueba" y "Handsome")
- [ ] Revisar en la hoja que `Resumen menú` ya no muestre `#ERROR!` (si sigue: menú **Boda → Actualizar resumen del menú**)
- [ ] Confirmar `timeZone` en `google-scripts/appsscript.json` (está `America/Bogota`)
- [ ] (Opcional) Definir `SCORES_TOKEN` en el script y en `CONFIG.scores.token`

## ✏️ Contenido por confirmar
- [ ] Verificar que los 3 mapas tomados de Canva abren el lugar correcto (Notaría 2, Fénix, Club Náutico)
      y el del Muelle La Bodeguita (búsqueda de Google Maps)
- [ ] Confirmar el número de WhatsApp de `menu.whatsapp` y `rsvp.whatsapp` (tomado de Canva)
- [ ] Colores permitidos del dress code (en Canva son imágenes; no se copiaron)
- [ ] Enlace real de la playlist colaborativa de Spotify
- [ ] Respuestas reales de la trivia de los novios (las actuales son supuestas)
- [ ] FAQ: qué llevar el Día 2, lanchas/traslados, hora límite del muelle, etc.
- [ ] (Opcional) Reemplazar las ilustraciones SVG por arte final en alta resolución (`CONFIG.portada`)

## 🐛 Funcionalidad incompleta
- [ ] **Mensajes**: solo se guardan en el teléfono del invitado → los novios nunca los leen.
      Enviarlos a Sheets con una acción `message` en el mismo Apps Script
- [ ] **Sugerencias de canciones**: mismo problema → acción `song` en el Apps Script
- [ ] **Álbum**: las fotos quedan en `localStorage` (~5 MB, solo las ve quien las sube).
      Opciones: subir a una carpeta de Google Drive vía Apps Script, o enlazar un álbum
      compartido de Google Fotos
- [ ] **Reproductor**: es decorativo (el ▶ no reproduce nada). Reemplazar por el embed
      de Spotify o quitar los controles
- [ ] Bingo: registrar en Sheets quién completó el cartón (opcional)

## ✨ Mejoras sugeridas
- [ ] Meta tags Open Graph + imagen para que el enlace se vea bonito en WhatsApp
- [ ] Favicon
- [ ] Botón "Agregar al calendario" (.ics / Google Calendar)
- [ ] Probar en iOS Safari y Android Chrome (safe areas, teclado, subida de fotos)

## ✅ Hecho y desplegado
- [x] Separar el `index.html` monolítico en `css/` + módulos `js/` (config, router, vistas)
- [x] Corregir el choque de la clase `.sun` (botones "▶ Jugar" / "Abrir en Spotify" que giraban)
- [x] Eliminar CSS muerto; nombres de la portada desde `CONFIG.nombres`
- [x] Limpieza de timers al cambiar de pantalla (contrato `mount → cleanup`)
- [x] Menú accesible (Escape, `aria-expanded`, foco) sin `onclick` inline
- [x] `CLAUDE.md` y este `TODO.md`
- [x] Rediseño según el storyboard: escena de playa, olas, iconos e ilustraciones SVG en `img/`
- [x] Datos reales: Mely & Richar, 19–20 dic 2026, Cartagena; itinerario de 2 días con pestañas y mapas
- [x] Cuenta regresiva con zona horaria de Colombia (-05:00)
- [x] Nuestra historia, dress code por día, planifica tu viaje y RSVP por WhatsApp (de Canva)
- [x] Menú de boda (`#carta`) estilo PDF: elegir plato + postre y guardar en Google Sheets
- [x] Resumen del menú calculado por el script (sin `QUERY`: corrige `#ERROR!` en hojas en español)
- [x] Apps Script: puntajes (validación, deduplicado, lock, ranking cacheado), menú y columna `Nivel`
- [x] Cliente con cola offline y reintentos para puntajes y menú
- [x] Encuentra a Tesla con niveles: más distractores y emojis oscuros, Tesla más pequeño y girado,
      siempre en la capa superior; puntos = nivel × rapidez; nivel en el ranking
- [x] Trivia Marina con 10 preguntas, barajadas en cada partida
- [x] Mely y Richar con rasgos de sus fotos (`mely.svg`, `richar.svg`, `couple.svg`); trío en Wedding Game
- [x] Fotos de referencia borradas (nunca entraron a git)
- [x] Trivias puntuadas por rapidez (50 + hasta 150 por acierto), ranking con puntos y aciertos
- [x] Nombre obligatorio para jugar ("¿Quién juega?" en trivia, marina y Tesla; validación en el hub)
