/* ===========================================================================
   OPTIONAL OVERLAY BEHAVIOUR

   This file does two small jobs and nothing else:

     1. fullscreen  -- the round button, the F key, and a double-click
     2. idle hiding -- fades the button out after a few quiet seconds

   The slideshow itself is pure CSS and does not need this file at all. If you
   delete it, the animation, the hue cycle, the shutters and the live counter
   all keep working exactly as they do now; you only lose the button.

   No libraries, no network calls, runs on plain browsers back to ~2017.
   =========================================================================== */
(function () {
  'use strict';

  var IDLE_AFTER_MS = 3500; // how long without a mouse before the button fades
  var body = document.body;

  /* ---------------------------------------------------------------------
     1. FULLSCREEN
     Still prefixed in Safari, so each call tries the standard name first
     and falls back to the webkit one.
     --------------------------------------------------------------------- */

  function fullscreenElement() {
    return document.fullscreenElement || document.webkitFullscreenElement || null;
  }

  function enterFullscreen() {
    var el = document.documentElement;
    var request = el.requestFullscreen || el.webkitRequestFullscreen;
    if (!request) return;
    // Browsers reject this unless it came from a real click or keypress, and
    // they reject it as a promise, so swallow the rejection rather than
    // letting it surface as an uncaught error in the console.
    try {
      var result = request.call(el);
      if (result && typeof result.catch === 'function') {
        result.catch(function () {});
      }
    } catch (e) { /* older browsers throw instead */ }
  }

  function exitFullscreen() {
    var exit = document.exitFullscreen || document.webkitExitFullscreen;
    if (!exit) return;
    try {
      var result = exit.call(document);
      if (result && typeof result.catch === 'function') {
        result.catch(function () {});
      }
    } catch (e) { /* ignore */ }
  }

  function toggleFullscreen() {
    if (fullscreenElement()) {
      exitFullscreen();
    } else {
      enterFullscreen();
    }
  }

  /* Keep the icon honest. Listening to the browser's own event (rather than
     assuming our click worked) means the icon is still correct when the user
     leaves fullscreen with the Escape key or the F11 key instead of our
     button. */
  function syncFullscreenClass() {
    if (fullscreenElement()) {
      body.classList.add('is-fullscreen');
    } else {
      body.classList.remove('is-fullscreen');
    }
  }

  document.addEventListener('fullscreenchange', syncFullscreenClass);
  document.addEventListener('webkitfullscreenchange', syncFullscreenClass);
  syncFullscreenClass();

  var buttons = document.querySelectorAll('[data-fullscreen]');
  for (var i = 0; i < buttons.length; i++) {
    buttons[i].addEventListener('click', function (event) {
      event.preventDefault();
      toggleFullscreen();
    });
  }

  /* F toggles, Escape is handled by the browser itself. Ignore the key while
     the user is typing in a field, in case you add a form to the page later. */
  document.addEventListener('keydown', function (event) {
    if (event.key !== 'f' && event.key !== 'F') return;
    if (event.ctrlKey || event.metaKey || event.altKey) return;
    var t = event.target;
    if (t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.isContentEditable)) return;
    event.preventDefault();
    toggleFullscreen();
  });

  /* Double-click anywhere, the way a video player behaves -- but not on the
     QR code or the button, where a double-click means something else. */
  document.addEventListener('dblclick', function (event) {
    if (event.target.closest && event.target.closest('a, button')) return;
    toggleFullscreen();
  });

  /* ---------------------------------------------------------------------
     2. IDLE HIDING
     On a display screen you do not want a button sitting in the corner all
     day. It fades out after a few seconds and returns on any mouse movement,
     touch or keypress.
     --------------------------------------------------------------------- */

  var idleTimer = null;

  function goIdle() {
    body.classList.add('is-idle');
  }

  function wake() {
    body.classList.remove('is-idle');
    // restart the countdown on every nudge, so holding the mouse still is
    // what triggers the fade, not merely the time since page load
    if (idleTimer) window.clearTimeout(idleTimer);
    idleTimer = window.setTimeout(goIdle, IDLE_AFTER_MS);
  }

  var wakeEvents = ['mousemove', 'mousedown', 'touchstart', 'keydown', 'wheel'];
  for (var j = 0; j < wakeEvents.length; j++) {
    document.addEventListener(wakeEvents[j], wake, { passive: true });
  }

  wake(); // start the first countdown
}());
