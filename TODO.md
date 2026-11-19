# TODO

Sitio publicado: https://eteacher099.github.io/Mely-y-Richar/ (GitHub Pages, se despliega al hacer push a `main`).
Apps Script publicado y verificado (health check, ranking con nivel y aciertos, Tesla > 20 000 y
trivias puntuadas por rapidez aceptadas). Probado desde el celular: puntajes y menú llegan a la hoja.

## 🚀 Pendiente en Google Sheets / despliegue
- [ ] **Mensajes y canciones:** pegar el `scores.gs` nuevo, ejecutar `setup()` (crea `Mensajes` y
      `Canciones`) y desplegar como *Nueva versión* **antes** de publicar el sitio (el script actual
      responde `unknown_action` y los invitados verían "No pudimos enviarlo")
- [ ] **Antes de compartir la invitación:** borrar las filas de prueba en `Scores` ("prueba", "Handsome")
      y en `Menu`; las de trivia viejas están en escala de aciertos (3/4), no de puntos. Luego
      **Boda → Actualizar resumen del menú** para que `Resumen menú` quede en cero
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
- [ ] **Álbum: elegir proveedor y pegar el link en `CONFIG.album.subir`** (y `ver` / `nota`).
      La pantalla ya está lista: sin link muestra "Muy pronto"; con link, "Subir fotos y videos".
      | Opción | Cuenta de Google | Videos | Comentario |
      |---|---|---|---|
      | Carpeta de Drive con permiso de edición | Sí | Grandes | Simple; todo queda en una carpeta |
      | Álbum compartido de Google Fotos | Sí | Grandes | El más cómodo en el celular; se ve como álbum |
      | Google Form con carga de archivos | Sí | Hasta el límite del Form | Ordenado por invitado (nombre + archivos) |
      | Subida vía Apps Script a Drive | No | Solo cortos (~20 MB) | Requiere permiso de Drive y más desarrollo |
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
- [x] Prueba desde el celular: envío de puntajes y elecciones del menú funcionando
- [x] Spinner playero (pelota de playa) en todas las esperas del Apps Script
- [x] Caché versionada con Service Worker (`version.js` + `sw.js`), aviso "Hay una nueva versión",
      build automático por commit en el workflow y `modulepreload` de todos los módulos
- [x] Trivia Marina: banco de 32 preguntas, 10 al azar por partida
- [x] Top 5 en el hub: Encuentra a Tesla y Trivia Marina (orden de los íconos)
- [x] Mensajes y canciones sugeridas a Google Sheets (privados para los novios; pestañas
      `Mensajes` y `Canciones`), con nombre obligatorio, spinner y estado Enviado / Pendiente
- [x] Álbum: arquitectura con link configurable (`CONFIG.album`), "Muy pronto" mientras tanto;
      se quitó la subida a `localStorage` (las fotos viejas del teléfono se pueden ver y borrar)
- [x] Menú de boda con emojis por plato (máx. 3) y leyenda (🌿 vegetariano, 🐟, 🦐, 🍗, 🥩, 🥥)
- [x] Nombre obligatorio para jugar ("¿Quién juega?" en trivia, marina y Tesla; validación en el hub)
