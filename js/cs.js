/* Case studies: image lightbox + active section in the sticky index */
(() => {
  const lb = document.querySelector('.cs-lb');
  if (!lb) return;
  const big = lb.querySelector('img');
  const close = () => { lb.hidden = true; big.src = ''; document.documentElement.style.overflow = ''; };
  document.querySelectorAll('.cs-zoom').forEach((b) => b.addEventListener('click', () => {
    const im = b.querySelector('img'); big.src = im.src; big.alt = im.alt;
    lb.hidden = false; document.documentElement.style.overflow = 'hidden'; lb.querySelector('.cs-lb__x').focus();
  }));
  lb.addEventListener('click', (e) => { if (e.target !== big) close(); });
  addEventListener('keydown', (e) => { if (e.key === 'Escape' && !lb.hidden) close(); });
  const links = [...document.querySelectorAll('.cs-toc a')];
  if (!links.length || !('IntersectionObserver' in window)) return;
  const io = new IntersectionObserver((es) => es.forEach((e) => {
    if (!e.isIntersecting) return;
    links.forEach((a) => { const on = a.getAttribute('href') === '#' + e.target.id; a.classList.toggle('on', on); if (on) { const w = a.parentElement; w.scrollTo({ left: a.offsetLeft - w.clientWidth / 2 + a.offsetWidth / 2, behavior: 'smooth' }); } });
  }), { rootMargin: '-45% 0px -50% 0px' });
  document.querySelectorAll('.cs-sec').forEach((s) => io.observe(s));
})();
