/* =========================================================
   Manpreet Kaur - Contact page
   Same motion language as main.js (GSAP + ScrollTrigger + Lenis)
   ========================================================= */
gsap.registerPlugin(ScrollTrigger);

const EASE_OUT = 'expo.out';
const EASE_INOUT = 'power3.inOut';
const EASE_POP = 'back.out(1.7)';
const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ---------- smooth scroll ---------- */
const lenis = new Lenis({ duration: 1.15, smoothWheel: true, wheelMultiplier: 0.9 });
lenis.on('scroll', ScrollTrigger.update);
gsap.ticker.add((t) => lenis.raf(t * 1000));
gsap.ticker.lagSmoothing(0);
document.querySelectorAll('a[href^="#"]').forEach((a) => a.addEventListener('click', (e) => {
  const id = a.getAttribute('href'); if (id.length < 2) return;
  const el = document.querySelector(id); if (!el) return;
  e.preventDefault(); lenis.scrollTo(el, { offset: -110, duration: 1.4 });
}));

/* ---------- hero intro ---------- */
if (!reduce) {
  gsap.timeline({ defaults: { ease: EASE_OUT } })
    .from('.nav > *', { y: -30, opacity: 0, duration: 0.6, stagger: 0.05 }, 0.05)
    .from('.crumbs, .chero .kicker', { y: 20, opacity: 0, duration: 0.6, stagger: 0.08 }, 0.15)
    .from('.chero__line', { yPercent: 110, duration: 0.9, stagger: 0.15 }, 0.2)
    .from('.chero__h1, .chero__body', { y: 40, opacity: 0, duration: 0.8, stagger: 0.1 }, 0.6)
    .from('.chero__chips li', { scale: 0.3, opacity: 0, duration: 0.5, stagger: 0.1, ease: EASE_POP }, 0.9)
    .from('.ca-pop', { scale: 0, opacity: 0, transformOrigin: '50% 50%', duration: 0.8, stagger: 0.12, ease: EASE_POP }, 0.5)
    .from('.ca-plane', { x: -160, y: 120, opacity: 0, duration: 1.3, ease: EASE_OUT }, 0.6)
    .from('.ca-trail', { opacity: 0, duration: 0.8 }, 1.0)
    .from('.chero__loop', { opacity: 0, rotate: 20, duration: 1.2 }, 0.3);
  heroArt();
}

/* ---------- contact illustration: idle motion + mouse parallax ---------- */
function heroArt() {
  const art = document.querySelector('.chero__art');
  if (!art || getComputedStyle(art).display === 'none') return;
  const sine = 'sine.inOut';
  // floating pieces
  gsap.to('.ca-float', { y: -10, duration: 2.2, ease: sine, yoyo: true, repeat: -1 });
  gsap.to('.ca-float2', { y: -8, rotation: 2, transformOrigin: '50% 50%', duration: 2.6, ease: sine, yoyo: true, repeat: -1, delay: 0.4 });
  gsap.to('.ca-float3', { y: -9, rotation: -3, transformOrigin: '50% 50%', duration: 2.4, ease: sine, yoyo: true, repeat: -1, delay: 0.8 });
  gsap.to('.ca-hi', { rotation: 6, transformOrigin: '20% 100%', duration: 1.4, ease: sine, yoyo: true, repeat: -1 });
  // typing dots
  gsap.to('.ca-dot', { y: -12, duration: 0.4, ease: 'power1.inOut', yoyo: true, repeat: -1, stagger: { each: 0.14, repeat: -1, yoyo: true }, repeatDelay: 0.5 });
  // paper plane glides, trail keeps flowing
  gsap.to('.ca-plane', { x: 10, y: -12, rotation: -4, duration: 1.8, ease: sine, yoyo: true, repeat: -1, delay: 2 });
  gsap.to('.ca-trail', { strokeDashoffset: -180, duration: 4, ease: 'none', repeat: -1 });
  // sparkles twinkle
  gsap.utils.toArray('.ca-spark').forEach((s, i) => {
    gsap.fromTo(s, { scale: 0.4, rotation: 0, opacity: 0.4, transformOrigin: '50% 50%' },
      { scale: 1.1, rotation: 90, opacity: 1, duration: 1.1 + i * 0.25, ease: sine, yoyo: true, repeat: -1, delay: i * 0.3 });
  });
  // calendar check redraws every few seconds
  const check = document.querySelector('.ca-check');
  const len = check.getTotalLength();
  gsap.set(check, { strokeDasharray: len, strokeDashoffset: len, opacity: 0 });
  gsap.timeline({ repeat: -1, repeatDelay: 2.2, delay: 1.6 })
    .set(check, { opacity: 1 })
    .to(check, { strokeDashoffset: 0, duration: 0.5, ease: 'power2.out' })
    .set(check, { opacity: 0, strokeDashoffset: len }, '+=2');
  // mouse parallax: each layer moves by its depth
  const layers = gsap.utils.toArray('.chero__art .ca').map((g) => ({
    d: +g.dataset.depth || 10,
    x: gsap.quickTo(g, 'x', { duration: 0.8, ease: 'power3.out' }),
    y: gsap.quickTo(g, 'y', { duration: 0.8, ease: 'power3.out' }),
  }));
  window.addEventListener('pointermove', (e) => {
    const nx = e.clientX / window.innerWidth - 0.5, ny = e.clientY / window.innerHeight - 0.5;
    layers.forEach((l) => { l.x(nx * l.d); l.y(ny * l.d); });
  });
}

