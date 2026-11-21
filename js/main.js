/* =========================================================
   Manpreet Kaur - Portfolio · animations
   GSAP + ScrollTrigger + Lenis
   ========================================================= */
gsap.registerPlugin(ScrollTrigger);

/* ---------- easing curves taken from the Figma prototype ---------- */
const EASE_OUT = 'expo.out';            // ≈ cubic-bezier(.16,1,.3,1)
const EASE_INOUT = 'power3.inOut';      // ≈ cubic-bezier(.65,0,.35,1) / (.76,0,.24,1)
const EASE_POP = 'back.out(1.7)';       // ≈ cubic-bezier(.34,1.4,.64,1)

/* ---------- smooth scroll ---------- */
const lenis = new Lenis({ duration: 1.15, smoothWheel: true, wheelMultiplier: 0.9 });
lenis.on('scroll', ScrollTrigger.update);
gsap.ticker.add((t) => lenis.raf(t * 1000));
gsap.ticker.lagSmoothing(0);
document.querySelectorAll('a[href^="#"]').forEach((a) => a.addEventListener('click', (e) => {
  const id = a.getAttribute('href'); if (id.length < 2) return;
  const el = document.querySelector(id); if (!el) return;
  e.preventDefault(); document.body.classList.remove('menu-open'); lenis.start(); lenis.scrollTo(el, { offset: id === '#top' ? 0 : -20, duration: 1.6, force: true });
}));

/* stage unit: 1 Figma px inside the 16:9 pinned scenes */
const su = () => document.querySelector('.work3d__stage').clientWidth / 1920;
const IMG = (n) => `images/mkp-${n}.jpg`;

/* =========================================================
   BUILD DYNAMIC MARKUP
   ========================================================= */
/* --- selected work wall (6 × 5 tiles, each at its own depth) --- */
const WALL = ['fd_hero','ph_hero','mkp-kora','nv_home_c','zp_dark','gd_home_c','ps_hero','nx_dash','skx_hero','tr_home','mkp-oddpaper','cw_ds_c','vl_1','bx_home_c','mkp-halcyon','ns_home_c','mkp-idea','fl_home_c','ch_home_c','mkp-vekta','hk_2','yg_home_c','mo_cover','nd_home_c','mkp-cargo','uf_home_c','zp_city','sh_home_c','mkp-forma','nx_analytics'];  // one screen per project, no repeats
const Z = [-420,-120,-300,-60,-480,-200,-260,-40,-360,-150,-90,-310,-220,-380,0,-170,-450,-80,-280,-130,-400,-240,-60,-340,-190,-500,-110,-270,-30,-390];
const TL = 400, TH = 225, G = 40, X0 = -360, Y0 = -122, TARGET = 14;
const wall = document.getElementById('wall');
WALL.forEach((n, i) => {
  const c = i % 6, r = Math.floor(i / 6);
  const t = document.createElement('div');
  t.className = 'tile';
  t.style.backgroundImage = `url(images/${n}.jpg)`;
  t.style.left = `calc(${X0 + c * (TL + G)} * var(--su))`;
  t.style.top = `calc(${Y0 + r * (TH + G)} * var(--su))`;
  if (i === TARGET) t.style.borderRadius = '0';
  t.dataset.r = r; t.dataset.c = c; t.dataset.z = Z[i];
  wall.appendChild(t);
});

/* --- featured project titles --- */
const FEAT = [
  ['HALCYON', 'FOOTWEAR E-COMMERCE', 'Animated hero  ·  Product page  ·  Cart'],
  ['KORA', 'HEADPHONES LAUNCH', 'Product storytelling  ·  Colourways'],
  ['VEKTA', 'RUNNING-SHOE BRAND', 'Product showcase  ·  Size picker'],
  ['CARGO', 'LOGISTICS SAAS', 'Tracking dashboard  ·  Animated hero'],
];
const ftWrap = document.getElementById('ftitles');
FEAT.forEach(([a, b, m], i) => {
  ftWrap.insertAdjacentHTML('beforeend', `<div class="ft" data-i="${i}">
    <div class="ft__c1"><span class="ft__t1">${a}</span></div>
    <div class="ft__c2"><span class="ft__t2">${b}</span></div>
    <p class="ft__meta">${m}</p><p class="ft__num">0${i + 1} / 04</p></div>`);
});

