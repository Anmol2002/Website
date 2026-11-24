/* UI/UX quiz: 12 rounds of "spot the better UI", "tap the mistake" and "know the law". */
(() => {
  const root = document.getElementById('quiz');
  if (!root) return;
  const $ = (s, el = root) => el.querySelector(s);
  const screens = { intro: $('[data-screen="intro"]'), game: $('[data-screen="game"]'), result: $('[data-screen="result"]') };
  const card = $('[data-card]'), prog = $('[data-prog]'), scoreEl = $('[data-score]'), streakEl = $('[data-streak]');
  const ARW = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>';

  // mini phone / panel mockups used by the visual rounds
  const phone = (inner, cls = '') => `<div class="mk mk--phone ${cls}"><i class="mk__notch"></i>${inner}</div>`;
  const lines = (n = 3) => Array.from({ length: n }, (_, i) => `<i class="mk__ln" style="width:${[86, 64, 74, 52][i % 4]}%"></i>`).join('');

  const Q = [
    { type: 'ab', tag: 'Spot the better UI', q: 'Which “Buy now” button is easier to tap on a phone?',
      a: phone(`<i class="mk__img"></i>${lines(2)}<span class="mk__tiny">Buy now</span>`),
      b: phone(`<i class="mk__img"></i>${lines(2)}<span class="mk__big">Buy now</span>`),
      ok: 'b', note: 'Fitts’s law: big, easy-to-reach targets are faster to hit. Aim for at least 44–48px tall touch targets.' },
    { type: 'ab', tag: 'Spot the better UI', q: 'Which text can more people read comfortably?',
      a: `<div class="mk mk--panel"><b class="mk__t" style="color:#C9C9C9">Your order is on the way</b><p class="mk__p" style="color:#D4D4D4">It will arrive on Friday between 10 am and 2 pm.</p></div>`,
      b: `<div class="mk mk--panel"><b class="mk__t" style="color:#141414">Your order is on the way</b><p class="mk__p" style="color:#3D3D3D">It will arrive on Friday between 10 am and 2 pm.</p></div>`,
      ok: 'b', note: 'Contrast matters. Body text should reach at least 4.5:1 against its background (WCAG AA). Light grey on white fails.' },
    { type: 'mc', tag: 'Know the law', q: 'A menu with 20 options makes people decide more slowly. Which law describes this?',
      opts: ['Hick’s law', 'Fitts’s law', 'Murphy’s law', 'Moore’s law'], ok: 0,
      note: 'Hick’s law: the more choices you show, the longer a decision takes. Group, prioritise and hide what is rarely needed.' },
    { type: 'tap', tag: 'Find the mistake', q: 'One of these buttons breaks the design system. Tap it.',
      html: `<div class="mk mk--panel mk--row"><button data-t="0" class="mk__btn">Save</button><button data-t="1" class="mk__btn">Share</button><button data-t="2" class="mk__btn mk__btn--odd">Export</button><button data-t="3" class="mk__btn">Delete</button></div>`,
      ok: '2', note: 'Consistency builds trust. Same role, same style: one colour, one corner radius and one font weight per button type.' },
    { type: 'ab', tag: 'Spot the better UI', q: 'Where should the main navigation live in a mobile app?',
      a: phone(`<span class="mk__nav mk__nav--top"><i></i><i></i><i></i></span>${lines(4)}`),
      b: phone(`${lines(4)}<span class="mk__nav mk__nav--bot"><i></i><i></i><i></i><i></i></span>`),
      ok: 'b', note: 'Most people hold a phone in one hand. A bottom tab bar sits in the thumb zone; a top menu means stretching for every tap.' },
    { type: 'mc', tag: 'Know the law', q: 'People spend most of their time on other sites, so they expect yours to work the same way. This is…',
      opts: ['Pareto principle', 'Jakob’s law', 'Parkinson’s law', 'Tesler’s law'], ok: 1,
      note: 'Jakob’s law: reuse familiar patterns (logo top-left, cart top-right, search with a magnifier) so people can use your product without learning it.' },
    { type: 'ab', tag: 'Spot the better UI', q: 'Which error message actually helps?',
      a: `<div class="mk mk--panel"><span class="mk__lbl">Card number</span><span class="mk__in mk__in--err">4242 4242</span><p class="mk__err">Error 422: invalid input</p></div>`,
      b: `<div class="mk mk--panel"><span class="mk__lbl">Card number</span><span class="mk__in mk__in--err">4242 4242</span><p class="mk__err">Card number should be 16 digits. Check and try again.</p></div>`,
      ok: 'b', note: 'Good errors say what happened and how to fix it, in plain words, right next to the field.' },
    { type: 'mc', tag: 'Know the pattern', q: 'A list of content is loading. What makes the wait feel shortest?',
      opts: ['A blank white screen', 'A full-page spinner', 'A skeleton screen in the shape of the content', 'A popup saying “Please wait”'], ok: 2,
      note: 'Skeleton screens show the layout straight away, so the page feels faster and nothing jumps when the content arrives.' },
    { type: 'tap', tag: 'Find the mistake', q: 'Tap the field that will confuse people once they start typing.',
      html: `<div class="mk mk--panel mk--form"><div data-t="0" class="mk__fld"><span class="mk__lbl">Full name</span><span class="mk__in">Priya Sharma</span></div><div data-t="1" class="mk__fld"><span class="mk__in mk__in--ph">Email address</span></div><div data-t="2" class="mk__fld"><span class="mk__lbl">Phone</span><span class="mk__in">+91 98765 43210</span></div></div>`,
      ok: '1', note: 'A placeholder is not a label. It disappears as soon as someone types, so they forget what the field was for. Keep a visible label.' },
    { type: 'ab', tag: 'Spot the better UI', q: 'In which form is it clearer which label belongs to which field?',
      a: `<div class="mk mk--panel mk--prox mk--prox-a"><span class="mk__lbl">First name</span><span class="mk__in"></span><span class="mk__lbl">Last name</span><span class="mk__in"></span></div>`,
      b: `<div class="mk mk--panel mk--prox mk--prox-b"><span class="mk__lbl">First name</span><span class="mk__in"></span><span class="mk__lbl">Last name</span><span class="mk__in"></span></div>`,
      ok: 'b', note: 'Gestalt law of proximity: things that sit close together read as a group. Keep each label tight to its own field.' },
    { type: 'mc', tag: 'Know the system', q: 'Which set of spacing values follows an 8-point grid?',
      opts: ['5 · 10 · 15 · 20', '8 · 16 · 24 · 32', '7 · 14 · 21 · 28', '6 · 12 · 18 · 24'], ok: 1,
      note: 'An 8-point grid uses multiples of 8 (with 4 for fine detail). It keeps spacing consistent and makes developer handoff easier.' },
    { type: 'ab', tag: 'Spot the better UI', q: 'A new user has no projects yet. Which empty state is better?',
      a: `<div class="mk mk--panel mk--empty"><b class="mk__t" style="color:#9A9A9A">No data</b></div>`,
      b: `<div class="mk mk--panel mk--empty"><i class="mk__ill"></i><b class="mk__t">No projects yet</b><p class="mk__p">Create your first one in under a minute.</p><span class="mk__cta">+ New project</span></div>`,
      ok: 'b', note: 'An empty state is a first impression. Explain what goes here and give one clear next step.' },
  ];

  const RANKS = [
    [0, 'Pixel Padawan', 'Every designer starts here. Keep exploring and the patterns will click.'],
    [5, 'Wireframe Wizard', 'You know your way around a layout. A few laws to learn and you are flying.'],
    [8, 'Flow Master', 'You think like a product designer. Users would enjoy your screens.'],
    [11, 'UX Legend', 'Near-perfect. You see what users feel before they even feel it.'],
  ];
  let i = 0, score = 0, right = 0, streak = 0, best = 0, answers = [];
  try { best = +localStorage.getItem('qz-best') || 0; } catch (_) {}
  const bestEl = $('[data-best]');
  if (best) { bestEl.textContent = `Your best so far: ${best} points`; bestEl.hidden = false; }

  const show = (k) => { Object.values(screens).forEach((s) => s.classList.remove('is-on')); screens[k].classList.add('is-on'); scrollToQuiz(); };
  const scrollToQuiz = () => { const y = root.getBoundingClientRect().top + scrollY - 80; if (Math.abs(scrollY - y) > 40) { if (typeof lenis !== 'undefined') lenis.scrollTo(y, { duration: 0.6 }); else scrollTo({ top: y, behavior: 'smooth' }); } };
  prog.innerHTML = Q.map(() => '<i></i>').join('');

  function render() {
    const q = Q[i];
    [...prog.children].forEach((d, k) => { d.className = k < i ? (answers[k] ? 'ok' : 'no') : k === i ? 'on' : ''; });
    let body = '';
    if (q.type === 'ab') body = `<div class="qz__ab">${['a', 'b'].map((k) => `<button type="button" class="qz__opt qz__opt--ab" data-k="${k}"><span class="qz__key">${k.toUpperCase()}</span>${q[k]}</button>`).join('<span class="qz__vs">VS</span>')}</div>`;
    if (q.type === 'mc') body = `<div class="qz__mc">${q.opts.map((o, k) => `<button type="button" class="qz__opt qz__opt--mc" data-k="${k}"><span class="qz__key">${'ABCD'[k]}</span>${o}</button>`).join('')}</div>`;
    if (q.type === 'tap') body = `<div class="qz__tap">${q.html}</div>`;
    card.innerHTML = `<p class="qz__meta"><span>Round ${String(i + 1).padStart(2, '0')} / ${Q.length}</span><em>${q.tag}</em></p><h2 class="qz__q">${q.q}</h2>${body}<div class="qz__fb" data-fb hidden></div>`;
    card.classList.remove('is-in'); void card.offsetWidth; card.classList.add('is-in');
    card.querySelectorAll('.qz__opt, [data-t]').forEach((b) => {
      b.addEventListener('click', () => pick(b));
      if (b.tagName !== 'BUTTON') { b.tabIndex = 0; b.setAttribute('role', 'button'); b.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); pick(b); } }); }
    });
  }

  function pick(b) {
    if (card.classList.contains('is-done')) return;
    card.classList.add('is-done');
    const q = Q[i];
    const val = b.dataset.k ?? b.dataset.t;
    const ok = String(val) === String(q.ok);
    answers.push(ok);
    if (ok) { streak++; right++; const pts = 100 + (streak - 1) * 25; score += pts; bump(scoreEl, score); }
    else streak = 0;
    streakEl.querySelector('b').textContent = streak;
    streakEl.classList.toggle('is-hot', streak >= 2);
    b.classList.add(ok ? 'is-ok' : 'is-no');
    const good = card.querySelector(`[data-k="${q.ok}"], [data-t="${q.ok}"]`);
    if (good && !ok) good.classList.add('is-ok');
    card.querySelectorAll('.qz__opt, [data-t]').forEach((x) => x.setAttribute('disabled', ''));
    const fb = card.querySelector('[data-fb]');
    const yes = ['Nailed it!', 'Spot on!', 'Designer eyes!', 'Exactly right!'][right % 4];
    fb.innerHTML = `<p class="qz__verdict ${ok ? 'ok' : 'no'}">${ok ? `✓ ${yes}${streak >= 2 ? ` <small>🔥 ${streak} in a row · +${100 + (streak - 1) * 25}</small>` : ' <small>+100</small>'}` : '✕ Not quite'}</p><p class="qz__note"><b>Designer’s note</b>${q.note}</p><button type="button" class="qz__next">${i === Q.length - 1 ? 'See my result' : 'Next round'} ${ARW}</button>`;
    fb.hidden = false;
    fb.querySelector('.qz__next').addEventListener('click', next);
    fb.querySelector('.qz__next').focus({ preventScroll: true });
    if (innerWidth < 1024) setTimeout(() => { const y = fb.getBoundingClientRect().bottom - innerHeight + 24; if (y > 0) (typeof lenis !== 'undefined' ? lenis.scrollTo(scrollY + y, { duration: 0.5 }) : scrollBy({ top: y, behavior: 'smooth' })); }, 80);
  }
  const bump = (el, v) => { el.textContent = v; el.parentElement.classList.remove('is-bump'); void el.offsetWidth; el.parentElement.classList.add('is-bump'); };

  function next() { card.classList.remove('is-done'); i++; if (i < Q.length) render(); else result(); }

  function result() {
    const r = [...RANKS].reverse().find(([min]) => right >= min);
    const isBest = score > best;
    if (isBest) { best = score; try { localStorage.setItem('qz-best', score); } catch (_) {} }
    const pct = Math.round((right / Q.length) * 100);
    screens.result.innerHTML = `
      <p class="kicker">YOUR UX LEVEL</p>
      <div class="qz__ring" style="--p:${pct}"><svg viewBox="0 0 120 120" aria-hidden="true"><circle cx="60" cy="60" r="52"/><circle class="qz__ringfg" cx="60" cy="60" r="52"/></svg><b>${right}<small>/${Q.length}</small></b></div>
      <h2 class="qz__rank">${r[1]}</h2>
      <p class="qz__rtxt">${r[2]}</p>
      <p class="qz__pts">${score} points${isBest ? ' · <em>New best!</em>' : best ? ` · Best ${best}` : ''}</p>
      <ol class="qz__recap">${Q.map((q, k) => `<li class="${answers[k] ? 'ok' : 'no'}" title="${q.tag}">${answers[k] ? '✓' : '✕'}</li>`).join('')}</ol>
      <div class="qz__btns">
        <button type="button" class="qz__again">Play again ↻</button>
        <button type="button" class="qz__share">Share my score</button>
      </div>
      <div class="qz__cta"><p>Want screens that score 12/12 with your users?</p><a href="contact">Let’s talk about your product ${ARW}</a></div>`;
    show('result');
    screens.result.querySelector('.qz__again').addEventListener('click', start);
    screens.result.querySelector('.qz__share').addEventListener('click', (e) => share(e.currentTarget, r[1]));
    if (right >= 8) confetti();
  }

  async function share(btn, rank) {
    const text = `I scored ${right}/${Q.length} on Manpreet Kaur’s UI/UX quiz and I’m a “${rank}”. How UX are you?`;
    const url = 'https://uiuxflow.co.in/quiz';
    try {
      if (navigator.share) { await navigator.share({ title: 'How UX are you?', text, url }); return; }
      await navigator.clipboard.writeText(`${text} ${url}`);
      btn.textContent = 'Copied to clipboard ✓';
    } catch (_) {}
  }

  function confetti() {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const box = root.querySelector('.qz__confetti'); box.innerHTML = '';
    const cols = ['#FF5A1F', '#141414', '#FFD66B', '#2F9E5B', '#FCE6E1'];
    for (let k = 0; k < 70; k++) {
      const p = document.createElement('i');
      p.style.cssText = `left:${Math.random() * 100}%;background:${cols[k % cols.length]};--d:${1.8 + Math.random() * 1.6}s;--x:${(Math.random() - 0.5) * 220}px;--r:${Math.random() * 720}deg;animation-delay:${Math.random() * 0.4}s;width:${6 + Math.random() * 6}px;height:${8 + Math.random() * 8}px`;
      box.appendChild(p);
    }
    setTimeout(() => (box.innerHTML = ''), 4200);
  }

  function start() {
    i = 0; score = 0; right = 0; streak = 0; answers = [];
    scoreEl.textContent = '0'; streakEl.querySelector('b').textContent = '0'; streakEl.classList.remove('is-hot');
    show('game'); render();
  }
  $('[data-start]').addEventListener('click', start);
})();
