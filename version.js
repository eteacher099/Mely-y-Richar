/*
 * Versión de la invitación — fuente única para la página y el Service Worker (sw.js).
 *
 * APP_VERSION: súbela a mano cuando publiques un cambio importante (AAAA.MM.DD-n).
 * APP_BUILD:   el workflow de GitHub Pages la reemplaza por el commit en cada despliegue
 *              (.github/workflows/static.yml). En local queda 'dev' y el SW no usa caché.
 *
 * El nombre de la caché es `boda-<APP_VERSION>+<APP_BUILD>`: cada despliegue crea una caché
 * nueva, la app avisa "Hay una nueva versión" y la anterior se borra al actualizar.
 * Script clásico (no módulo) para que funcione tanto en la página como en importScripts().
 */
self.APP_VERSION = '2026.11.19-5';
self.APP_BUILD = 'dev';