/* --- all-projects grid --- */
const PROJ = [
  ['FLOWDECK', 'fd_hero', 'AI SaaS platform', 'Web app · Mobile · Design system', 'flowdeck'],
  ['NEXUS', 'nx_dash', 'Workflow SaaS', 'Dashboard · Workflow builder · AI', 'nexus'],
  ['HALCYON', 'mkp-halcyon', 'Footwear e-commerce', 'Animated hero · Product page · Cart', 'halcyon'],
  ['PINEHAVEN', 'ph_hero', 'Hospitality website', 'Lodge finder · Booking · Experiences', 'pinehaven'],
  ['KORA', 'mkp-kora', 'Headphones launch site', 'Product storytelling · Colourways', 'kora'],
  ['TRAILO', 'tr_shot', 'Trek booking platform', 'Explore · Trek detail · Booking', 'trailo'],
];
const ARROW = '<svg viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><path d="M6 18L18 6M8 6h10v10"/></svg>';
document.getElementById('projectGrid').innerHTML = PROJ.map(([t, k, a, b, p]) => `
  <a class="proj" href="projects/${p}.html">
    <div class="proj__img"><img src="images/${k}.jpg" alt="${t} - ${a}" loading="lazy"><span class="proj__year">2026</span></div>
    <div class="proj__meta"><h3>${t}</h3><p>${a}</p><small>${b}</small><span class="proj__go">${ARROW}</span></div>
  </a>`).join('');

/* --- services wheel cards (simple, readable faces + line drawings) --- */
const SV = [
  ['UI/UX DESIGN', 'Web & mobile app UI/UX built around real user journeys.'],
  ['SAAS & DASHBOARDS', 'SaaS dashboards & admin panels that feel simple to use.'],
  ['WEBSITE DESIGN', 'Conversion-focused sites for Shopify, WordPress & Framer.'],
  ['LANDING PAGES & CRO', 'Landing pages that turn visitors into paying customers.'],
  ['ANIMATED HERO & PROTOTYPES', 'Scroll-stopping heroes & clickable Figma prototypes.'],
  ['DESIGN SYSTEMS', 'Figma components & tokens that keep products consistent.'],
];
const THEME = [['#FFF3EE', '#141414', '#FF5A1F'], ['#FF5A1F', '#FFFFFF', '#141414'], ['#1E1B19', '#FFFFFF', '#FF5A1F']];
const art = (i, c, a) => {
  const s = `stroke="${c}" stroke-width="3" fill="none" stroke-linecap="round" stroke-linejoin="round"`;
  return [
    `<rect x="50" y="0" width="70" height="128" rx="12" ${s}/><rect x="62" y="22" width="46" height="8" rx="4" fill="${c}"/><rect x="62" y="38" width="34" height="6" rx="3" fill="${a}"/><rect x="62" y="56" width="46" height="34" rx="6" ${s}/><path d="M118 70v26l7-7 6 12 5-2-6-12h10z" fill="${a}"/>`,
    `<rect x="0" y="4" width="170" height="120" rx="10" ${s}/><rect x="30" y="54" width="18" height="70" rx="3" fill="${c}"/><rect x="60" y="84" width="18" height="40" rx="3" fill="${c}"/><rect x="90" y="68" width="18" height="56" rx="3" fill="${c}"/><rect x="120" y="100" width="18" height="24" rx="3" fill="${a}"/><path d="M18 66 60 46 92 56 140 24" stroke="${a}" stroke-width="3" fill="none" stroke-linecap="round"/>`,
    `<rect x="0" y="4" width="170" height="120" rx="10" ${s}/><path d="M0 28V14a10 10 0 0 1 10-10h150a10 10 0 0 1 10 10v14z" fill="${c}"/><circle cx="14" cy="16" r="4" fill="${a}"/><circle cx="28" cy="16" r="4" fill="${a}"/><rect x="14" y="40" width="90" height="14" rx="4" fill="${c}"/><rect x="14" y="62" width="60" height="8" rx="4" fill="${c}"/><rect x="14" y="82" width="44" height="18" rx="9" fill="${a}"/><rect x="116" y="40" width="40" height="60" rx="6" ${s}/>`,
    `<path d="M10 10h150l-50 54v54l-50-14V64z" ${s}/><path d="M112 108 158 62M136 60h22v22" stroke="${a}" stroke-width="3.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`,
    `<circle cx="45" cy="65" r="45" ${s}/><path d="M34 48v34l28-17z" ${s}/><path d="M100 94c20 0 30-60 60-60" stroke="${a}" stroke-width="3.5" fill="none" stroke-linecap="round"/><circle cx="101" cy="95" r="5" fill="${a}"/><circle cx="161" cy="35" r="5" fill="${a}"/>`,
    `<rect x="10" y="8" width="64" height="52" rx="10" ${s}/><circle cx="122" cy="34" r="26" ${s}/><rect x="10" y="74" width="64" height="30" rx="15" fill="${a}"/><rect x="96" y="76" width="60" height="28" rx="14" ${s}/><circle cx="138" cy="90" r="10" fill="${c}"/>`,
  ][i];
};
const ring = document.getElementById('ring');
SV.forEach(([t, d], i) => {
  const [bg, fg, ac] = THEME[i % 3];
  const accent = bg === '#FF5A1F' ? '#141414' : '#FF5A1F';
  ring.insertAdjacentHTML('beforeend', `<div class="sv__slot" style="transform:rotateX(${-60 * i}deg)">
    <article class="sv__card" style="background:${bg};color:${fg}">
      <p class="no" style="color:${bg === '#FF5A1F' ? '#141414' : '#FF5A1F'}">0${i + 1}</p><p class="k">SERVICE</p>
      <svg viewBox="0 0 170 130">${art(i, fg, accent)}</svg>
      <h3 class="${t.length > 20 ? 'long' : ''}">${t}</h3><p class="d">${d}</p>
    </article></div>`);
});

