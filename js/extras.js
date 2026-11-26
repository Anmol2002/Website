/* Extras - page transition, live availability, wireframe→final slider, live prototype */
(() => {
  const root = document.documentElement;
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- orange page transition ---------- */
  if (!reduce) {
    const pt = document.createElement('div');
    pt.className = 'pt';
    pt.setAttribute('aria-hidden', 'true');
    pt.innerHTML = '<span class="pt__t">MANPREET KAUR</span>';
    document.body.appendChild(pt);
    root.classList.remove('pt-in'); // hand over from the first-paint cover to the animated overlay
    // reveal the new page
    requestAnimationFrame(() => requestAnimationFrame(() => root.classList.add('pt-ready')));
    addEventListener('pageshow', (ev) => { if (ev.persisted) { root.classList.remove('pt-leave'); root.classList.add('pt-ready'); } });

    document.addEventListener('click', (ev) => {
      const a = ev.target.closest('a[href]');
      if (!a || ev.defaultPrevented || ev.metaKey || ev.ctrlKey || ev.shiftKey || ev.button !== 0) return;
      if (a.target === '_blank' || a.hasAttribute('download')) return;
      const url = new URL(a.href, location.href);
      if (url.origin !== location.origin || /\.(?!html?$)[a-z0-9]+$/i.test(url.pathname)) return;
      if (url.pathname === location.pathname && url.hash) return;
      ev.preventDefault();
      root.classList.remove('pt-ready');
      root.classList.add('pt-enter-from-bottom');
      void pt.offsetWidth;
      root.classList.remove('pt-enter-from-bottom');
      root.classList.add('pt-leave');
      setTimeout(() => { location.href = url.href; }, 520);
    });
  }

  /* ---------- prefetch the next page on hover / touch, so it is ready when the transition ends ---------- */
  const pf = new Set([location.pathname]);
  const prefetch = (ev) => {
    const a = ev.target.closest && ev.target.closest('a[href]');
    if (!a || a.target === '_blank' || a.hasAttribute('download')) return;
    let url; try { url = new URL(a.href, location.href); } catch (_) { return; }
    if (url.origin !== location.origin || /\.(?!html?$)[a-z0-9]+$/i.test(url.pathname) || pf.has(url.pathname)) return;
    if (navigator.connection && navigator.connection.saveData) return;
    pf.add(url.pathname);
    const l = document.createElement('link'); l.rel = 'prefetch'; l.href = url.pathname + url.search; document.head.appendChild(l);
  };
  document.addEventListener('pointerover', prefetch, { passive: true });
  document.addEventListener('touchstart', prefetch, { passive: true });

  /* ---------- availability badge with live Mohali time ---------- */
  const fmt = new Intl.DateTimeFormat('en-US', { hour: 'numeric', minute: '2-digit', timeZone: 'Asia/Kolkata' });
  const tick = () => document.querySelectorAll('.avail__t').forEach((b) => { b.textContent = 'Mohali ' + fmt.format(new Date()); });
  tick(); setInterval(tick, 20000);

  /* ---------- wireframe → final compare ---------- */
  document.querySelectorAll('.cmp').forEach((cmp) => {
    const h = cmp.querySelector('.cmp__h');
    let drag = false;
    const set = (x) => {
      const r = cmp.getBoundingClientRect();
      const p = Math.max(0, Math.min(100, ((x - r.left) / r.width) * 100));
      cmp.style.setProperty('--p', p + '%');
      h.setAttribute('aria-valuenow', Math.round(p));
    };
    cmp.addEventListener('pointerdown', (e) => { drag = true; cmp.setPointerCapture(e.pointerId); set(e.clientX); });
    cmp.addEventListener('pointermove', (e) => { if (drag) set(e.clientX); });
    cmp.addEventListener('pointerup', () => { drag = false; });
    cmp.addEventListener('pointercancel', () => { drag = false; });
    h.addEventListener('keydown', (e) => {
      const cur = parseFloat(getComputedStyle(cmp).getPropertyValue('--p')) || 50;
      if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
        e.preventDefault();
        const p = Math.max(0, Math.min(100, cur + (e.key === 'ArrowLeft' ? -5 : 5)));
        cmp.style.setProperty('--p', p + '%'); h.setAttribute('aria-valuenow', p);
      }
    });
    // gentle hint when it scrolls into view
    if (!reduce && 'IntersectionObserver' in window) {
      const io = new IntersectionObserver((en) => {
        if (!en[0].isIntersecting) return;
        io.disconnect();
        let t0 = null;
        const anim = (t) => {
          if (drag) return;
          t0 = t0 || t;
          const k = (t - t0) / 1600;
          if (k > 1) { cmp.style.setProperty('--p', '50%'); return; }
          cmp.style.setProperty('--p', (50 + Math.sin(k * Math.PI * 2) * 28) + '%');
          requestAnimationFrame(anim);
        };
        requestAnimationFrame(anim);
      }, { threshold: 0.6 });
      io.observe(cmp);
    }
    const tabs = cmp.closest('.wfx').querySelectorAll('.wfx__tabs button');
    tabs.forEach((b) => b.addEventListener('click', () => {
      tabs.forEach((x) => x.classList.toggle('on', x === b));
      cmp.querySelector('.cmp__a').src = b.dataset.wf;
      cmp.querySelector('.cmp__b').src = b.dataset.fin;
      cmp.style.setProperty('--p', '50%');
    }));
  });

  /* ---------- live Figma prototype (loads on demand) ---------- */
  document.querySelectorAll('.try__phone').forEach((ph) => {
    ph.querySelector('.try__play').addEventListener('click', () => {
      const f = document.createElement('iframe');
      f.src = ph.dataset.src;
      f.title = 'Live Figma prototype';
      f.allow = 'fullscreen';
      f.loading = 'lazy';
      ph.appendChild(f);
      ph.classList.add('is-live');
    });
  });
})();

