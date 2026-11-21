/* =========================================================
   White-label page: hero illustration, FAQ, partner form
   (runs after pages.js, which sets up Lenis, reveals and the navbar)
   ========================================================= */
(() => {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const sine = 'sine.inOut', pop = 'back.out(1.7)', out = 'expo.out';

  /* ---------- hero ---------- */
  if (!reduce) {
    gsap.timeline({ delay: 0.1 })
      .from('.wlh .crumbs, .wlh__k', { y: 20, opacity: 0, duration: 0.6, ease: out, stagger: 0.08 })
      .from('.wlh__t .ph__tl', { yPercent: 110, duration: 0.9, ease: out, stagger: 0.14 }, 0.15)
      .from('.wlh__lead, .wlh__body', { y: 40, opacity: 0, duration: 0.8, ease: out, stagger: 0.1 }, 0.55)
      .from('.wlh__chips li', { scale: 0.3, opacity: 0, duration: 0.5, ease: pop, stagger: 0.08 }, 0.8)
      .from('.wlh__btns > *', { y: 30, opacity: 0, duration: 0.6, ease: out, stagger: 0.08 }, 0.9)
      .from('.wa-tag', { rotation: -50, transformOrigin: '50% 0%', duration: 1.6, ease: 'elastic.out(1,0.35)' }, 0.5)
      .from('.wa-pop', { scale: 0, opacity: 0, transformOrigin: '50% 50%', duration: 0.7, ease: pop, stagger: 0.12 }, 0.9)
      .from('.wlh__guy', { x: 260, opacity: 0, duration: 1.2, ease: out }, 0.9)
      .from('.wlh__guy .bub', { scale: 0, opacity: 0, duration: 0.6, ease: pop }, 1.8);
    // the label swings gently on its string
    gsap.to('.wa-tag', { rotation: 3, transformOrigin: '50% 0%', duration: 2.2, ease: sine, yoyo: true, repeat: -1, delay: 2.1 });
    gsap.to('.wa-float', { y: -10, duration: 2, ease: sine, yoyo: true, repeat: -1, stagger: 0.4, delay: 1.6 });
    gsap.to('.wa-ring', { rotation: 360, svgOrigin: '96 520', duration: 16, ease: 'none', repeat: -1 }); // only the CONFIDENTIAL ring turns; NDA stays still
    gsap.to('.wlh__guy img', { y: -10, duration: 1.8, ease: sine, yoyo: true, repeat: -1, delay: 2 });

    // mouse parallax
    const layers = [...document.querySelectorAll('.wlh [data-depth]')].map((el) => ({
      d: +el.dataset.depth,
      x: gsap.quickTo(el, 'x', { duration: 0.9, ease: 'power3.out' }),
      y: gsap.quickTo(el, 'y', { duration: 0.9, ease: 'power3.out' }),
    }));
    window.addEventListener('pointermove', (e) => {
      const nx = e.clientX / innerWidth - 0.5, ny = e.clientY / innerHeight - 0.5;
      layers.forEach((l) => { l.x(nx * l.d); l.y(ny * l.d); });
    });

    gsap.from('.wlstats div', { y: 60, opacity: 0, duration: 0.8, ease: out, stagger: 0.08, scrollTrigger: { trigger: '.wlstats', start: 'top 92%' } });
    gsap.from('.wlcan__row span', { y: 40, opacity: 0, duration: 0.6, ease: out, stagger: 0.05, scrollTrigger: { trigger: '.wlcan__row', start: 'top 88%' } });
  }

  // the brand name on the label keeps changing: "your" brand, whoever you are
  const word = document.querySelector('.wa-word');
  if (word) {
    const words = ['YOUR BRAND', 'YOUR AGENCY', 'YOUR CLIENT', 'YOUR PRODUCT'];
    let i = 0;
    setInterval(() => {
      i = (i + 1) % words.length;
      if (reduce) { word.textContent = words[i]; return; }
      gsap.to(word, { opacity: 0, y: -12, duration: 0.25, ease: 'power2.in', onComplete: () => {
        word.textContent = words[i];
        gsap.fromTo(word, { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.35, ease: 'power2.out' });
      } });
    }, 2200);
  }

  /* ---------- FAQ accordion ---------- */
  document.querySelectorAll('.fq').forEach((fq) => {
    const a = fq.querySelector('.fq__a');
    fq.querySelector('button').addEventListener('click', () => {
      const open = fq.classList.contains('open');
      document.querySelectorAll('.fq.open').forEach((o) => {
        if (o === fq) return; o.classList.remove('open');
        gsap.fromTo(o.querySelector('.fq__a'), { height: o.querySelector('.fq__a').scrollHeight }, { height: 0, duration: 0.5, ease: 'power3.inOut' });
      });
      if (open) { fq.classList.remove('open'); gsap.fromTo(a, { height: a.scrollHeight }, { height: 0, duration: 0.5, ease: 'power3.inOut' }); }
      else { fq.classList.add('open'); gsap.fromTo(a, { height: 0 }, { height: a.scrollHeight, duration: 0.6, ease: 'power3.inOut', onComplete: () => { a.style.height = 'auto'; ScrollTrigger.refresh(); } }); }
    });
  });

  /* ---------- in-page links (#how, #partner-form) ---------- */
  document.querySelectorAll('a[href^="#"]').forEach((a) => a.addEventListener('click', (e) => {
    const el = document.querySelector(a.getAttribute('href'));
    if (!el) return;
    e.preventDefault();
    if (typeof lenis !== 'undefined') lenis.scrollTo(el, { offset: -110, duration: 1.4 }); else el.scrollIntoView({ behavior: 'smooth' });
  }));

  /* ---------- partner form (same service as the contact form) ---------- */
  const form = document.getElementById('partnerForm');
  if (!form) return;
  const err = document.getElementById('partnerErr');
  const btn = form.querySelector('.cform__btn');
  const endpoint = form.getAttribute('action').replace('formsubmit.co/', 'formsubmit.co/ajax/');
  const mail = form.getAttribute('action').split('/').pop();
  form.addEventListener('input', (e) => { const f = e.target.closest('.field'); if (f) f.classList.remove('bad'); });
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    err.hidden = true;
    let first = null;
    form.querySelectorAll('[required]').forEach((el) => {
      const ok = el.checkValidity() && el.value.trim() !== '';
      el.closest('.field').classList.toggle('bad', !ok);
      if (!ok && !first) first = el;
    });
    const site = form.querySelector('[name="website"]');
    if (site.value.trim() && !site.checkValidity()) { site.closest('.field').classList.add('bad'); first = first || site; }
    if (first) { err.textContent = 'Please fill in the highlighted fields.'; err.hidden = false; first.focus(); return; }
    if (form.querySelector('[name="_honey"]').value) return;
    btn.disabled = true; btn.firstChild.textContent = 'Sending… ';
    try {
      const res = await fetch(endpoint, {
        method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(Object.fromEntries(new FormData(form).entries())),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok || String(json.success) === 'false') throw new Error('failed');
      window.location.href = 'thanks';
    } catch (_) {
      err.innerHTML = `Sorry, your message couldn’t be sent. Please email me directly at <a href="mailto:${mail}">${mail}</a>.`;
      err.hidden = false;
    } finally {
      btn.disabled = false; btn.firstChild.textContent = 'Send partnership request ';
    }
  });
})();
