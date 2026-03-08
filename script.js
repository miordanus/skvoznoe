(function () {
  'use strict';

  var logoWrap = document.getElementById('logo-wrap');
  var bubble   = document.getElementById('bubble');
  var mobileAutoHideTimer = null;

  // ── Bubble visibility ──────────────────────────────────────────────────────

  function showBubble() {
    bubble.classList.add('visible');
  }

  function hideBubble() {
    bubble.classList.remove('visible');
    if (mobileAutoHideTimer) {
      clearTimeout(mobileAutoHideTimer);
      mobileAutoHideTimer = null;
    }
  }

  function toggleBubble() {
    if (bubble.classList.contains('visible')) {
      hideBubble();
    } else {
      showBubble();
      // Auto-hide after 3.5s on mobile / touch
      mobileAutoHideTimer = setTimeout(hideBubble, 3500);
    }
  }

  // ── Desktop: hover ─────────────────────────────────────────────────────────
  logoWrap.addEventListener('mouseenter', showBubble);
  logoWrap.addEventListener('mouseleave', hideBubble);

  // ── Keyboard: Enter / Space ────────────────────────────────────────────────
  logoWrap.addEventListener('keydown', function (e) {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      toggleBubble();
    }
    if (e.key === 'Escape') hideBubble();
  });

  // ── Mobile: tap ────────────────────────────────────────────────────────────
  var isTouchDevice = false;

  logoWrap.addEventListener('touchstart', function (e) {
    isTouchDevice = true;
    // Prevent the subsequent mouseenter from firing
    e.preventDefault();
    toggleBubble();
  }, { passive: false });

  // Tap anywhere outside logo → hide bubble
  document.addEventListener('touchstart', function (e) {
    if (!logoWrap.contains(e.target)) {
      hideBubble();
    }
  }, { passive: true });

  // On mouse devices, only use hover (not click)
  // so we guard against firing on touch->mouse fallback
  logoWrap.addEventListener('click', function () {
    if (isTouchDevice) return;
    // Allow click focus to toggle for accessibility
  });

  // ── Page jitter ────────────────────────────────────────────────────────────
  // Fires every ~42–70 seconds. Adds 'jitter' class for 80ms.
  // CSS translates body by (1px, 0.5px) — barely perceptible.
  // Creates a haunted-by-repetition sensation without being a gimmick.

  var JITTER_MIN  = 42000;
  var JITTER_RAND = 28000;
  var JITTER_HOLD = 80;

  function scheduleJitter() {
    var delay = JITTER_MIN + Math.random() * JITTER_RAND;
    setTimeout(function () {
      document.body.classList.add('jitter');
      setTimeout(function () {
        document.body.classList.remove('jitter');
      }, JITTER_HOLD);
      scheduleJitter();
    }, delay);
  }

  scheduleJitter();

  // ── Animation stagger init ─────────────────────────────────────────────────
  // Give each surreal element a random animation-delay offset so they
  // don't all start in sync (makes the field feel more organic).
  var elements = ['el-cloud', 'el-pear', 'el-plane', 'el-jar', 'el-sun'];
  elements.forEach(function (id) {
    var el = document.getElementById(id);
    if (!el) return;
    // Random delay between 0 and half the element's own cycle
    var delay = -(Math.random() * 6).toFixed(2) + 's';
    el.style.animationDelay = delay;
  });

}());