/* ---------- generic reveals ---------- */
if (!reduce) {
  gsap.set('.reveal', { opacity: 0 });
  ScrollTrigger.batch('.reveal', {
    start: 'top 90%',
    onEnter: (els) => gsap.fromTo(els, { y: 50, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, ease: EASE_OUT, stagger: 0.1, overwrite: true, clearProps: 'transform' }),
  });
  gsap.from('.steps__line', { scaleX: 0, duration: 1.4, ease: EASE_INOUT, scrollTrigger: { trigger: '.steps', start: 'top 95%' } });
  gsap.from('.step__dot', { scale: 0, duration: 0.6, ease: EASE_POP, stagger: 0.2, scrollTrigger: { trigger: '.steps', start: 'top 95%' } });
  gsap.from('.footer__big', { yPercent: 60, opacity: 0, duration: 1.2, ease: EASE_OUT, scrollTrigger: { trigger: '.footer', start: 'top 90%' } });
}

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

/* ---------- "What do you need?" cards fill the service field ---------- */
const svcSel = document.querySelector('select[name="service"]');
document.querySelectorAll('.nd').forEach((b) => b.addEventListener('click', () => {
  document.querySelectorAll('.nd').forEach((x) => x.classList.toggle('on', x === b));
  const v = b.dataset.val;
  [...svcSel.options].forEach((o) => { if (o.text === v || o.value === v) svcSel.value = o.value || o.text; });
  svcSel.closest('.field').classList.remove('bad');
  if (!reduce) gsap.fromTo(b, { scale: 0.94 }, { scale: 1, duration: 0.5, ease: EASE_POP });
  setTimeout(() => lenis.scrollTo('#form', { offset: -110, duration: 1.2 }), 250);
}));
// fade only: the cards have a CSS transform transition for hover, so moving them with GSAP
// could leave them stuck lower down (overlapping the form) in some browsers
if (!reduce) gsap.from('.nd', { opacity: 0, duration: 0.7, ease: EASE_OUT, stagger: 0.06, clearProps: 'opacity', scrollTrigger: { trigger: '.need__grid', start: 'top 95%' } });

/* ---------- navbar: solid bar once you scroll ---------- */
ScrollTrigger.create({ start: 60, end: 'max', onToggle: (s) => document.body.classList.toggle('nav-solid', s.isActive) });

/* ---------- contact form (FormSubmit AJAX, no page reload) ---------- */
const form = document.getElementById('contactForm');
const done = document.getElementById('formDone');
const err = document.getElementById('formErr');
const btn = form.querySelector('.cform__btn');
const EMAIL = 'uiuxflow19@gmail.com';

form.addEventListener('input', (e) => { const f = e.target.closest('.field'); if (f) f.classList.remove('bad'); });

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  err.hidden = true;

  // simple validation, highlights the fields that need attention
  let first = null;
  form.querySelectorAll('[required]').forEach((el) => {
    const ok = el.checkValidity() && el.value.trim() !== '';
    el.closest('.field').classList.toggle('bad', !ok);
    if (!ok && !first) first = el;
  });
  const link = form.querySelector('[name="link"]');
  if (link.value.trim() && !link.checkValidity()) { link.closest('.field').classList.add('bad'); first = first || link; }
  if (first) {
    err.textContent = 'Please fill in the highlighted fields.';
    err.hidden = false; first.focus(); return;
  }
  if (form.querySelector('[name="_honey"]').value) return; // bot

  btn.disabled = true; btn.firstChild.textContent = 'Sending… ';
  try {
    const data = Object.fromEntries(new FormData(form).entries());
    const res = await fetch(`https://formsubmit.co/ajax/${EMAIL}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify(data),
    });
    const json = await res.json().catch(() => ({}));
    if (!res.ok || String(json.success) === 'false') throw new Error(json.message || 'Request failed');

    window.location.href = 'thanks'; return;
    form.hidden = true;
    form.previousElementSibling.hidden = true;               // subtitle
    form.previousElementSibling.previousElementSibling.hidden = true; // heading
    done.hidden = false; done.focus({ preventScroll: true });
    if (!reduce) gsap.from(done.children, { y: 30, opacity: 0, duration: 0.7, ease: EASE_OUT, stagger: 0.08 });
    ScrollTrigger.refresh();
  } catch (_) {
    err.innerHTML = `Sorry, your message couldn’t be sent. Please email me directly at <a href="mailto:${EMAIL}">${EMAIL}</a>.`;
    err.hidden = false;
  } finally {
    btn.disabled = false; btn.firstChild.textContent = 'Send message ';
  }
});

window.addEventListener('load', () => ScrollTrigger.refresh());
