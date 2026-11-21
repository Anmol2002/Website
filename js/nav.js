/* Navbar dropdowns: hover on desktop, tap on touch, full keyboard support */
(() => {
  const dds = [...document.querySelectorAll('[data-dd]')];
  if (!dds.length) return;
  const hover = window.matchMedia('(hover:hover) and (pointer:fine)');
  const set = (dd, open) => {
    dd.classList.toggle('is-open', open);
    dd.querySelector('.nav__ddbtn').setAttribute('aria-expanded', open);
  };
  const closeAll = (except) => dds.forEach((d) => d !== except && set(d, false));
  dds.forEach((dd) => {
    const btn = dd.querySelector('.nav__ddbtn');
    const items = () => [...dd.querySelectorAll('.nav__panel a')];
    let t;
    dd.addEventListener('mouseenter', () => { if (!hover.matches) return; clearTimeout(t); closeAll(dd); set(dd, true); });
    dd.addEventListener('mouseleave', () => { if (!hover.matches) return; t = setTimeout(() => set(dd, false), 160); });
    btn.addEventListener('click', (e) => {
      const open = dd.classList.contains('is-open');
      // Services is a link: on touch the first tap opens the menu, the second follows the link
      if (btn.tagName === 'A' && open) return;
      e.preventDefault();
      closeAll(dd); set(dd, !open);
    });
    btn.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowDown') { e.preventDefault(); e.stopPropagation(); closeAll(dd); set(dd, true); items()[0].focus(); }
    });
    dd.addEventListener('keydown', (e) => {
      const list = items(), i = list.indexOf(document.activeElement);
      if (e.key === 'Escape') { set(dd, false); btn.focus(); }
      else if (i > -1 && (e.key === 'ArrowDown' || e.key === 'ArrowUp')) {
        e.preventDefault();
        list[(i + (e.key === 'ArrowDown' ? 1 : -1) + list.length) % list.length].focus();
      }
    });
    dd.addEventListener('focusout', () => setTimeout(() => { if (!dd.contains(document.activeElement)) set(dd, false); }, 0));
  });
  document.addEventListener('click', (e) => { if (!e.target.closest('[data-dd]')) closeAll(); });
  window.addEventListener('scroll', () => { if (!hover.matches) closeAll(); }, { passive: true });
})();
