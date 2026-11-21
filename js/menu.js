/* Mobile menu: full-screen overlay opened by the round button in the navbar */
(() => {
  const btn = document.querySelector('.nav__menu');
  const menu = document.getElementById('mmenu');
  if (!btn || !menu) return;
  const set = (open) => {
    document.body.classList.toggle('menu-open', open);
    btn.setAttribute('aria-expanded', open);
    btn.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    menu.setAttribute('aria-hidden', !open);
    if (typeof lenis !== 'undefined') open ? lenis.stop() : lenis.start();
  };
  btn.addEventListener('click', () => set(!document.body.classList.contains('menu-open')));
  menu.querySelectorAll('a').forEach((a) => a.addEventListener('click', () => set(false)));
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') set(false); });
})();
