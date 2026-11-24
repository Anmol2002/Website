/* About page: the review cards pop in the same way as on the home page. */
(() => {
  if (typeof gsap === 'undefined' || !document.querySelector('.reviews')) return;
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  gsap.utils.toArray('.reviews .q').forEach((q, i) => {
    gsap.from(q, { scale: 0.6, opacity: 0, duration: 0.8, ease: 'back.out(1.6)', delay: i * 0.12, scrollTrigger: { trigger: '.reviews', start: 'top 55%' } });
  });
  gsap.from('.reviews .kicker, .reviews .h2, .reviews .badge', { y: 50, opacity: 0, duration: 0.8, ease: 'power3.out', stagger: 0.1, scrollTrigger: { trigger: '.reviews', start: 'top 75%' } });
})();
