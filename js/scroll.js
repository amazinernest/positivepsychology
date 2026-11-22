/* The one scroll animation: the conference photo reel on the home page drifts right to left
 * as the page scrolls past it (GSAP ScrollTrigger, scrubbed). Nothing else on the site scroll-animates. */
(function () {
  'use strict';
  var reel = document.querySelector('.reel');
  if (!reel || !window.gsap || !window.ScrollTrigger) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) { reel.classList.add('reel--static'); return; }
  gsap.registerPlugin(ScrollTrigger);

  function setup() {
    ScrollTrigger.getAll().forEach(function (t) { t.kill(); });
    reel.querySelectorAll('.reel__track').forEach(function (track, i) {
      gsap.set(track, { x: 0 });
      var dist = Math.max(0, track.scrollWidth - window.innerWidth + 32);
      if (!dist) return;
      /* both rows travel right to left; the second row travels further, so they drift apart */
      var d = dist * (i ? 0.85 : 1);
      gsap.fromTo(track, { x: i ? -dist * 0.15 : 0 }, {
        x: i ? -dist : -d,
        ease: 'none',
        scrollTrigger: { trigger: reel, start: 'top bottom', end: 'bottom top', scrub: 0.8, invalidateOnRefresh: true }
      });
    });
  }
  var t;
  window.addEventListener('load', setup);
  window.addEventListener('resize', function () { clearTimeout(t); t = setTimeout(setup, 200); });
  if (document.readyState === 'complete') setup();
})();
