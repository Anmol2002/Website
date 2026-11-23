/* =========================================================
   Manpreet Kaur - inner pages (Work, About, Contact, Projects)
   GSAP + ScrollTrigger + Lenis - easings match the Figma prototype
   ========================================================= */
gsap.registerPlugin(ScrollTrigger);
const EASE_OUT = 'expo.out';
const EASE_INOUT = 'power3.inOut';
const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const desktop = window.matchMedia('(min-width: 1024px)').matches;

/* ---------- smooth scroll ---------- */
const lenis = new Lenis({ duration: 1.15, smoothWheel: true, wheelMultiplier: 0.9 });
lenis.on('scroll', ScrollTrigger.update);
gsap.ticker.add((t) => lenis.raf(t * 1000));
gsap.ticker.lagSmoothing(0);
document.querySelectorAll('a[href^="#"]').forEach((a) => a.addEventListener('click', (e) => {
  const el = document.querySelector(a.getAttribute('href'));
  if (!el) return; e.preventDefault(); lenis.scrollTo(el, { offset: -100, duration: 1.4 });
}));
if (location.hash) {
  const el = document.querySelector(location.hash);
  if (el) window.addEventListener('load', () => setTimeout(() => lenis.scrollTo(el, { offset: -100, immediate: true }), 50));
}

/* ---------- navbar: solid bar after scrolling, white text over dark sections ---------- */
ScrollTrigger.create({ start: 60, end: 'max', onToggle: (s) => document.body.classList.toggle('nav-solid', s.isActive) });
document.querySelectorAll('.dark').forEach((sec) => {
  ScrollTrigger.create({ trigger: sec, start: 'top 100px', end: 'bottom 100px', onToggle: (s) => document.body.classList.toggle('nav-dark', s.isActive) });
});

/* ---------- page intro: big title lines rise out of their mask ---------- */
const lines = gsap.utils.toArray('.ph__tl');
if (lines.length) {
  gsap.from(lines, { yPercent: 105, duration: 1.2, ease: EASE_OUT, stagger: 0.1, delay: 0.1 });
  gsap.from('.ph__k, .ab__k, .ct .kicker, .ph__top', { y: 20, opacity: 0, duration: 0.8, ease: EASE_OUT, delay: 0.05 });
  gsap.from('.ph__lead, .ct__lead', { y: 40, opacity: 0, duration: 1, ease: EASE_OUT, delay: 0.35 });
  gsap.from('.ph__m, .cl', { y: 30, opacity: 0, duration: 0.9, ease: EASE_OUT, stagger: 0.07, delay: 0.5 });
}
const heroMedia = document.querySelector('.ph__media');
if (heroMedia) {
  gsap.from(heroMedia.children, { y: 140, opacity: 0, duration: 1.4, ease: EASE_OUT, stagger: 0.12, delay: 0.55 });
  const pic = heroMedia.querySelector('.bw--hero img, .fullimg');
  if (pic && !reduce) gsap.fromTo(pic, { scale: 1.08 }, { scale: 1, ease: 'none', scrollTrigger: { trigger: heroMedia, start: 'top bottom', end: 'bottom top', scrub: true } });
}

/* ---------- generic reveals ---------- */
gsap.set('.reveal', { opacity: 0 });
ScrollTrigger.batch('.reveal', {
  start: 'top 90%',
  onEnter: (els) => gsap.fromTo(els, { y: 60, opacity: 0 }, { y: 0, opacity: 1, duration: 0.9, ease: EASE_OUT, stagger: 0.08, overwrite: true, clearProps: 'transform' }),
});
if (document.querySelector('.stats')) gsap.from('.stat', { y: 60, opacity: 0, duration: 0.8, ease: EASE_OUT, stagger: 0.1, scrollTrigger: { trigger: '.stats', start: 'top 88%' } });

/* screenshots ease in from slightly zoomed (like the Figma smart-animate) */
gsap.utils.toArray('.scr .bw img, .scr .fullimg').forEach((im) => {
  gsap.fromTo(im, { scale: 1.06 }, { scale: 1, duration: 1.4, ease: EASE_OUT, scrollTrigger: { trigger: im, start: 'top 88%' } });
});
gsap.utils.toArray('.phrow, .ph__media--phones').forEach((row) => {
  gsap.from(row.querySelectorAll('.phone'), { y: 120, duration: 1.2, ease: EASE_OUT, stagger: 0.1, scrollTrigger: { trigger: row, start: 'top 85%' } });
});

/* next-project band */
if (document.querySelector('.next')) {
  gsap.from('.next__t', { yPercent: 50, opacity: 0, duration: 1.1, ease: EASE_OUT, scrollTrigger: { trigger: '.next', start: 'top 80%' } });
  gsap.from('.next__img', { clipPath: 'inset(0 0 0 100% round 1.2rem)', duration: 1.3, ease: EASE_INOUT, scrollTrigger: { trigger: '.next', start: 'top 80%' } });
}
gsap.from('.footer__big', { yPercent: 60, opacity: 0, duration: 1.2, ease: EASE_OUT, scrollTrigger: { trigger: '.footer', start: 'top 92%' } });

