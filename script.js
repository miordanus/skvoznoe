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

  // ── Idle events ────────────────────────────────────────────────────────────
  // Two event types, randomly selected, fire every 7–12 seconds so effects
  // are noticeable within the first 10 seconds of watching.
  //
  // Type 1 (60%): body micro-jitter — brief haunted-by-repetition sensation.
  // Type 2 (40%): corner-flash — registration marks flare up for 280ms,
  //               as if the printing press briefly hiccupped.

  var IDLE_MIN  = 7000;
  var IDLE_RAND = 5000;
  var IDLE_HOLD = 80;

  function doIdleEvent() {
    if (Math.random() < 0.6) {
      // Type 1: body micro-jitter
      document.body.classList.add('jitter');
      setTimeout(function () {
        document.body.classList.remove('jitter');
      }, IDLE_HOLD);
    } else {
      // Type 2: corner-flash
      var zone = document.querySelector('.zone');
      zone.classList.add('corner-flash');
      setTimeout(function () {
        zone.classList.remove('corner-flash');
      }, 280);
    }
    scheduleIdleEvent();
  }

  function scheduleIdleEvent() {
    var delay = IDLE_MIN + Math.random() * IDLE_RAND;
    setTimeout(doIdleEvent, delay);
  }

  scheduleIdleEvent();

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