/* =========================================================
   HERO INTRO (plays on load)
   ========================================================= */
const intro = gsap.timeline({ defaults: { ease: EASE_OUT } });
intro
  .from('.nav > *', { y: -30, opacity: 0, duration: 0.6, stagger: 0.05 }, 0.05)
  .from('.hero__line', { yPercent: 110, duration: 0.9, stagger: 0.15 }, 0.2)
  .from('.hero__girl', { x: () => -window.innerWidth * 0.55, duration: 1.8 }, 0.5)
  .from('.hero__guy', { x: () => window.innerWidth * 0.55, duration: 1.8 }, 0.6)
  .from('.hero__dog', { x: () => -window.innerWidth * 0.4, duration: 1.6 }, 0.9)
  .from('.sticker', { scale: 0.2, opacity: 0, duration: 0.5, stagger: 0.15, ease: EASE_POP }, 1.4)
  .from('.hero__sub', { opacity: 0, y: 20, duration: 0.6 }, 2.0)
  .from('.hero__loop--l', { rotation: -20, opacity: 0, duration: 3 }, 0)
  .from('.hero__loop--r', { rotation: 25, opacity: 0, duration: 3 }, 0);
/* idle "walking" bob after they arrive */
intro.add(() => {
  gsap.to('.hero__girl', { y: -10, rotation: -3, duration: 0.55, ease: 'sine.inOut', yoyo: true, repeat: -1 });
  gsap.to('.hero__guy', { y: -10, rotation: 2, duration: 0.6, ease: 'sine.inOut', yoyo: true, repeat: -1, delay: 0.2 });
  gsap.to('.hero__dog', { y: -6, duration: 0.35, ease: 'sine.inOut', yoyo: true, repeat: -1 });
  gsap.to('.sticker', { y: -6, duration: 1.6, ease: 'sine.inOut', yoyo: true, repeat: -1, stagger: 0.3 });
}, 2.6);
/* hero parallax on scroll */
gsap.to('.hero__title', { yPercent: -25, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });

/* ---------- ribbon marquee (speeds up with scroll velocity) ---------- */
const marquee = gsap.to('.ribbon__track', { xPercent: -50, ease: 'none', duration: 22, repeat: -1 });
ScrollTrigger.create({ onUpdate: (s) => {
  const v = gsap.utils.clamp(-4, 4, s.getVelocity() / 600);
  gsap.to(marquee, { timeScale: 1 + Math.abs(v), duration: 0.3, overwrite: true });
} });