/* =========================================================
   WORK PAGE
   ========================================================= */
const wh = document.getElementById('wh');
if (wh) {
  const title = wh.querySelector('.wh__title');
  const line = wh.querySelector('.wh__line');
  /* fit "PROJECTS" edge to edge */
  const fit = () => {
    title.style.fontSize = '';
    const w = title.clientWidth, lw = line.getBoundingClientRect().width;
    const fs = parseFloat(getComputedStyle(title).fontSize);
    title.style.fontSize = (fs * w / lw) * 0.995 + 'px';
    if (desktop) {
      const r = window.innerWidth / 192;
      title.style.fontSize = Math.min(parseFloat(title.style.fontSize), window.innerHeight * 0.4 / 0.84) + 'px';
      wh.style.setProperty('--rowTop', (title.offsetTop + title.offsetHeight + 2.4 * r) + 'px');
    }
  };
  fit();
  document.fonts && document.fonts.ready.then(() => { fit(); ScrollTrigger.refresh(); });
  window.addEventListener('resize', fit);

  const cards = gsap.utils.toArray('.hc');

  /* intro (0–1.9s in the Figma timeline) */
  const intro = gsap.timeline({ delay: 0.1 });
  intro.from(line, { yPercent: 100, duration: 1.3, ease: EASE_OUT })
    .from('.wh__lbl, .wh__lead, .wh__cta, .wh__since', { y: 24, opacity: 0, duration: 0.9, ease: EASE_OUT, stagger: 0.08 }, 0.35)
    .from(cards, { y: 260, opacity: 0, duration: 1.3, ease: EASE_OUT, stagger: 0.1 }, 0.35)
    ;

  /* scroll: title + lead scroll away, the row of cards grows for real
     (width/height, not scale) - middle card most, outer cards push past the edges,
     then the orange bar slides in underneath (reference: Bentro). */
  if (desktop && !reduce) {
    const R = () => window.innerWidth / 1920 * 10;            // 1rem in px
    const W0 = 32, H0 = 34;                                     // start size (rem)
    const WF = [46, 52, 80, 52, 46], HF = [46, 54, 66, 54, 46]; // end size (rem)
    const rowEl = wh.querySelector('.wh__row');
    const h0 = () => Math.max(20 * R(), Math.min(H0 * R(), window.innerHeight - (rowEl.offsetTop + rowEl.offsetHeight) - 7 * R()));
    gsap.set(cards, { width: () => W0 * R(), height: h0 });
    const stage = wh.querySelector('.wh__stage');
    const zoom = gsap.timeline({
      defaults: { ease: 'power2.inOut' },
      scrollTrigger: { trigger: wh, start: 'top top', end: '+=' + Math.round(window.innerHeight * 1.5), scrub: 0.9, pin: true, anticipatePin: 1, invalidateOnRefresh: true },
    });
    zoom.to(title, { y: () => -window.innerHeight * 0.55, opacity: 0, duration: 1 }, 0)
      .to('.wh__row', { y: () => -window.innerHeight * 0.45, opacity: 0, duration: 0.8 }, 0);
    cards.forEach((c, i) => zoom.fromTo(c, { width: () => W0 * R(), height: h0 }, { width: () => WF[i] * R(), height: () => Math.min(HF[i] * R(), window.innerHeight - 34 * R()), duration: 1 }, 0));
    zoom.to(stage, { y: () => -17 * R(), duration: 1 }, 0)
      .fromTo('.wh .ctabar', { y: () => 6 * R(), clipPath: 'inset(0 30% 0 30% round 1.2rem)' }, { y: () => -9 * R(), clipPath: 'inset(0 0% 0 0% round 1.2rem)', duration: 0.7 }, 0.3)
      .to('.wh__since', { y: () => -9 * R(), duration: 0.7 }, 0.3)
      .to({}, { duration: 0.25 });
  }

  /* statement: words light up one by one while scrolling */
  const words = gsap.utils.toArray('.stmt__h .w');
  gsap.to(words, { opacity: 1, ease: 'none', stagger: 0.1, scrollTrigger: { trigger: '.stmt', start: 'top 75%', end: 'center 45%', scrub: true } });
  gsap.from('.stmt__cats span', { y: 30, opacity: 0, duration: 0.8, ease: EASE_OUT, stagger: 0.06, scrollTrigger: { trigger: '.stmt__cats', start: 'top 90%' } });

  /* W(pill)RK: letters rise, pill opens */
  const wkTl = gsap.timeline({ scrollTrigger: { trigger: '.wk__head', start: 'top 85%' } });
  wkTl.from('.wk__l', { yPercent: 80, opacity: 0, duration: 1.1, ease: EASE_OUT, stagger: 0.08 })
    .from('.wk__pill', { width: 0, marginLeft: 0, marginRight: 0, duration: 1.1, ease: EASE_INOUT }, 0.2)
    .from('.wk__side > *', { y: 24, opacity: 0, duration: 0.8, ease: EASE_OUT, stagger: 0.08 }, 0.3);

  /* grid cards: rise in, screenshot settles from 1.1 → 1, then gentle parallax */
  const setupCard = (c) => {
    const m = c.querySelector('[data-par]');
    gsap.from(c, { y: 120, opacity: 0, duration: 1.2, ease: EASE_OUT, scrollTrigger: { trigger: c, start: 'top 92%' } });
    if (m && !reduce) {
      gsap.from(m, { scale: 1.1, duration: 1.6, ease: EASE_OUT, scrollTrigger: { trigger: c, start: 'top 92%' } });
      gsap.fromTo(m, { yPercent: 0, y: 24 }, { y: -24, ease: 'none', scrollTrigger: { trigger: c, start: 'top bottom', end: 'bottom top', scrub: true } });
    }
  };
  gsap.utils.toArray('.wc').forEach(setupCard);

  /* filters */
  const grid = document.getElementById('wgrid');
  const all = gsap.utils.toArray('.wc');
  const count = document.querySelector('.wk__count');
  document.querySelectorAll('.filters button').forEach((b) => b.addEventListener('click', () => {
    if (b.classList.contains('on')) return;
    document.querySelectorAll('.filters button').forEach((x) => x.classList.toggle('on', x === b));
    const f = b.dataset.f;
    const show = all.filter((c) => f === 'all' || c.dataset.f.split(' ').includes(f));
    gsap.to(grid, { opacity: 0, y: 30, duration: 0.3, ease: 'power2.in', onComplete: () => {
      all.forEach((c) => c.classList.toggle('is-hidden', !show.includes(c)));
      document.querySelectorAll('.wgh').forEach((h) => h.classList.toggle('is-hidden', f !== 'all' && h.dataset.g !== f));
      count.textContent = f === 'all' ? `[ ${show.length} projects in ${document.querySelectorAll('.wgh').length || 1} groups ]` : `[ ${show.length} projects · ${b.dataset.label || b.textContent} ]`;
      gsap.set(show, { opacity: 1, y: 0 });
      ScrollTrigger.refresh();
      gsap.to(grid, { opacity: 1, y: 0, duration: 0.6, ease: EASE_OUT });
      gsap.from(show, { y: 80, opacity: 0, duration: 0.9, ease: EASE_OUT, stagger: 0.07 });
    } });
  }));

  gsap.from('.endcta__a', { y: 60, opacity: 0, duration: 1, ease: EASE_OUT, scrollTrigger: { trigger: '.endcta', start: 'top 88%' } });
}

