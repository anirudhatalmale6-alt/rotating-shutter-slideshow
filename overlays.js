/* ===========================================================================
   OPTIONAL OVERLAY BEHAVIOUR

   Three small jobs and nothing else:

     1. pause / resume  -- the button and the Space bar
     2. fullscreen      -- the button, the F key, and a double-click
     3. idle hiding     -- fades the controls out after a few quiet seconds

   The slideshow is pure CSS and does not need this file. Delete it and the
   animation, the hue cycle, the shutters, the tint lift and the live counter
   all keep working exactly as they do now; you only lose the two buttons and
   the keyboard shortcuts.

   Pausing is one CSS class on the <body>. There is no timeline arithmetic
   here on purpose: your React version tracked elapsed time with Date.now()
   and fed negative animation-delays back into the CSS to resync after a
   pause, and that is the part that could drift. Letting the browser freeze
   its own animations with animation-play-state cannot drift, because the
   animations never stop agreeing with each other.

   No libraries, no network calls, runs on plain browsers back to ~2017.
   =========================================================================== */
(function () {
  'use strict';

  var IDLE_AFTER_MS = 3500; // quiet time before the controls fade
  var body = document.body;

  /* ---------------------------------------------------------------------
     1. PAUSE / RESUME
     --------------------------------------------------------------------- */

  function canPause() {
    return body.classList.contains('has-pause');
  }

  function isPaused() {
    return body.classList.contains('is-paused');
  }

  function setPaused(paused) {
    if (!canPause()) return;
    body.classList.toggle('is-paused', paused);
    for (var i = 0; i < pauseButtons.length; i++) {
      pauseButtons[i].setAttribute('aria-pressed', paused ? 'true' : 'false');
      pauseButtons[i].setAttribute('aria-label',
        paused ? 'Resume slideshow' : 'Pause slideshow');
    }
  }

  function togglePaused() {
    setPaused(!isPaused());
  }

  var pauseButtons = document.querySelectorAll('[data-pause]');
  for (var i = 0; i < pauseButtons.length; i++) {
    pauseButtons[i].addEventListener('click', function (event) {
      event.preventDefault();
      togglePaused();
    });
  }
  setPaused(false);

  // hide the pause button entirely if pausing is switched off on the body
  if (!canPause()) {
    for (var h = 0; h < pauseButtons.length; h++) {
      pauseButtons[h].hidden = true;
    }
  }

  /* ---------------------------------------------------------------------
     2. FULLSCREEN
     Still prefixed in Safari, so every call tries the standard name first
     and falls back to the webkit one.
     --------------------------------------------------------------------- */

  function fullscreenElement() {
    return document.fullscreenElement || document.webkitFullscreenElement || null;
  }

  function callMaybePromise(fn, ctx) {
    if (!fn) return;
    // Browsers reject a fullscreen request that did not come from a real
    // click or keypress, and they reject it as a promise, so swallow it
    // rather than letting it surface as an uncaught error.
    try {
      var result = fn.call(ctx);
      if (result && typeof result.catch === 'function') {
        result.catch(function () {});
      }
    } catch (e) { /* older browsers throw instead of rejecting */ }
  }

  function toggleFullscreen() {
    var el = document.documentElement;
    if (fullscreenElement()) {
      callMaybePromise(document.exitFullscreen || document.webkitExitFullscreen, document);
    } else {
      callMaybePromise(el.requestFullscreen || el.webkitRequestFullscreen, el);
    }
  }

  /* Listen to the browser's own event rather than assuming our click worked,
     so the icon is still right when the user leaves fullscreen with Escape
     or F11 instead of our button. */
  function syncFullscreenClass() {
    body.classList.toggle('is-fullscreen', !!fullscreenElement());
  }

  document.addEventListener('fullscreenchange', syncFullscreenClass);
  document.addEventListener('webkitfullscreenchange', syncFullscreenClass);
  syncFullscreenClass();

  var fsButtons = document.querySelectorAll('[data-fullscreen]');
  for (var j = 0; j < fsButtons.length; j++) {
    fsButtons[j].addEventListener('click', function (event) {
      event.preventDefault();
      toggleFullscreen();
    });
  }

  /* ---------------------------------------------------------------------
     KEYBOARD
     Space pauses, F goes fullscreen. Both ignored while typing in a field,
     in case you add a form to this page later.
     --------------------------------------------------------------------- */
  document.addEventListener('keydown', function (event) {
    if (event.ctrlKey || event.metaKey || event.altKey) return;
    var t = event.target;
    if (t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.isContentEditable)) return;

    if (event.key === ' ' || event.key === 'Spacebar') {
      event.preventDefault(); // stop the page trying to scroll
      togglePaused();
    } else if (event.key === 'f' || event.key === 'F') {
      event.preventDefault();
      toggleFullscreen();
    }
  });

  /* Double-click anywhere goes fullscreen, the way a video player does, but
     not on a button or link where a double-click means something else. */
  document.addEventListener('dblclick', function (event) {
    if (event.target.closest && event.target.closest('a, button')) return;
    toggleFullscreen();
  });

  /* ---------------------------------------------------------------------
     3. IDLE HIDING
     On a display screen you do not want buttons sitting in the corner all
     day. They fade after a few seconds and come back on any mouse movement,
     touch or keypress.
     --------------------------------------------------------------------- */

  var idleTimer = null;

  function wake() {
    body.classList.remove('is-idle');
    // restart the countdown on every nudge, so it is holding the mouse still
    // that triggers the fade, not merely time since the page loaded
    if (idleTimer) window.clearTimeout(idleTimer);
    idleTimer = window.setTimeout(function () {
      body.classList.add('is-idle');
    }, IDLE_AFTER_MS);
  }

  var wakeEvents = ['mousemove', 'mousedown', 'touchstart', 'keydown', 'wheel'];
  for (var k = 0; k < wakeEvents.length; k++) {
    document.addEventListener(wakeEvents[k], wake, { passive: true });
  }

  wake(); // start the first countdown
}());
