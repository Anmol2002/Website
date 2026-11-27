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

/* Location: scroll-driven map. It starts on all of India; as you scroll it zooms north and tilts into 3D,
   Punjab lifts up in orange with the neighbouring state names, then it closes in and a pin drops on Mohali.
   The SVG (real state boundaries) is fetched only when the map is close, to keep the page light. */
(() => {
  const map = document.querySelector('.abx-loc__map');
  if (!map) return;
  const wrap = map.querySelector('.abx-loc__svgwrap');
  const plane = map.querySelector('.abx-loc__plane');
  const pin = map.querySelector('.abx-loc__pin');
  const tag = map.querySelector('.abx-loc__tag');
  const tip = map.querySelector('.abx-loc__tip');
  const steps = [...map.querySelectorAll('.abx-loc__steps li')];
  const nums = (s) => s.split(' ').map(Number);
  const IN = nums(map.dataset.india), PB = nums(map.dataset.punjab), MO = nums(map.dataset.mohali);
  const NAMES = { 'Jammu & Kashmir': 'Jammu & Kashmir · Ladakh', 'Arunanchal Pradesh': 'Arunachal Pradesh', 'Andaman & Nicobar Island': 'Andaman & Nicobar Islands', 'Dadara & Nagar Havelli': 'Dadra & Nagar Haveli', 'NCT of Delhi': 'Delhi' };

  // a viewBox around a box (x1 y1 x2 y2) that matches the map's on-screen shape
  const fit = (x1, y1, x2, y2, pad) => {
    const r = map.clientWidth / Math.max(1, map.clientHeight);
    let w = (x2 - x1) * pad * F, h = (y2 - y1) * pad * F;
    if (w / h < r) w = h * r; else h = w / r;
    const cx = (x1 + x2) / 2, cy = (y1 + y2) / 2;
    return `${(cx - w / 2).toFixed(1)} ${(cy - h / 2).toFixed(1)} ${w.toFixed(1)} ${h.toFixed(1)}`;
  };
  const F = 1.5; // the plane is 1.5x the card (so its edges never show when tilted)
  const vbIndia = () => fit(IN[0], IN[1], IN[2], IN[3], 1.14);
  const vbPunjab = () => { const cx = (PB[0] + PB[2]) / 2 + 20, cy = (PB[1] + PB[3]) / 2 + 20, w = (PB[2] - PB[0]) * 1.9, h = (PB[3] - PB[1]) * 1.9; return fit(cx - w / 2, cy - h / 2, cx + w / 2, cy + h / 2, 1); };
  const vbMohali = () => { const w = (PB[2] - PB[0]) * 1.62, h = (PB[3] - PB[1]) * 1.22, cx = MO[0] - 44, cy = MO[1] + 4; return fit(cx - w / 2, cy - h / 2, cx + w / 2, cy + h / 2, 1); };

  let loaded = false;
  const load = () => {
    if (loaded) return; loaded = true;
    fetch(map.dataset.src).then((r) => r.text()).then((txt) => { wrap.innerHTML = txt; build(); }).catch(() => {});
  };

  function build() {
    const svg = wrap.querySelector('svg');
    svg.setAttribute('preserveAspectRatio', 'xMidYMid meet');
    svg.setAttribute('viewBox', vbIndia());
    const statesG = svg.querySelector('.m-states');
    const top = svg.querySelector('.m-pb__top'), side = svg.querySelector('.m-pb__side');
    const labels = svg.querySelectorAll('.m-lbl text');
    const pbLabel = svg.querySelector('.m-lbl__pb');
    const dot = svg.querySelector('.m-mohali');

    // hover: state name follows the pointer (desktop)
    if (matchMedia('(hover:hover) and (pointer:fine)').matches) {
      svg.addEventListener('pointermove', (e) => {
        const p = e.target.closest('.m-states path, .m-pb path');
        if (!p) { tip.classList.remove('is-on'); return; }
        const n = p.dataset.n || 'Punjab', r = map.getBoundingClientRect();
        tip.textContent = NAMES[n] || n;
        tip.style.left = (e.clientX - r.left) + 'px'; tip.style.top = (e.clientY - r.top) + 'px';
        tip.classList.add('is-on');
      });
      svg.addEventListener('pointerleave', () => tip.classList.remove('is-on'));
    }

    const placePin = () => {
      const d = dot.getBoundingClientRect(), r = map.getBoundingClientRect();
      pin.style.transform = `translate(${d.left + d.width / 2 - r.left}px, ${d.top + d.height / 2 - r.top}px)`;
    };

    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined' || matchMedia('(prefers-reduced-motion: reduce)').matches) {
      svg.setAttribute('viewBox', vbPunjab()); top.style.fill = '#FF5A1F'; side.style.fill = '#9c3510';
      map.classList.add('is-static'); steps.forEach((s, i) => s.classList.toggle('is-on', i === 2));
      requestAnimationFrame(placePin); addEventListener('resize', () => { svg.setAttribute('viewBox', vbPunjab()); placePin(); });
      return;
    }

    gsap.set(plane, { transformPerspective: 1400, transformOrigin: '50% 58%' });
    gsap.from(statesG.children, { opacity: 0, duration: 0.7, ease: 'power2.out', stagger: { each: 0.025, from: 'random' } });

    const setStep = (p) => {
      const i = p < 0.36 ? 0 : p < 0.72 ? 1 : 2;
      steps.forEach((s, k) => s.classList.toggle('is-on', k === i));
      map.classList.toggle('is-moved', p > 0.03);
    };
    const tl = gsap.timeline({
      defaults: { ease: 'power2.inOut' },
      scrollTrigger: {
        trigger: map, start: 'top 92%', end: 'bottom 96%', scrub: 0.6, invalidateOnRefresh: true,
        onUpdate: (st) => setStep(st.progress),
        onRefresh: placePin,
      },
    });
    tl.to(svg, { attr: { viewBox: vbPunjab }, duration: 1 }, 0)
      .to(plane, { rotationX: 46, rotationZ: -8, scale: 1.22, yPercent: 3, duration: 1 }, 0)
      .to(statesG, { opacity: 0.62, duration: 0.5 }, 0.35)
      .to([top, pbLabel], { y: -3.2, duration: 0.55 }, 0.42)
      .to(top, { fill: '#FF5A1F', duration: 0.55 }, 0.42)
      .to(side, { fill: '#9c3510', duration: 0.55 }, 0.42)
      .to(labels, { opacity: 1, duration: 0.4, stagger: 0.04 }, 0.6)
      .to(svg, { attr: { viewBox: vbMohali }, duration: 0.8 }, 1.05)
      .to(plane, { rotationX: 52, rotationZ: -12, duration: 0.8 }, 1.05)
      .fromTo(pin, { autoAlpha: 0, '--drop': 0 }, { autoAlpha: 1, duration: 0.25, ease: 'power1.out' }, 1.5)
      .fromTo(pin.querySelector('.abx-loc__drop'), { y: -60, scale: 0.6 }, { y: 0, scale: 1, duration: 0.35, ease: 'back.out(2.2)' }, 1.5)
      .fromTo(pin.querySelector('b'), { autoAlpha: 0, x: -10 }, { autoAlpha: 1, x: 0, duration: 0.25 }, 1.65)
      .fromTo(tag, { autoAlpha: 0, y: 24 }, { autoAlpha: 1, y: 0, duration: 0.3, ease: 'power2.out' }, 1.6);
    tl.eventCallback('onUpdate', placePin); // follows the smoothed zoom, frame by frame
    ScrollTrigger.refresh();
    placePin();
  }

  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((es) => { if (es.some((e) => e.isIntersecting)) { io.disconnect(); load(); } }, { rootMargin: '900px 0px' });
    io.observe(map);
  } else load();
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
      5: () => { F(q('.bub--u'), { x: 40, autoAlpha: 0 }, A); F(q('.bub--ai'), { x: -40, autoAlpha: 0 }, A + 0.8); tl.to(q('.dots'), { autoAlpha: 0, duration: 0.3 }, A + 2.2); tl.to(q('.bub--ai em'), { opacity: 1, duration: 0.5 }, A + 2.3); F(q('.sc-sum'), { autoAlpha: 0, y: 20 }, A + 3); F(q('.sc-sum .r i'), { scaleX: 0, stagger: 0.2, duration: 1.2 }, A + 3.4); F(q('.sc-why'), { autoAlpha: 0, y: 10 }, t + 7); },
      6: () => { F(q('.sc-lvl'), { y: 30, autoAlpha: 0 }, A); tl.to(q('.bar i'), { scaleX: 1, duration: 4, ease: 'none' }, A + 0.6); F(q('.sc-chips em'), { scale: 0, stagger: 0.15, ease: 'back.out(2)' }, A + 2); F(q('.sc-tiles span'), { autoAlpha: 0, y: 24, stagger: 0.25 }, A + 3.2); },
      7: () => { F(q('.sc-next'), { scale: 0.9, autoAlpha: 0 }, A); F(q('.sc-go'), { y: 20, autoAlpha: 0 }, A + 0.7); },
    })[i]();

    // the cursor works on the scene, then on the comments
    const target = sc.querySelector('[data-cx]');
    tl.to(cur, { x: pct(target, 'x'), y: pct(target, 'y'), duration: 1.8, ease: 'power2.inOut' }, t + 1);
    const tws = ch.querySelectorAll('.tw');
    if (tws.length) {
      F(tws[0], { autoAlpha: 0, y: 14 }, t + 3.4);
      F(tws[1], { autoAlpha: 0, y: 14 }, t + 5.4);
    } else {
      tl.to(cur, { x: () => { const g = sc.querySelector('.sc-go'); return g.offsetLeft + sc.querySelector('.sc-next').offsetLeft + g.offsetWidth * 0.7; }, y: () => { const g = sc.querySelector('.sc-go'); return g.offsetTop + sc.querySelector('.sc-next').offsetTop + g.offsetHeight * 0.6; }, duration: 1.4, ease: 'power2.inOut' }, t + 3.2);
    }
  });
  tl.to({}, { duration: 1.5 }); // a beat on the last chapter before the page moves on

  // phones: shrink and centre each scene so it always fits inside the canvas (larger system fonts included)
  const fit = () => {
    const small = innerWidth < 1024, W = board.clientWidth, H = board.clientHeight, pad = 12;
    scs.forEach((sc) => {
      if (!small) { sc.style.scale = ''; sc.style.translate = ''; return; }
      let l = Infinity, t = Infinity, r = -Infinity, b = -Infinity;
      [...sc.children].forEach((c) => { l = Math.min(l, c.offsetLeft); t = Math.min(t, c.offsetTop); r = Math.max(r, c.offsetLeft + c.offsetWidth); b = Math.max(b, c.offsetTop + c.offsetHeight); });
      const k = Math.min(1, (W - pad * 2) / (r - l), (H - pad * 2) / (b - t));
      sc.style.scale = k.toFixed(3);
      sc.style.translate = `${(-k * ((l + r) / 2 - W / 2)).toFixed(1)}px ${(-k * ((t + b) / 2 - H / 2)).toFixed(1)}px`;
    });
  };
  fit(); addEventListener('resize', fit); addEventListener('load', fit); document.fonts && document.fonts.ready.then(fit);

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