/* =========================================================
   SERVICES PAGE - image peek follows the cursor
   ========================================================= */
const peek = document.querySelector('.sr__peek');
if (peek && desktop) {
  const pim = peek.querySelector('img');
  const qx = gsap.quickTo(peek, 'left', { duration: 0.5, ease: 'power3.out' });
  const qy = gsap.quickTo(peek, 'top', { duration: 0.5, ease: 'power3.out' });
  window.addEventListener('pointermove', (e) => { qx(e.clientX + 300); qy(e.clientY); });
  document.querySelectorAll('.sr').forEach((r) => {
    r.addEventListener('pointerenter', () => { pim.src = r.dataset.img; peek.classList.add('on'); });
    r.addEventListener('pointerleave', () => peek.classList.remove('on'));
  });
}

/* =========================================================
   THANK YOU - check draws, confetti bursts
   ========================================================= */
if (document.querySelector('.tx') && !reduce) {
  const c = document.querySelector('.tx__check circle'), pth = document.querySelector('.tx__check path');
  const L = pth.getTotalLength();
  gsap.set(pth, { strokeDasharray: L, strokeDashoffset: L });
  gsap.timeline({ delay: 0.15 })
    .from('.tx__check', { scale: 0, rotation: -90, duration: 0.8, ease: 'back.out(1.8)' })
    .to(pth, { strokeDashoffset: 0, duration: 0.6, ease: 'power2.out' }, 0.45)
    .from('.tx__burst i', { x: 0, y: 0, scale: 0, opacity: 0, duration: 1, ease: 'expo.out', stagger: 0.02, transformOrigin: '50% 50%' }, 0.5)
    .from('.tx__k, .tx__lead, .tx__btns', { y: 30, opacity: 0, duration: 0.8, ease: EASE_OUT, stagger: 0.1 }, 0.6);
  gsap.to('.tx__burst i', { y: '+=14', rotation: '+=40', duration: 2.4, ease: 'sine.inOut', yoyo: true, repeat: -1, stagger: 0.15, delay: 1.6 });
}

window.addEventListener('load', () => ScrollTrigger.refresh());
