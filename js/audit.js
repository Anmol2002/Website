/* Free UX audit popup - homepage only.
   Opens once when the visitor passes 40% of the page. Closing it keeps it
   closed until the page is loaded again (no storage, so a refresh shows it again). */
(() => {
  const pop = document.getElementById('auditPop');
  if (!pop) return;
  const form = document.getElementById('auditForm');
  const err = document.getElementById('auErr');
  const btn = form.querySelector('.au__btn');
  const main = pop.querySelector('.au__main');
  const done = pop.querySelector('.au__done');
  const EMAIL = 'uiuxflow19@gmail.com';
  let shown = false, lastFocus = null;

  const scrolled = () => {
    const max = document.documentElement.scrollHeight - innerHeight;
    return max > 0 ? scrollY / max : 0;
  };
  const sm = () => (typeof lenis !== 'undefined' ? lenis : null);

  const open = () => {
    if (shown) return;
    shown = true;
    removeEventListener('scroll', check);
    if (document.body.classList.contains('menu-open')) { shown = false; addEventListener('scroll', check, { passive: true }); return; }
    lastFocus = document.activeElement;
    pop.hidden = false;
    document.documentElement.classList.add('au-lock');
    sm()?.stop();
    requestAnimationFrame(() => requestAnimationFrame(() => pop.classList.add('is-open')));
    // desktop: focus the first field; phones: focus the close button so the keyboard doesn't pop up
    const target = matchMedia('(pointer: coarse)').matches ? pop.querySelector('.au__x') : pop.querySelector('input[name="link"]');
    setTimeout(() => target.focus({ preventScroll: true }), 450);
  };
  const close = () => {
    pop.classList.remove('is-open');
    document.documentElement.classList.remove('au-lock');
    sm()?.start();
    setTimeout(() => { pop.hidden = true; }, 380);
    if (lastFocus && lastFocus.focus) lastFocus.focus({ preventScroll: true });
  };
  const check = () => { if (scrolled() >= 0.4) open(); };
  addEventListener('scroll', check, { passive: true });

  pop.addEventListener('click', (e) => { if (e.target.closest('[data-au-close]')) close(); });
  document.addEventListener('keydown', (e) => {
    if (pop.hidden) return;
    if (e.key === 'Escape') close();
    if (e.key === 'Tab') { // keep focus inside the popup
      const f = [...pop.querySelectorAll('button,input:not([type=hidden]):not(.hp),[tabindex="0"]')].filter((el) => el.offsetParent);
      if (!f.length) return;
      const first = f[0], last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  });

  form.addEventListener('input', (e) => e.target.closest('.au__in')?.classList.remove('bad'));
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    err.hidden = true;
    const link = form.elements.link, email = form.elements.email;
    // accept "example.com" by adding https://
    if (link.value.trim() && !/^https?:\/\//i.test(link.value.trim())) link.value = 'https://' + link.value.trim();
    let first = null;
    [link, email].forEach((el) => {
      const ok = el.value.trim() !== '' && el.checkValidity();
      el.closest('.au__in').classList.toggle('bad', !ok);
      if (!ok && !first) first = el;
    });
    if (first) { err.textContent = 'Please add a valid link and email.'; err.hidden = false; first.focus(); return; }
    if (form.elements._honey.value) return;

    btn.disabled = true; btn.querySelector('span').textContent = 'Sending…';
    try {
      const res = await fetch(`https://formsubmit.co/ajax/${EMAIL}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(Object.fromEntries(new FormData(form).entries())),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok || String(json.success) === 'false') throw new Error('failed');
      if (typeof gtag === 'function') gtag('event', 'generate_lead', { form: 'free_audit_popup' });
      main.hidden = true; done.hidden = false; done.focus({ preventScroll: true });
    } catch (_) {
      err.innerHTML = `Sorry, that didn’t send. Please email me at <a href="mailto:${EMAIL}">${EMAIL}</a>.`;
      err.hidden = false;
    } finally {
      btn.disabled = false; btn.querySelector('span').textContent = 'Get my free audit';
    }
  });
})();
