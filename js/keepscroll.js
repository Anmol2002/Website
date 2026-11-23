/* Come back to the same spot: remember where a project card was clicked on this
   page and restore that scroll position when the visitor returns from the case study. */
(() => {
  const KEY = 'ks:' + location.pathname.replace(/\/$/, '') ;
  const sel = 'a[href*="work/"]';
  document.addEventListener('click', (e) => {
    const a = e.target.closest(sel);
    if (!a || /images\//.test(a.getAttribute('href'))) return;
    try { sessionStorage.setItem(KEY, JSON.stringify({ y: Math.round(scrollY), dh: document.documentElement.scrollHeight, h: a.getAttribute('href'), i: [...document.querySelectorAll('a[href]')].filter((x) => x.getAttribute('href') === a.getAttribute('href')).indexOf(a), off: Math.round(a.getBoundingClientRect().top), t: Date.now() })); } catch (_) {}
  }, true);
  let saved = null;
  try { saved = JSON.parse(sessionStorage.getItem(KEY) || 'null'); } catch (_) {}
  const fromCase = /\/work\/[^/?#]+/.test(document.referrer || '') || (performance.getEntriesByType('navigation')[0] || {}).type === 'back_forward';
  if (!saved || !fromCase || Date.now() - saved.t > 1000 * 60 * 60 * 6) return;
  if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
  const go = () => {
    if (window.ScrollTrigger) ScrollTrigger.refresh();
    let y = saved.y;
    // the exact card that was clicked (the same project can also sit in the hero stack, hidden on phones)
    const same = saved.h ? [...document.querySelectorAll('a[href]')].filter((x) => x.getAttribute('href') === saved.h) : [];
    const el = same[saved.i] || null;
    const r = el && el.getBoundingClientRect();
    // same page height → the saved spot is exact; otherwise follow the card
    const same_h = saved.dh && Math.abs(document.documentElement.scrollHeight - saved.dh) < 40;
    if (!same_h && r && r.width > 0 && r.height > 0) y = el.getBoundingClientRect().top + (typeof lenis !== 'undefined' ? lenis.scroll : scrollY) - saved.off;
    y = Math.max(0, Math.min(y, document.documentElement.scrollHeight - innerHeight));
    if (typeof lenis !== 'undefined') lenis.scrollTo(y, { immediate: true, force: true }); else scrollTo(0, y);
    if (window.ScrollTrigger) ScrollTrigger.update();
  };
  const run = () => { setTimeout(go, 60); setTimeout(go, 700); };
  if (document.readyState === 'complete') run(); else addEventListener('load', run);
  addEventListener('pageshow', (ev) => { if (ev.persisted) setTimeout(go, 30); });
})();
