/* =========================================================
   Thank-you characters + 404 page animations
   ========================================================= */
(() => {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduce || !window.gsap) return;
  const sine = 'sine.inOut';
  const pop = 'back.out(1.7)';

  /* gentle mouse parallax for elements with data-depth */
  const parallax = (sel) => {
    const items = [...document.querySelectorAll(sel)].map((el) => ({
      d: +el.dataset.depth || 10,
      x: gsap.quickTo(el, 'x', { duration: 0.9, ease: 'power3.out' }),
      y: gsap.quickTo(el, 'y', { duration: 0.9, ease: 'power3.out' }),
    }));
    window.addEventListener('pointermove', (e) => {
      const nx = e.clientX / window.innerWidth - 0.5, ny = e.clientY / window.innerHeight - 0.5;
      items.forEach((i) => { i.x(nx * i.d); i.y(ny * i.d); });
    });
  };

  /* ---------- THANK YOU ---------- */
  if (document.querySelector('.tx__char')) {
    gsap.timeline({ delay: 0.5 })
      .from('.tx__char--girl', { xPercent: -140, duration: 1.3, ease: 'expo.out' })
      .from('.tx__char--guy', { xPercent: 140, duration: 1.3, ease: 'expo.out' }, 0)
      .from('.tx__char--dog', { xPercent: -260, duration: 1.5, ease: 'expo.out' }, 0.15)
      .from('.tx__char .bub', { scale: 0, opacity: 0, duration: 0.6, ease: pop, stagger: 0.25 }, 1.1);
    // little happy hops
    gsap.to('.tx__char--girl img', { y: -12, rotation: -2, duration: 0.5, ease: sine, yoyo: true, repeat: -1, delay: 1.8 });
    gsap.to('.tx__char--guy img', { y: -12, rotation: 2, duration: 0.55, ease: sine, yoyo: true, repeat: -1, delay: 2 });
    gsap.to('.tx__char--dog img', { y: -8, duration: 0.3, ease: sine, yoyo: true, repeat: -1, delay: 1.9 });
    gsap.to('.tx__char .bub', { y: -6, duration: 1.4, ease: sine, yoyo: true, repeat: -1, stagger: 0.4, delay: 2 });
  }

  /* ---------- SERVICES hero art ---------- */
  if (document.querySelector('.sh__art')) {
    gsap.timeline({ delay: 0.4 })
      .from('.sa-orbit', { scale: 0.6, opacity: 0, transformOrigin: '50% 50%', duration: 1.1, ease: 'expo.out' })
      .from('.sa-badge', { scale: 0, duration: 0.5, ease: pop, stagger: 0.08, transformOrigin: '50% 50%' }, 0.3)
      .from('.sa-dog', { y: -260, opacity: 0, duration: 0.9, ease: 'bounce.out' }, 0.5)
      .from('.sa-bub', { scale: 0, opacity: 0, duration: 0.5, ease: pop }, 1.3);
    // services orbit around the corgi; each badge stays upright
    gsap.to('.sa-spin', { rotation: 360, svgOrigin: '230 205', duration: 40, ease: 'none', repeat: -1 });
    gsap.to('.sa-badge', { rotation: -360, transformOrigin: '50% 50%', duration: 40, ease: 'none', repeat: -1 });
    gsap.to('.sa-dog', { y: -8, duration: 0.45, ease: sine, yoyo: true, repeat: -1, delay: 1.6 });
    gsap.to('.sa-bub', { y: -6, duration: 1.4, ease: sine, yoyo: true, repeat: -1, delay: 1.8 });
    gsap.to('.sa-star', { scale: 1.3, rotation: 45, transformOrigin: '50% 50%', duration: 1.2, ease: sine, yoyo: true, repeat: -1, stagger: 0.4 });
    // the corgi hops when you hover the button
    const cta = document.querySelector('.sh__btn');
    cta && cta.addEventListener('pointerenter', () => gsap.fromTo('.sa-dog', { yPercent: 0 }, { yPercent: -22, duration: 0.25, ease: 'power2.out', yoyo: true, repeat: 1 }));
  }

  /* ---------- 404 ---------- */
  if (document.querySelector('.e404')) {
    gsap.timeline({ delay: 0.15 })
      .from('.e404__k', { y: 20, opacity: 0, duration: 0.6, ease: 'expo.out' })
      .from('.e404__d', { yPercent: -120, opacity: 0, duration: 1, ease: 'bounce.out', stagger: 0.18 }, 0.1)
      .from('.e404__ring', { scale: 0, rotation: -180, duration: 1, ease: pop }, 0.3)
      .from('.e404__dog', { y: 160, opacity: 0, duration: 0.9, ease: pop }, 0.9)
      .from('.e404__h, .e404__lead, .e404__btns, .e404__links', { y: 40, opacity: 0, duration: 0.8, ease: 'expo.out', stagger: 0.1 }, 0.8)
      .from('.e404__girl', { xPercent: -150, duration: 1.3, ease: 'expo.out' }, 0.6)
      .from('.e404__guy', { xPercent: 150, duration: 1.3, ease: 'expo.out' }, 0.6)
      .from('.e404 .bub', { scale: 0, opacity: 0, duration: 0.6, ease: pop, stagger: 0.3 }, 1.6)
      .from('.e404__q', { scale: 0, rotation: -40, opacity: 0, duration: 0.7, ease: pop, stagger: 0.12 }, 1.2)
      .from('.e404__loop', { opacity: 0, rotation: 30, duration: 1.2, ease: 'expo.out' }, 0.2);
    // the corgi sniffs around inside the zero
    gsap.to('.e404__dog', { x: 14, rotation: 4, duration: 0.7, ease: sine, yoyo: true, repeat: -1, delay: 2 });
    gsap.to('.e404__ring', { rotation: 8, duration: 2.6, ease: sine, yoyo: true, repeat: -1, delay: 1.6 });
    // the two 4s wobble like they're looking for the page
    gsap.to('.e404__d:not(.e404__zero)', { rotation: (i) => (i ? 4 : -4), duration: 1.6, ease: sine, yoyo: true, repeat: -1, delay: 1.8 });
    gsap.to('.e404__girl img, .e404__guy img', { y: -10, duration: 1.8, ease: sine, yoyo: true, repeat: -1, stagger: 0.6, delay: 2 });
    gsap.to('.e404__q', { y: -14, rotation: 10, duration: 1.6, ease: sine, yoyo: true, repeat: -1, stagger: 0.3, delay: 2 });
    parallax('.e404 [data-depth]');
  }
})();
