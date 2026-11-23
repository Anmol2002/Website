/* =========================================================
   Work case studies: chooser -> Interactive (scroll story) or Read (article)
   Runs after pages.js (gsap, ScrollTrigger, lenis are globals)
   ========================================================= */
(() => {
  const B = document.body;
  const qs = new URLSearchParams(location.search);
  let mode = qs.get('mode');
  if (mode !== 'interactive' && mode !== 'read') mode = null;
  const RM = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const go = (m) => { const u = new URL(location.href); u.searchParams.set('mode', m); u.hash = ''; location.replace(u.toString()); };
  // switching mode replaces the history entry, so Back returns straight to the page the visitor came from
  document.addEventListener('click', (e) => {
    const a = e.target.closest('a[href^="?mode="]');
    if (!a || e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
    e.preventDefault(); go(new URLSearchParams(a.getAttribute('href').slice(1)).get('mode'));
  }, true);
  // "All work" / back arrow: go back in history when we came from the list, so its scroll spot is kept
  document.addEventListener('click', (e) => {
    const a = e.target.closest('.ix-hud__b, .wch__back, .wr-ghost, .ix-ghost, .crumbs a[href="../work"]');
    if (!a || e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
    let ref; try { ref = new URL(document.referrer); } catch (_) { return; }
    if (ref.origin === location.origin && /^\/(work)?\/?$/.test(ref.pathname) && history.length > 1) { e.preventDefault(); history.back(); }
  }, true);

  /* ---------- chooser ---------- */
  const ch = document.getElementById('choose');
  if (!mode) {
    ch.hidden = false; B.classList.add('wk-choosing');
    if (typeof lenis !== 'undefined') lenis.stop();
    ch.querySelector('.wch__o').focus({ preventScroll: true });
    ch.addEventListener('keydown', (e) => { if (e.key === 'Escape') go('read'); });
    // read content stays in the page underneath (for search engines + no-JS)
    return;
  }

  /* ---------- swap button ---------- */
  const sw = document.querySelector('.wswap');
  const ft = mode === 'read' ? document.querySelector('.footer') : document.querySelector('.ix-read');
  const swv = () => sw.classList.toggle('show', scrollY > innerHeight * .7 && !(ft && ft.getBoundingClientRect().top < innerHeight - 60));
  addEventListener('scroll', swv, { passive: true }); swv();
  document.querySelectorAll('[data-swap]').forEach((b) => b.addEventListener('click', () => go(mode === 'read' ? 'interactive' : 'read')));

  /* fit the next-project name to its column (big, but never under the preview) */
  const fitNames = () => document.querySelectorAll('.ix-next__a b, .wr-nextcard b').forEach((b) => {
    const card = b.parentElement, cs = getComputedStyle(card);
    const inner = card.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight);
    const big = b.classList.contains('wr-nc') || card.classList.contains('wr-nextcard');
    const max = innerWidth < 1024 ? inner : inner * (big ? 1 : .44);
    const cap = big ? (innerWidth < 1024 ? 64 : 72) : 150;
    b.style.fontSize = cap + 'px';
    const w = b.scrollWidth; if (w > max) b.style.fontSize = Math.max(28, Math.floor(cap * max / w)) + 'px';
  });
  fitNames(); addEventListener('resize', fitNames); document.fonts && document.fonts.ready.then(fitNames);

  /* ================= READ ================= */
  if (mode === 'read') {
    B.classList.add('wk-read');
    const links = [...document.querySelectorAll('.wr-toc a')];
    const pct = document.querySelector('.wr-pct'), bar = document.querySelector('.wr-bar i');
    const main = document.querySelector('.wr-main');
    const tocOl = document.querySelector('.wr-toc ol');
    let cur = null;
    const upd = () => {
      const r = main.getBoundingClientRect(), vh = innerHeight;
      const p = Math.min(1, Math.max(0, (vh * .35 - r.top) / (r.height - vh * .5)));
      if (pct) pct.textContent = Math.round(p * 100) + '%';
      if (bar) bar.style.width = p * 100 + '%';
      let on = links[0];
      for (const a of links) { const t = document.querySelector(a.getAttribute('href')); if (t && t.getBoundingClientRect().top < vh * .35) on = a; }
      if (on !== cur) {
        links.forEach((a) => a.classList.toggle('on', a === on)); cur = on;
        if (tocOl && tocOl.scrollWidth > tocOl.clientWidth) tocOl.scrollTo({ left: on.offsetLeft - 20, behavior: 'smooth' });
      }
    };
    addEventListener('scroll', upd, { passive: true }); upd();
    // reveal
    if (!RM) gsap.utils.toArray('.wr-sec > *:not(.wr-k), .wr-end > *').forEach((el) => {
      gsap.from(el, { y: 40, opacity: 0, duration: 1, ease: 'expo.out', scrollTrigger: { trigger: el, start: 'top 88%', once: true } });
    });
    if (!RM) gsap.from('.wr-hero__media', { y: 60, opacity: 0, duration: 1.3, ease: 'expo.out', delay: .2 });
    // lightbox
    const lb = document.querySelector('.wlb'), lbi = lb.querySelector('img');
    const close = () => { lb.hidden = true; lenis.start(); };
    document.querySelectorAll('.wr-main img').forEach((im) => {
      if (im.closest('.bwz--long')) return;
      im.addEventListener('click', () => { lbi.src = im.currentSrc || im.src; lbi.alt = im.alt; lb.hidden = false; lenis.stop(); });
    });
    lb.addEventListener('click', close);
    addEventListener('keydown', (e) => { if (e.key === 'Escape' && !lb.hidden) close(); });
    // inner-scroll browser frames: let the wheel scroll inside them
    document.querySelectorAll('.bwz--long .bwz__in').forEach((el) => el.setAttribute('data-lenis-prevent', ''));
    return;
  }

  /* ================= INTERACTIVE ================= */
  B.classList.add('wk-ix');
  const ix = document.getElementById('interactive');
  ix.hidden = false; fitNames();
  window.scrollTo(0, 0);
  const chs = [...ix.querySelectorAll('.ix-ch')];
  const N = chs.length;
  const hudN = ix.querySelector('.ix-hud__n'), hudP = ix.querySelector('.ix-hud__p i');
  const mapBtn = ix.querySelector('.ix-hud__map'), map = document.getElementById('ixmap');
  const mapBtns = [...map.querySelectorAll('button')];
  const pad = (n) => String(n).padStart(2, '0');
  const setCh = (i) => { hudN.textContent = `${pad(i + 1)} / ${pad(N)}`; mapBtns.forEach((b, j) => b.classList.toggle('on', j === i)); };
  mapBtn.addEventListener('click', () => { const o = map.hidden; map.hidden = !o; mapBtn.setAttribute('aria-expanded', o); });
  mapBtns.forEach((b) => b.addEventListener('click', () => {
    map.hidden = true; mapBtn.setAttribute('aria-expanded', false);
    const st = ScrollTrigger.getById('ch' + b.dataset.go);
    lenis.scrollTo(st ? st.start + 2 : chs[+b.dataset.go], { duration: 1.4 });
  }));
  document.addEventListener('click', (e) => { if (!map.hidden && !map.contains(e.target) && !mapBtn.contains(e.target)) { map.hidden = true; mapBtn.setAttribute('aria-expanded', false); } });
  ScrollTrigger.create({ start: 0, end: 'max', onUpdate: (s) => { hudP.style.width = s.progress * 100 + '%'; } });

  const build = () => {
    const small = innerWidth < 1024;

    /* hero */
    const hero = ix.querySelector('.ix-hero');
    if (!RM) {
      gsap.from(hero.querySelectorAll('.ix-w > span'), { yPercent: 110, duration: 1.2, ease: 'expo.out', stagger: .06, delay: .1 });
      gsap.from(hero.querySelectorAll('.ix-k, .ix-hero__p'), { y: 24, opacity: 0, duration: 1, ease: 'expo.out', delay: .4 });
      const hv = hero.querySelector('.ix-hero__phones, .ix-hero__shot');
      gsap.from(hv, { y: 120, opacity: 0, duration: 1.5, ease: 'expo.out', delay: .25 });
      if (!small) gsap.to(hv, { yPercent: -12, scale: .94, ease: 'none', scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: true } });
      gsap.to(hero.querySelector('.ix-hero__txt'), { opacity: 0, y: -60, ease: 'none', scrollTrigger: { trigger: hero, start: '30% top', end: 'bottom top', scrub: true } });
    }

    /* word-by-word statements */
    ix.querySelectorAll('.ix-say').forEach((p) => {
      const w = [...p.querySelectorAll('span')];
      if (RM) { w.forEach((s) => s.classList.add('on')); return; }
      ScrollTrigger.create({ trigger: p, start: 'top 80%', end: small ? 'bottom 45%' : 'bottom 40%', scrub: true,
        onUpdate: (s) => { const k = Math.round(s.progress * w.length); w.forEach((x, i) => x.classList.toggle('on', i < k)); } });
    });

    /* stats count-up */
    ix.querySelectorAll('[data-count]').forEach((b) => {
      const raw = b.dataset.count, m = raw.match(/^([^\d]*)([\d.,]+)(.*)$/);
      if (!m || RM) return;
      const num = parseFloat(m[2].replace(/,/g, '')), dec = (m[2].split('.')[1] || '').length, o = { v: 0 };
      b.textContent = m[1] + '0' + m[3];
      ScrollTrigger.create({ trigger: b, start: 'top 90%', once: true, onEnter: () => gsap.to(o, { v: num, duration: 1.6, ease: 'power2.out',
        onUpdate: () => { b.textContent = m[1] + (dec ? o.v.toFixed(dec) : Math.round(o.v).toLocaleString('en-US')) + m[3]; } }) });
    });

    /* horizontal track (apps, boards) */
    ix.querySelectorAll('.ix-hs').forEach((sec) => {
      const pin = sec.querySelector('.ix-hs__pin'), tr = sec.querySelector('.ix-hs__track'), bar = sec.querySelector('.ix-hs__bar i');
      const dist = () => Math.max(0, tr.scrollWidth - innerWidth);
      if (RM) { pin.style.height = 'auto'; tr.style.overflowX = 'auto'; return; }
      gsap.to(tr, { x: () => -dist(), ease: 'none', scrollTrigger: { trigger: sec, pin, start: 'top top', end: () => '+=' + dist(), scrub: .6, invalidateOnRefresh: true,
        onUpdate: (s) => { bar.style.width = s.progress * 100 + '%'; } } });
      gsap.from(tr.children, { y: 80, opacity: 0, duration: 1.1, ease: 'expo.out', stagger: .05, scrollTrigger: { trigger: sec, start: 'top 70%', once: true } });
    });

    /* frame sequence (motion work) */
    ix.querySelectorAll('.ix-seq').forEach((sec) => {
      const pin = sec.querySelector('.ix-seq__pin'), fs = [...sec.querySelectorAll('.ix-seq__f')], cs = [...sec.querySelectorAll('.ix-seq__c')];
      const n = sec.querySelector('.ix-seq__i'), bar = sec.querySelector('.ix-seq__bar i');
      let last = -1;
      const show = (i) => { if (i === last) return; last = i; fs.forEach((f, j) => f.classList.toggle('on', j === i)); cs.forEach((c, j) => c.classList.toggle('on', j === i)); n.textContent = pad(i + 1);
        // warm up the next frames
        [i + 1, i + 2].forEach((k) => { const im = fs[k] && fs[k].querySelector('img'); if (im) im.loading = 'eager'; }); };
      if (RM) { pin.style.height = 'auto'; return; }
      ScrollTrigger.create({ trigger: sec, pin, start: 'top top', end: () => '+=' + innerHeight * fs.length * .55, scrub: true, invalidateOnRefresh: true,
        onUpdate: (s) => { show(Math.min(fs.length - 1, Math.floor(s.progress * fs.length))); bar.style.width = s.progress * 100 + '%'; } });
    });

    /* browser: long page scrolls inside the window */
    ix.querySelectorAll('.ix-br').forEach((sec) => {
      const pin = sec.querySelector('.ix-br__pin'), vp = sec.querySelector('.bwz__in'), im = vp.querySelector('img'), cs = [...sec.querySelectorAll('.ix-br__c')];
      im.loading = 'eager';
      if (RM) { vp.style.overflowY = 'auto'; vp.style.maxHeight = '70vh'; return; }
      const dist = () => Math.max(0, im.getBoundingClientRect().height - vp.clientHeight);
      gsap.to(im, { y: () => -dist(), ease: 'none', scrollTrigger: { trigger: sec, pin, start: 'top top', end: () => '+=' + Math.max(innerHeight * 2.2, dist() * (small ? .9 : .6)), scrub: .5, invalidateOnRefresh: true,
        onUpdate: (s) => { const i = Math.min(cs.length - 1, Math.floor(s.progress * cs.length)); cs.forEach((c, j) => c.classList.toggle('on', j === i)); } } });
      im.addEventListener('load', () => ScrollTrigger.refresh(), { once: true });
    });

    /* split chapters */
    if (!RM) ix.querySelectorAll('.ix-sp').forEach((sec) => {
      const r = sec.classList.contains('ix-sp--r');
      gsap.from(sec.querySelectorAll('.ix-sp__txt > *'), { y: 40, opacity: 0, duration: 1, ease: 'expo.out', stagger: .08, scrollTrigger: { trigger: sec, start: 'top 70%', once: true } });
      const med = sec.querySelector('.ix-sp__media');
      gsap.from(med, { x: small ? 0 : (r ? -80 : 80), y: small ? 60 : 0, opacity: 0, duration: 1.3, ease: 'expo.out', scrollTrigger: { trigger: sec, start: 'top 72%', once: true } });
      const ph = sec.querySelectorAll('.ix-sp__phones .wphone');
      if (ph.length && !small) ph.forEach((p, i) => gsap.to(p, { y: (i - 1) * -50, ease: 'none', scrollTrigger: { trigger: sec, start: 'top bottom', end: 'bottom top', scrub: true } }));
    });

    /* cards, swatches, next */
    if (!RM) {
      ix.querySelectorAll('.ix-dec, .ix-sys, .ix-out, .ix-next').forEach((sec) => {
        gsap.from(sec.querySelectorAll('.ix-k, h3'), { y: 30, opacity: 0, duration: 1, ease: 'expo.out', stagger: .08, scrollTrigger: { trigger: sec, start: 'top 75%', once: true } });
      });
      gsap.from('.ix-dec__c', { y: 80, opacity: 0, rotate: 2, duration: 1.1, ease: 'expo.out', stagger: .1, scrollTrigger: { trigger: '.ix-dec__g', start: 'top 80%', once: true } });
      gsap.from('.ix-sys__sw > div', { y: 60, opacity: 0, duration: 1, ease: 'expo.out', stagger: .07, scrollTrigger: { trigger: '.ix-sys__sw', start: 'top 82%', once: true } });
      gsap.from('.ix-sys__sw i', { scaleY: 0, transformOrigin: 'bottom', duration: 1.1, ease: 'expo.out', stagger: .07, scrollTrigger: { trigger: '.ix-sys__sw', start: 'top 82%', once: true } });
      gsap.from('.ix-read', { y: 60, opacity: 0, duration: 1.1, ease: 'expo.out', scrollTrigger: { trigger: '.ix-read', start: 'top 85%', once: true } });
      gsap.from('.ix-next__a', { y: 100, opacity: 0, duration: 1.3, ease: 'expo.out', scrollTrigger: { trigger: '.ix-next', start: 'top 75%', once: true } });
      gsap.from('.ix-next__a img', { x: 120, y: 80, duration: 1.6, ease: 'expo.out', scrollTrigger: { trigger: '.ix-next', start: 'top 75%', once: true } });
    }

    /* chapter tracker (after pins so starts are correct) */
    chs.forEach((c, i) => ScrollTrigger.create({ id: 'ch' + i, trigger: c, start: 'top 50%', end: 'bottom 50%', onToggle: (s) => s.isActive && setCh(i) }));
  };
  // build once; refresh on resize (track lengths are functions)
  build(); setCh(0);
  addEventListener('load', () => ScrollTrigger.refresh());
})();
