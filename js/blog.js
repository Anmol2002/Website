/* =========================================================
   Blog: category filter (blog.html), reading progress, table of contents, share
   (runs after pages.js, which sets up Lenis, reveals and the navbar)
   ========================================================= */
(() => {
  const smooth = (el, offset = -110) => {
    if (typeof lenis !== 'undefined') lenis.scrollTo(el, { offset, duration: 1.2 });
    else el.scrollIntoView({ behavior: 'smooth' });
  };

  /* ---------- listing: filter by category ---------- */
  const filters = document.querySelectorAll('.bl__f');
  if (filters.length) {
    const items = document.querySelectorAll('[data-cat]');
    const empty = document.querySelector('.bl__empty');
    filters.forEach((f) => f.addEventListener('click', () => {
      filters.forEach((x) => { x.classList.toggle('is-on', x === f); x.setAttribute('aria-pressed', x === f); });
      const cat = f.dataset.f;
      let shown = 0;
      items.forEach((it) => {
        const ok = cat === 'all' || it.dataset.cat === cat;
        it.classList.toggle('is-hidden', !ok);
        if (ok) shown++;
      });
      if (empty) empty.style.display = shown ? 'none' : 'block';
      if (window.gsap) gsap.fromTo('[data-cat]:not(.is-hidden)', { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, ease: 'expo.out', stagger: 0.05, clearProps: 'transform,opacity' });
      if (window.ScrollTrigger) ScrollTrigger.refresh();
    }));
  }

  /* ---------- article: reading progress bar ---------- */
  const body = document.querySelector('.bp__body');
  const bar = document.querySelector('.bprog');
  if (body && bar) {
    const update = () => {
      const r = body.getBoundingClientRect();
      const total = r.height - window.innerHeight * 0.6;
      const p = Math.min(1, Math.max(0, (-r.top + window.innerHeight * 0.2) / total));
      bar.style.transform = `scaleX(${p})`;
    };
    if (typeof lenis !== 'undefined') lenis.on('scroll', update); else window.addEventListener('scroll', update, { passive: true });
    update();
  }

  /* ---------- article: table of contents ---------- */
  const links = [...document.querySelectorAll('.btoc a')];
  if (links.length) {
    links.forEach((a) => a.addEventListener('click', (e) => {
      const el = document.querySelector(a.getAttribute('href'));
      if (!el) return;
      e.preventDefault();
      smooth(el);
    }));
    const heads = links.map((a) => document.querySelector(a.getAttribute('href'))).filter(Boolean);
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (!en.isIntersecting) return;
        links.forEach((a) => a.classList.toggle('is-on', a.getAttribute('href') === '#' + en.target.id));
      });
    }, { rootMargin: '-15% 0px -70% 0px' });
    heads.forEach((h) => io.observe(h));
  }

  /* ---------- article: copy link ---------- */
  const copy = document.querySelector('.bshare__copy');
  if (copy) copy.addEventListener('click', async () => {
    try { await navigator.clipboard.writeText(location.href); } catch (_) { /* clipboard blocked */ }
    copy.classList.add('ok'); copy.setAttribute('aria-label', 'Link copied');
    setTimeout(() => { copy.classList.remove('ok'); copy.setAttribute('aria-label', 'Copy link'); }, 1800);
  });
})();