/* ---------- generic reveals ---------- */
ScrollTrigger.batch('.reveal', {
  start: 'top 88%',
  onEnter: (els) => gsap.fromTo(els, { y: 50, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, ease: EASE_OUT, stagger: 0.1, overwrite: true, clearProps: 'transform' }),
});
gsap.set('.reveal', { opacity: 0 });
gsap.from('.stat', { y: 60, opacity: 0, duration: 0.8, ease: EASE_OUT, stagger: 0.1, scrollTrigger: { trigger: '.stats', start: 'top 85%' } });
gsap.from('.proj', { y: 80, opacity: 0, duration: 0.9, ease: EASE_OUT, stagger: 0.15, scrollTrigger: { trigger: '.grid2', start: 'top 80%' } });

/* =========================================================
   SELECTED WORK - 3D wall → camera push → project wipes (pinned + scrubbed)
   ========================================================= */
(() => {
  const tiles = gsap.utils.toArray('.tile');
  const feats = gsap.utils.toArray('.feature');
  const fts = gsap.utils.toArray('.ft');
  const tc = { x: X0 + 2 * (TL + G) + TL / 2, y: Y0 + 2 * (TH + G) + TH / 2 };
  const Zt = 1500 * (1 - TL / 1920); // depth that makes the 400px tile fill 1920px

  tiles.forEach((t) => gsap.set(t, { z: () => +t.dataset.z * su() }));

  const tl = gsap.timeline({
    defaults: { ease: 'none' },
    scrollTrigger: { trigger: '.work3d', start: 'top top', end: '+=420%', pin: true, scrub: 1, anticipatePin: 1, invalidateOnRefresh: true },
  });
  // 1. tiles fall into the wall
  tiles.forEach((t) => {
    const r = +t.dataset.r, c = +t.dataset.c;
    const d = (4 - r) * 0.14 + ((c * 7 + r * 3) % 5) * 0.06;
    tl.fromTo(t, { y: () => (-1400 - r * 120) * su(), opacity: 0 }, { y: 0, opacity: 1, duration: 1.4, ease: EASE_OUT }, d);
  });
  // 2. camera push into HALCYON
  const TP = 2.6;
  tl.to(wall, { x: () => (960 - tc.x) * su(), y: () => (540 - tc.y) * su(), z: () => Zt * su(), duration: 1.5, ease: EASE_INOUT }, TP);
  const TT = TP + 1.5;
  tl.to(feats[0], { opacity: 1, duration: 0.15 }, TT - 0.15)
    .to('.work3d__shade', { opacity: 1, duration: 0.5 }, TT);
  // 3. wipes are scrubbed with the scroll; titles play on their own (never left half-revealed)
  const sw = [TT, TT + 2.2, TT + 4.2, TT + 6.2];
  feats.forEach((f, i) => {
    if (!i) return;
    gsap.set(f, { yPercent: 100 }); gsap.set(f.querySelector('img'), { yPercent: -100 });
    tl.to(f, { yPercent: 0, duration: 0.9, ease: EASE_INOUT }, sw[i])
      .to(f.querySelector('img'), { yPercent: 0, duration: 0.9, ease: EASE_INOUT }, sw[i]);
  });
  fts.forEach((ft) => { gsap.set(ft.querySelectorAll('.ft__t1'), { yPercent: 110 }); gsap.set(ft.querySelectorAll('.ft__t2'), { yPercent: 120 }); });
  let active = -1;
  const showTitle = (n) => {
    if (n === active) return;
    const prev = fts[active], next = fts[n];
    const dir = n > active ? 1 : -1;
    if (prev) {
      gsap.to(prev.querySelectorAll('.ft__t1, .ft__t2'), { yPercent: -110 * dir, duration: 0.55, ease: EASE_INOUT, overwrite: true });
      gsap.to(prev.querySelectorAll('.ft__meta, .ft__num'), { opacity: 0, duration: 0.3, overwrite: true });
    }
    if (next) {
      gsap.fromTo(next.querySelector('.ft__t1'), { yPercent: 110 * dir }, { yPercent: 0, duration: 0.9, delay: 0.15, ease: EASE_OUT, overwrite: true });
      gsap.fromTo(next.querySelector('.ft__t2'), { yPercent: 120 * dir }, { yPercent: 0, duration: 0.9, delay: 0.27, ease: EASE_OUT, overwrite: true });
      gsap.to(next.querySelectorAll('.ft__meta, .ft__num'), { opacity: 1, duration: 0.5, delay: 0.3, overwrite: true });
    }
    gsap.to('.viewcase', { opacity: n >= 0 ? 1 : 0, duration: 0.4, overwrite: true });
    if (n >= 0) document.getElementById('viewcase').href = 'projects/' + ['halcyon', 'kora', 'vekta', 'cargo'][n] + '.html';
    active = n;
  };
  tl.eventCallback('onUpdate', () => {
    const t = tl.time();
    let n = -1; sw.forEach((s, i) => { if (t >= s + (i ? 0.55 : -0.1)) n = i; });
    showTitle(n);
  });
  tl.to({}, { duration: 1.2 }); // hold on the last project
})();