/* ---------- circular badge text: spread the letters so the ring closes with no gap ---------- */
(() => {
  const fit = () => document.querySelectorAll('textPath[data-fit]').forEach((tp) => {
    const text = tp.closest('text');
    const target = parseFloat(tp.dataset.fit);
    text.style.letterSpacing = '0px';
    const len = text.getComputedTextLength();
    const n = tp.textContent.length;
    if (!len || !n) return;
    text.style.letterSpacing = ((target - len) / n) + 'px';
  });
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(fit); else window.addEventListener('load', fit);
})();

/* ---------- email links: open a compose window everywhere ----------
   Phones/tablets: the normal mailto: opens the mail app.
   Desktop: many browsers have no mail app set up, so mailto: does nothing.
   There we open Gmail's compose window in a new tab and copy the address. */
(() => {
  const touch = matchMedia('(pointer: coarse)').matches;
  let toast, timer;
  const say = (msg) => {
    if (!toast) {
      toast = document.createElement('div');
      toast.className = 'mtoast'; toast.setAttribute('role', 'status');
      document.body.appendChild(toast);
    }
    toast.textContent = msg; toast.classList.add('is-on');
    clearTimeout(timer); timer = setTimeout(() => toast.classList.remove('is-on'), 3200);
  };
  document.addEventListener('click', (ev) => {
    const a = ev.target.closest('a[href^="mailto:"]');
    if (!a || touch || ev.button !== 0 || ev.metaKey || ev.ctrlKey || ev.shiftKey) return;
    const raw = a.getAttribute('href').slice(7);
    const [to, query = ''] = raw.split('?');
    const p = new URLSearchParams(query);
    const url = 'https://mail.google.com/mail/?view=cm&fs=1&to=' + encodeURIComponent(decodeURIComponent(to)) +
      (p.get('subject') ? '&su=' + encodeURIComponent(p.get('subject')) : '') +
      (p.get('body') ? '&body=' + encodeURIComponent(p.get('body')) : '');
    ev.preventDefault();
    const win = window.open(url, '_blank');
    if (win) win.opener = null;
    if (navigator.clipboard) navigator.clipboard.writeText(decodeURIComponent(to)).catch(() => {});
    if (!win) { location.href = a.href; return; }
    say('Opening Gmail · ' + decodeURIComponent(to) + ' copied');
  }, true);
})();
