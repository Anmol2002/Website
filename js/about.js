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

/* Journey: a Figma-like canvas. Desktop pins the section and scrolls the canvas sideways; on phones the steps stack.
   Either way a "Manpreet" cursor follows the path, the path fills in orange, and each step gets selected as she reaches it. */
(() => {
  const root = document.querySelector('.abx-jr2');
  if (!root) return;
  const stage = root.querySelector('.abx-jr2__stage');
  const track = root.querySelector('.abx-jr2__track');
  const svg = root.querySelector('.abx-jr2__path');
  const bg = root.querySelector('.abx-jr2__bg');
  const fg = root.querySelector('.abx-jr2__fg');
  const cur = root.querySelector('.abx-jr2__cur');
  const cards = [...root.querySelectorAll('.abx-jr2__card')];
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined' || matchMedia('(prefers-reduced-motion: reduce)').matches) { root.classList.add('is-static'); return; }

  let L = 0, stops = [], last = -1;
  const rem = () => parseFloat(getComputedStyle(document.documentElement).fontSize);

  // place the cards (desktop zigzag) and build the path through them
  function layout(desktop) {
    const r = rem();
    const H = stage.clientHeight;
    let pts = [];
    if (desktop) {
      const cw = 42 * r, gap = 12 * r, x0 = 14 * r;
      cards.forEach((c, i) => {
        const h = c.offsetHeight;
        const mid = (H - h) / 2, off = Math.min(H * 0.1, Math.max(0, mid - 3 * r));
        c.style.left = x0 + i * (cw + gap) + 'px';
        c.style.top = Math.max(3 * r, mid + (i % 2 ? off : -off)) + 'px';
      });
      track.style.width = x0 * 2 + cards.length * (cw + gap) + 'px';
      // the line enters each card at the middle of its left side and leaves from the middle of its right side
      pts = [];
      cards.forEach((c) => { const y = c.offsetTop + c.offsetHeight / 2; pts.push([c.offsetLeft, y], [c.offsetLeft + c.offsetWidth, y]); });
      pts.unshift([2 * r, pts[0][1]]);
    } else {
      cards.forEach((c) => { c.style.left = ''; c.style.top = ''; });
      track.style.width = '';
      const x = 4.5 * r;
      pts = cards.map((c) => [x, c.offsetTop + c.offsetHeight / 2]); // level with the middle of each card
      pts.unshift([x, 1.5 * r]);
    }
    svg.setAttribute('width', track.offsetWidth); svg.setAttribute('height', track.offsetHeight);
    // smooth curve through the points
    let d = `M${pts[0][0]} ${pts[0][1]}`;
    const segs = [];
    for (let i = 1; i < pts.length; i++) {
      const [x0, y0] = pts[i - 1], [x1, y1] = pts[i];
      const seg = desktop && y0 !== y1 ? ` C${x0 + (x1 - x0) * 0.5} ${y0} ${x0 + (x1 - x0) * 0.5} ${y1} ${x1} ${y1}` : ` L${x1} ${y1}`;
      d += seg; segs.push(d);
    }
    bg.setAttribute('d', d); fg.setAttribute('d', d);
    L = fg.getTotalLength();
    // where along the path each card sits
    const tmp = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    svg.appendChild(tmp);
    const lens = segs.map((sd) => { tmp.setAttribute('d', sd); return tmp.getTotalLength() / L; });
    stops = desktop ? cards.map((_, i) => lens[2 * i]) : lens;
    tmp.remove();
    fg.style.strokeDasharray = L; fg.style.strokeDashoffset = L;
  }

  let follow = null; // desktop: keep the cursor in view by sliding the canvas
  function at(p) {
    p = Math.max(0, Math.min(1, p));
    const pt = fg.getPointAtLength(p * L);
    if (follow) follow(pt.x);
    gsap.set(cur, { x: pt.x - 4, y: pt.y - 4 });
    fg.style.strokeDashoffset = L * (1 - p);
    let on = -1;
    stops.forEach((s, i) => { if (p >= s - 0.015) on = i; });
    if (on !== last) { cards.forEach((c, i) => c.classList.toggle('is-on', i === on)); last = on; }
  }

  const mm = gsap.matchMedia();
  mm.add('(min-width: 1024px)', () => {
    layout(true);
    const dist = () => Math.max(0, track.offsetWidth - stage.clientWidth);
    const st = ScrollTrigger.create({
      trigger: root, start: () => 'top top+=' + Math.max(0, (innerHeight - root.offsetHeight) / 2), end: () => '+=' + (dist() + innerHeight * 0.6),
      pin: true, pinSpacing: true, scrub: 0.8, invalidateOnRefresh: true,
      onRefresh: () => layout(true),
      onUpdate: (self) => at(self.progress),
    });
    follow = (x) => gsap.set(track, { x: Math.max(-dist(), Math.min(0, stage.clientWidth * 0.5 - x)) });
    at(0);
    return () => { st.kill(); follow = null; gsap.set(track, { x: 0 }); };
  });
  mm.add('(max-width: 1023px)', () => {
    layout(false);
    const st = ScrollTrigger.create({
      trigger: stage, start: 'top 60%', end: 'bottom 60%', scrub: 0.6, invalidateOnRefresh: true,
      onRefresh: () => layout(false),
      onUpdate: (self) => at(self.progress),
    });
    at(0);
    return () => st.kill();
  });
  addEventListener('load', () => ScrollTrigger.refresh());
})();