/* =========================================================
   SERVICES - 3D wheel (pinned + scrubbed)
   ========================================================= */
(() => {
  const tl = gsap.timeline({
    defaults: { ease: 'none' },
    scrollTrigger: { trigger: '.services3d', start: 'top top', end: '+=480%', pin: true, scrub: 1, anticipatePin: 1, invalidateOnRefresh: true, onUpdate: () => svSync() },
  });
  gsap.set(ring, { rotationX: 0 }); // card 01 faces the viewer first // card 01 faces the viewer first
  tl.to(ring, { rotationX: 0, duration: 0.95, ease: EASE_INOUT }, 0.4)
    .to('#svFill', { width: `${100 / 6}%`, duration: 0.95, ease: EASE_INOUT }, 0.4);
  let t = 0.4 + 0.95;
  for (let i = 1; i < 6; i++) {
    t += 0.5; // hold on each card
    tl.to(ring, { rotationX: i * 60, duration: 0.95, ease: EASE_INOUT }, t)
      .to('#svFill', { width: `${(100 / 6) * (i + 1)}%`, duration: 0.95, ease: EASE_INOUT }, t);
    t += 0.95;
  }
  t += 0.9;
  tl.to(ring, { rotationX: 380, duration: 1.2, ease: EASE_INOUT }, t)
    .to('#svStage', { y: () => -window.innerHeight * 1.35, duration: 1.2, ease: EASE_INOUT }, t + 0.3)
    .to('.services3d .lbl, .sv__ctrl', { opacity: 0, duration: 0.4 }, t + 0.3)
    .to('#edge', { y: () => -(window.innerHeight * 0.5 + document.getElementById('edge').offsetHeight * 0.5), duration: 1.2, ease: EASE_INOUT }, t + 0.5)
    .to('#edge', { x: () => -(document.getElementById('edge').scrollWidth - window.innerWidth * 0.55), duration: 3.2, ease: 'power1.inOut' }, t + 1.1);

  /* ---------- manual controls: ‹ 01 / 06 › ----------
     The wheel is driven by scroll, so the arrows scroll the page to the exact
     point where each card has finished turning; the bar keeps filling as before. */
  // var (not const): ScrollTrigger may call svSync() before these lines run
  var N = SV.length;
  var num = document.getElementById('svNum'), name = document.getElementById('svName');
  var prev = document.getElementById('svPrev'), next = document.getElementById('svNext');
  var cur = 0;
  const settled = (i) => 1.35 + 1.45 * i + 0.2; // timeline time where card i rests
  function svSync() {
    if (!num) return;
    const i = Math.max(0, Math.min(N - 1, Math.round(gsap.getProperty(ring, 'rotationX') / 60)));
    if (i === cur) return;
    const dir = i > cur ? 1 : -1;
    cur = i;
    gsap.timeline()
      .to(num, { yPercent: -100 * dir, duration: 0.18, ease: 'power2.in' })
      .add(() => { num.textContent = String(i + 1).padStart(2, '0'); name.textContent = SV[i][0]; var dsc = document.getElementById('svDesc'); if (dsc) dsc.textContent = SV[i][1]; })
      .fromTo(num, { yPercent: 100 * dir }, { yPercent: 0, duration: 0.35, ease: EASE_POP });
    gsap.fromTo(name, { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: 0.4, ease: EASE_OUT });
    prev.disabled = i === 0;
    next.disabled = i === N - 1;
  }
  const goTo = (i) => {
    i = Math.max(0, Math.min(N - 1, i));
    const st = tl.scrollTrigger;
    const y = st.start + (settled(i) / tl.duration()) * (st.end - st.start);
    lenis.scrollTo(y, { duration: 1.1, force: true });
  };
  prev.addEventListener('click', () => goTo(cur - 1));
  next.addEventListener('click', () => goTo(cur + 1));
  // ← / → keys work while the wheel is on screen
  window.addEventListener('keydown', (e) => {
    if (!tl.scrollTrigger.isActive || e.target.closest('input, textarea, select')) return;
    if (e.key === 'ArrowRight') { e.preventDefault(); goTo(cur + 1); }
    if (e.key === 'ArrowLeft') { e.preventDefault(); goTo(cur - 1); }
  });
})();

