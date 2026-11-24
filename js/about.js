/* About page: the review cards pop in the same way as on the home page. */
(() => {
  if (typeof gsap === 'undefined' || !document.querySelector('.reviews')) return;
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  gsap.utils.toArray('.reviews .q').forEach((q, i) => {
    gsap.from(q, { scale: 0.6, opacity: 0, duration: 0.8, ease: 'back.out(1.6)', delay: i * 0.12, scrollTrigger: { trigger: '.reviews', start: 'top 55%' } });
  });
  gsap.from('.reviews .kicker, .reviews .h2, .reviews .badge', { y: 50, opacity: 0, duration: 0.8, ease: 'power3.out', stagger: 0.1, scrollTrigger: { trigger: '.reviews', start: 'top 75%' } });
})();

/* Location: live time in Mohali (IST) and the visitor's difference from it. */
(() => {
  const t = document.querySelector('[data-ist-time]');
  if (!t) return;
  const ap = document.querySelector('[data-ist-ampm]');
  const d = document.querySelector('[data-ist-date]');
  const you = document.querySelector('[data-ist-you]');
  const IST = 'Asia/Kolkata';
  const fmtT = new Intl.DateTimeFormat('en-GB', { timeZone: IST, hour: 'numeric', minute: '2-digit', hour12: true });
  const fmtD = new Intl.DateTimeFormat('en-GB', { timeZone: IST, weekday: 'long', day: 'numeric', month: 'long' });
  const offset = (tz) => { // minutes ahead of UTC for a time zone, now
    const now = new Date();
    const p = Object.fromEntries(new Intl.DateTimeFormat('en-US', { timeZone: tz, hourCycle: 'h23', year: 'numeric', month: 'numeric', day: 'numeric', hour: 'numeric', minute: 'numeric' }).formatToParts(now).map((x) => [x.type, x.value]));
    return Math.round((Date.UTC(p.year, p.month - 1, p.day, p.hour, p.minute) - now.getTime()) / 60000);
  };
  const tick = () => {
    const parts = fmtT.formatToParts(new Date());
    t.textContent = parts.filter((x) => x.type === 'hour' || x.type === 'minute' || x.type === 'literal').map((x) => x.value).join('').trim();
    ap.textContent = (parts.find((x) => x.type === 'dayPeriod') || {}).value?.toUpperCase() || '';
    d.textContent = fmtD.format(new Date());
  };
  tick(); setInterval(tick, 15000);
  try {
    const mine = Intl.DateTimeFormat().resolvedOptions().timeZone;
    if (mine && mine !== IST && mine !== 'Asia/Calcutta') {
      const diff = offset(IST) - offset(mine);
      if (diff) {
        const h = Math.floor(Math.abs(diff) / 60), m = Math.abs(diff) % 60;
        const span = (h ? h + 'h' : '') + (m ? (h ? ' ' : '') + m + 'm' : '');
        you.textContent = diff > 0 ? `I’m ${span} ahead of you.` : `I’m ${span} behind you.`;
      } else you.textContent = 'We’re in the same time zone right now.';
      you.hidden = false;
    }
  } catch (_) {}
})();

/* Location: the map zooms from the world to India (full map, centred) when it comes into view; the pin then marks Mohali. */
(() => {
  const map = document.querySelector('.abx-loc__map');
  const svg = map && map.querySelector('.abx-loc__svg');
  if (!svg) return;
  const india = svg.dataset.vbIndia;
  const done = () => map.classList.add('is-zoomed');
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined' || matchMedia('(prefers-reduced-motion: reduce)').matches) { svg.setAttribute('viewBox', india); done(); return; }
  ScrollTrigger.create({
    trigger: map, start: 'top 70%', once: true,
    onEnter: () => gsap.to(svg, { attr: { viewBox: india }, duration: 2.2, ease: 'power3.inOut', delay: 0.2, onComplete: done }),
  });
})();
