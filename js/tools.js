/* "My design stack": tabbed Figma-style canvas. Cards drop in, then a named cursor moves a selection from card to card. */
(() => {
  const sec = document.querySelector('.stk');
  if (!sec) return;
  const tabs = [...sec.querySelectorAll('.stk__tab')];
  const panels = [...sec.querySelectorAll('.stk__panel')];
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const desktop = matchMedia('(min-width: 1024px)');
  const ease = 'cubic-bezier(.65,0,.35,1)';
  let active = panels[0], idx = 0, timer = null, hovering = false, started = false, waits = [];

  panels.forEach((pn) => pn.querySelectorAll('.stk__fr').forEach((f, i) => {
    f.style.transitionDelay = `${(+f.closest('.stk__col').style.getPropertyValue('--c')) * 0.35 + (i % 3) * 0.12}s`;
  }));
  const frames = () => [...active.querySelectorAll('.stk__fr')];

  function select(i, instant) {
    if (!desktop.matches) return;
    const list = frames(); idx = i;
    const f = list[i], cd = f.querySelector('.stk__cd');
    const grid = active.querySelector('.stk__grid'), sel = active.querySelector('.stk__sel'), cur = active.querySelector('.stk__cur');
    const g = grid.getBoundingClientRect(), r = cd.getBoundingClientRect();
    const pad = 8, x = r.left - g.left - pad, y = r.top - g.top - pad;
    sel.style.transition = (instant ? 'none' : `transform .7s ${ease}, width .7s ${ease}, height .7s ${ease}`) + ', opacity .4s';
    sel.style.width = r.width + pad * 2 + 'px'; sel.style.height = r.height + pad * 2 + 'px';
    sel.style.transform = `translate(${x}px, ${y}px)`;
    cur.style.transition = instant ? 'opacity .4s' : `transform .9s ${ease}, opacity .4s`;
    cur.style.transform = `translate(${x + r.width - 30}px, ${y + r.height + 4}px)`;
    cur.classList.toggle('flip', x + r.width > grid.clientWidth - 200);
    sel.querySelector('.stk__tag').textContent = f.dataset.tag;
    list.forEach((o) => o.classList.toggle('is-sel', o === f));
  }
  const clear = () => { clearInterval(timer); waits.forEach(clearTimeout); waits = []; };
  function play(panel) {
    clear();
    panel.classList.remove('is-in'); void panel.offsetWidth;   // restart the entrance
    requestAnimationFrame(() => panel.classList.add('is-in'));
    waits.push(setTimeout(() => select(0, true), 1150));
    if (!reduce) waits.push(setTimeout(() => { timer = setInterval(() => { if (!hovering) select((idx + 1) % frames().length); }, 2400); }, 2600));
  }

  function show(tab, focus) {
    const pn = document.getElementById(tab.getAttribute('aria-controls'));
    if (pn === active) return;
    tabs.forEach((t) => { const on = t === tab; t.classList.toggle('on', on); t.setAttribute('aria-selected', on); t.tabIndex = on ? 0 : -1; });
    panels.forEach((p) => { p.hidden = p !== pn; p.classList.toggle('on', p === pn); });
    active = pn; idx = 0;
    if (focus) tab.focus();
    if (started) play(pn);
  }
  tabs.forEach((t, i) => {
    t.addEventListener('click', () => show(t));
    t.addEventListener('keydown', (e) => {
      if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
      e.preventDefault(); show(tabs[(i + (e.key === 'ArrowRight' ? 1 : tabs.length - 1)) % tabs.length], true);
    });
  });

  panels.forEach((pn) => pn.querySelectorAll('.stk__fr').forEach((f, i) => {
    const cd = f.querySelector('.stk__cd');
    const go = () => { if (pn !== active) return; hovering = true; select(i); };
    cd.addEventListener('mouseenter', go); cd.addEventListener('focus', go);
    cd.addEventListener('mouseleave', () => { hovering = false; });
    cd.addEventListener('blur', () => { hovering = false; });
  }));

  const start = () => { if (started) return; started = true; play(active); };
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { start(); io.disconnect(); } }), { threshold: 0.25 });
    io.observe(sec.querySelector('.stk__canvas'));
  } else start();
  addEventListener('resize', () => { if (started) select(idx, true); });
})();
