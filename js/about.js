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

/* Journey · story mode. The section pins and one scroll-scrubbed timeline plays 8 chapters:
   the chapter text changes on the left while "Manpreet" works on a Figma-like canvas on the right,
   a red comment raises the roadblock and a green one answers it with what she learned. */
(() => {
  const root = document.querySelector('.abx-js');
  if (!root) return;
  const chs = [...root.querySelectorAll('.abx-js__ch')];
  const scs = [...root.querySelectorAll('.abx-js__sc')];
  const rail = [...root.querySelectorAll('.abx-js__rail li')];
  const board = root.querySelector('.abx-js__board');
  const cur = root.querySelector('.abx-js__cur');
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined' || matchMedia('(prefers-reduced-motion: reduce)').matches) { root.classList.add('is-static'); return; }

  // split chapter titles into words for the reveal
  chs.forEach((c) => { const h = c.querySelector('h3'); h.innerHTML = h.textContent.split(' ').map((w) => `<span class="w"><span>${w}</span></span>`).join(' '); });

  const N = chs.length, SEG = 10;
  const pct = (el, k) => () => (k === 'x' ? board.clientWidth : board.clientHeight) * parseFloat(el.dataset[k === 'x' ? 'cx' : 'cy']) / 100;
  const pinXY = (cm, k) => () => { const th = cm.parentElement, p = cm.querySelector('.cm__pin'); return k === 'x' ? th.offsetLeft + cm.offsetLeft + p.offsetWidth * 0.5 : th.offsetTop + cm.offsetTop + p.offsetHeight * 0.6; }; // on the comment's pin

  const tl = gsap.timeline({ defaults: { ease: 'power2.out', duration: 1 } });
  // fromTo with explicit end states: plain .from() tweens get stuck after ScrollTrigger re-measures (invalidateOnRefresh)
  const NEUTRAL = { autoAlpha: 1, opacity: 1, x: 0, y: 0, yPercent: 0, rotate: 0, scale: 1, scaleX: 1 };
  const F = (targets, vars, at) => {
    const to = {}; Object.keys(vars).forEach((k) => { if (k in NEUTRAL) to[k] = NEUTRAL[k]; else if (k !== 'transformOrigin') to[k] = vars[k]; });
    ['stagger', 'ease', 'duration'].forEach((k) => { if (k in vars) { to[k] = vars[k]; delete vars[k]; } });
    return tl.fromTo(targets, vars, to, at);
  };
  gsap.set(chs.slice(1), { autoAlpha: 0 }); gsap.set(scs.slice(1), { autoAlpha: 0 });
  gsap.set(cur, { x: () => board.clientWidth * 0.5, y: () => board.clientHeight * 0.5 });

  chs.forEach((ch, i) => {
    const t = i * SEG, sc = scs[i], q = (sel) => sc.querySelectorAll(sel);
    const words = ch.querySelectorAll('h3 .w > span');
    if (i > 0) {
      tl.to(chs[i - 1], { autoAlpha: 0, y: -40, duration: 0.8, ease: 'power2.in' }, t - 0.4)
        .to(scs[i - 1], { autoAlpha: 0, scale: 0.96, duration: 0.8, ease: 'power2.in' }, t - 0.4);
    }
    if (i === 0) gsap.set([ch, sc], { autoAlpha: 1 }); // chapter 1 is already there when the section arrives
    else {
      tl.fromTo(ch, { autoAlpha: 0, y: 40 }, { autoAlpha: 1, y: 0, duration: 1 }, t + 0.4);
      F(words, { yPercent: 110, stagger: 0.08, duration: 0.9 }, t + 0.5);
      tl.fromTo(sc, { autoAlpha: 0, scale: 0.96 }, { autoAlpha: 1, scale: 1, duration: 1 }, t + 0.4);
    }

    // what happens on the canvas in this chapter
    const A = t + 1.4;
    ({
      0: () => { F(q('.sc-aa'), { scale: 0.3, autoAlpha: 0, transformOrigin: 'left top' }, A); F(q('.sc-sw i'), { scale: 0, stagger: 0.15 }, A + 0.6); F(q('.sc-line'), { scaleX: 0, transformOrigin: 'left', stagger: 0.2 }, A + 1.2); },
      1: () => { F(q('.sc-wire i'), { autoAlpha: 0, y: 20, stagger: 0.15 }, A); F(q('.sc-sticky'), { scale: 0.4, rotate: 20, autoAlpha: 0, ease: 'back.out(2)' }, A + 1.2); },
      2: () => { F(q('.sc-prof'), { y: 40, autoAlpha: 0 }, A); F(q('.sc-tag'), { scale: 0, stagger: 0.15, ease: 'back.out(2)' }, A + 0.8); tl.to(q('.r0'), { autoAlpha: 0, duration: 0.5 }, t + 6.8); tl.to(q('.r1'), { autoAlpha: 1, duration: 0.6 }, t + 7); },
      3: () => { F(q('.ck'), { y: 30, autoAlpha: 0, stagger: 0.15 }, A); F(q('.sc-file'), { x: -30, autoAlpha: 0 }, A + 0.9); },
      4: () => { F(q('.sc-stamp'), { scale: 2.2, rotate: -25, autoAlpha: 0, ease: 'back.out(1.6)' }, A); F(q('.sc-kpi'), { y: 30, autoAlpha: 0, stagger: 0.15 }, A + 0.8); },
      5: () => { F(q('.bub--u'), { x: 40, autoAlpha: 0 }, A); F(q('.bub--ai'), { x: -40, autoAlpha: 0 }, A + 0.8); tl.to(q('.dots'), { autoAlpha: 0, duration: 0.3 }, A + 2.2); tl.to(q('.bub--ai em'), { opacity: 1, duration: 0.5 }, A + 2.3); F(q('.sc-why'), { autoAlpha: 0, y: 10 }, t + 7); },
      6: () => { F(q('.sc-lvl'), { y: 30, autoAlpha: 0 }, A); tl.to(q('.bar i'), { scaleX: 1, duration: 4, ease: 'none' }, A + 0.6); F(q('.sc-chips em'), { scale: 0, stagger: 0.15, ease: 'back.out(2)' }, A + 2); },
      7: () => { F(q('.sc-next'), { scale: 0.9, autoAlpha: 0 }, A); F(q('.sc-go'), { y: 20, autoAlpha: 0 }, A + 0.7); },
    })[i]();

    // the cursor works on the scene, then on the comments
    const target = sc.querySelector('[data-cx]');
    tl.to(cur, { x: pct(target, 'x'), y: pct(target, 'y'), duration: 1.8, ease: 'power2.inOut' }, t + 1);
    const tws = ch.querySelectorAll('.tw');
    if (tws.length) {
      F(tws[0], { autoAlpha: 0, x: -24 }, t + 3.4);
      F(tws[1], { autoAlpha: 0, x: -24 }, t + 5.4);
    } else {
      tl.to(cur, { x: () => { const g = sc.querySelector('.sc-go'); return g.offsetLeft + sc.querySelector('.sc-next').offsetLeft + g.offsetWidth * 0.7; }, y: () => { const g = sc.querySelector('.sc-go'); return g.offsetTop + sc.querySelector('.sc-next').offsetTop + g.offsetHeight * 0.6; }, duration: 1.4, ease: 'power2.inOut' }, t + 3.2);
    }
  });
  tl.to({}, { duration: 1.5 }); // a beat on the last chapter before the page moves on

  const total = tl.duration();
  let lastOn = -1;
  ScrollTrigger.create({
    trigger: root, start: 'top top', end: () => '+=' + innerHeight * N * 0.85,
    pin: true, scrub: 0.7, animation: tl, invalidateOnRefresh: true,
    onUpdate: (self) => {
      const t = self.progress * total, on = Math.min(N - 1, Math.max(0, Math.floor((t + 0.4) / SEG)));
      root.style.setProperty('--p', Math.min(1, self.progress * total / (N * SEG - SEG + 8)));
      if (on !== lastOn) { rail.forEach((li, k) => { li.classList.toggle('is-on', k === on); li.classList.toggle('is-done', k < on); }); lastOn = on; }
    },
  });
  // chapter 1 is on screen as soon as the section arrives
  tl.progress(0.0001).progress(0);
  rail.forEach((li, k) => li.classList.toggle('is-on', k === 0));
  addEventListener('load', () => ScrollTrigger.refresh());
})();
