/* Work page: round "Click me" cursor over the detailed project cards (not the top strip) (mouse/trackpad only). */
(() => {
  if (!matchMedia('(hover: hover) and (pointer: fine)').matches) return;
  const cards = document.querySelectorAll('.wc');
  if (!cards.length) return;
  const c = document.createElement('div');
  c.className = 'ccur'; c.setAttribute('aria-hidden', 'true');
  c.innerHTML = '<span>Click me<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M7 17 17 7M8 7h9v9"/></svg></span>';
  document.body.appendChild(c);
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const gs = typeof gsap !== 'undefined' && !reduce;
  const qx = gs ? gsap.quickTo(c, 'x', { duration: 0.35, ease: 'power3.out' }) : (v) => { c.style.transform = `translate(${v}px, ${c._y || 0}px)`; c._x = v; };
  const qy = gs ? gsap.quickTo(c, 'y', { duration: 0.35, ease: 'power3.out' }) : (v) => { c._y = v; c.style.transform = `translate(${c._x || 0}px, ${v}px)`; };
  addEventListener('pointermove', (e) => { qx(e.clientX); qy(e.clientY); }, { passive: true });
  cards.forEach((card) => {
    card.addEventListener('pointerenter', () => c.classList.add('on'));
    card.addEventListener('pointerleave', () => c.classList.remove('on'));
  });
  addEventListener('pagehide', () => c.classList.remove('on'));
})();