/* =========================================================
   OTHER SECTIONS
   ========================================================= */
gsap.from('.steps__line', { scaleX: 0, duration: 1.4, ease: EASE_INOUT, scrollTrigger: { trigger: '.steps', start: 'top 80%' } });
gsap.from('.step__dot', { scale: 0, duration: 0.6, ease: EASE_POP, stagger: 0.2, scrollTrigger: { trigger: '.steps', start: 'top 80%' } });

gsap.utils.toArray('.q').forEach((q, i) => {
  gsap.from(q, { scale: 0.6, opacity: 0, duration: 0.8, ease: EASE_POP, delay: i * 0.12, scrollTrigger: { trigger: '.reviews', start: 'top 55%' } });
});
gsap.from('.reviews .kicker, .reviews .h2, .badge', { y: 50, opacity: 0, duration: 0.8, ease: EASE_OUT, stagger: 0.1, scrollTrigger: { trigger: '.reviews', start: 'top 75%' } });

gsap.from('.tool', { scale: 0.3, opacity: 0, duration: 0.6, ease: EASE_POP, stagger: 0.07, scrollTrigger: { trigger: '.tools__row', start: 'top 85%' } });

gsap.from('.cta__l', { yPercent: 110, duration: 1, ease: EASE_OUT, stagger: 0.2, scrollTrigger: { trigger: '.cta', start: 'top 60%' } });
gsap.from('.cta__sub, .cta__btns', { y: 40, opacity: 0, duration: 0.8, ease: EASE_OUT, stagger: 0.1, scrollTrigger: { trigger: '.cta', start: 'top 45%' } });
gsap.from('.cta__girl', { x: () => window.innerWidth * 0.5, duration: 1.6, ease: EASE_OUT, scrollTrigger: { trigger: '.cta', start: 'top 60%' } });
gsap.from('.cta__dog', { x: () => window.innerWidth * 0.4, duration: 1.4, delay: 0.3, ease: EASE_OUT, scrollTrigger: { trigger: '.cta', start: 'top 60%' } });
gsap.from('.footer__big', { yPercent: 60, opacity: 0, duration: 1.2, ease: EASE_OUT, scrollTrigger: { trigger: '.footer', start: 'top 90%' } });

/* ---------- FAQ accordion ---------- */
document.querySelectorAll('.fq').forEach((fq) => {
  const a = fq.querySelector('.fq__a');
  fq.querySelector('button').addEventListener('click', () => {
    const open = fq.classList.contains('open');
    document.querySelectorAll('.fq.open').forEach((o) => {
      if (o === fq) return; o.classList.remove('open');
      gsap.fromTo(o.querySelector('.fq__a'), { height: o.querySelector('.fq__a').scrollHeight }, { height: 0, duration: 0.5, ease: EASE_INOUT });
    });
    if (open) { fq.classList.remove('open'); gsap.fromTo(a, { height: a.scrollHeight }, { height: 0, duration: 0.5, ease: EASE_INOUT }); }
    else { fq.classList.add('open'); gsap.fromTo(a, { height: 0 }, { height: a.scrollHeight, duration: 0.6, ease: EASE_INOUT, onComplete: () => { a.style.height = 'auto'; ScrollTrigger.refresh(); } }); }
  });
});

/* ---------- navbar: solid bar once you scroll, colour adapts on dark sections ---------- */
ScrollTrigger.create({ start: 60, end: 'max', onToggle: (s) => document.body.classList.toggle('nav-solid', s.isActive) });
document.querySelectorAll('.dark').forEach((sec) => {
  const host = sec.parentElement.classList.contains('pin-spacer') ? sec.parentElement : sec;
  ScrollTrigger.create({
    trigger: host, start: 'top 100px', end: 'bottom 100px',
    onToggle: (s) => document.body.classList.toggle('nav-dark', s.isActive),
  });
});

window.addEventListener('load', () => ScrollTrigger.refresh());
