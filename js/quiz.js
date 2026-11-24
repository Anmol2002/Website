/* "How UX are you?" — a role-based UX game for store owners, agency owners, SaaS founders and designers.
   8 decisions per path, a live meter, streaks, one hint, and a UX report card that unlocks at the end. */
(() => {
  const root = document.getElementById('quiz');
  if (!root) return;
  const $ = (s, el = root) => el.querySelector(s);
  const S = { intro: $('[data-screen="intro"]'), game: $('[data-screen="game"]'), result: $('[data-screen="result"]') };
  const card = $('[data-card]'), prog = $('[data-prog]'), streakEl = $('[data-streak]'), hintBtn = $('[data-hint]');
  const mFill = $('[data-mfill]'), mVal = $('[data-mval]'), mLbl = $('[data-mlbl]'), lockT = $('[data-lockt]');
  const ARW = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>';

  /* ---------- tiny mockup kit ---------- */
  const phone = (x, c = '') => `<div class="mk mk--phone ${c}"><i class="mk__notch"></i>${x}</div>`;
  const panel = (x, c = '') => `<div class="mk mk--panel ${c}">${x}</div>`;
  const img = (h = 34, t = '') => `<i class="mk__img" style="height:${h}%;--h:${h}">${t}</i>`;
  const ln = (...w) => w.map((v) => `<i class="mk__ln" style="width:${v}%"></i>`).join('');
  const mods = (b, c) => c.split(' ').filter(Boolean).map((m) => ` ${b}--${m}`).join('');
  const t = (x, c = '') => `<span class="mk__tx${mods('mk__tx', c)}">${x}</span>`;
  const btn = (x, c = '') => `<span class="mk__b${mods('mk__b', c)}">${x}</span>`;
  const fld = (l, v = '', c = '') => `<span class="mk__f${mods('mk__f', c)}">${l ? `<em>${l}</em>` : ''}<span>${v}</span></span>`;
  const pill = (x, c = '') => `<span class="mk__pill${mods('mk__pill', c)}">${x}</span>`;
  const tiles = (n, c = '') => `<span class="mk__tiles${mods('mk__tiles', c)}">${'<i></i>'.repeat(n)}</span>`;

  /* ---------- the four paths ---------- */
  const PATHS = {
    store: {
      label: 'Store owner', icon: '🛍️', sub: 'Shopify, WooCommerce or any online shop', meter: 'Conversion',
      story: 'Your online store gets steady traffic, but too few people buy. Make 8 decisions to fix it.',
      cats: ['Trust', 'Checkout', 'Mobile', 'Discovery'],
      ranks: ['Window Shopper', 'Store Tinkerer', 'Conversion Captain', 'Checkout Champion'],
      cta: ['Want me to find these leaks in your real store?', 'Get a free UX audit', 'contact'],
      q: [
        { type: 'ab', cat: 'Trust', q: 'A shopper is on your product page. Which version sells more?',
          a: phone(img(36) + t('Leather tote', 'h') + t('₹1,499', 'pr') + btn('Add to cart') + t('Shipping calculated at checkout', 'xs')),
          b: phone(img(36) + t('Leather tote', 'h') + t('₹1,499', 'pr') + pill('✓ Free shipping over ₹999 · arrives Fri', 'ok') + btn('Add to cart')),
          ok: 'b', hint: 'Think about the moment people abandon a cart.', note: 'Surprise costs at checkout are one of the most common reasons carts get abandoned. Show shipping and delivery up front, next to the price.' },
        { type: 'ab', cat: 'Checkout', q: 'Someone clicks “Checkout”. What should they see first?',
          a: panel(t('Create an account to continue', 'h') + fld('Email') + fld('Password') + fld('Confirm password') + btn('Create account')),
          b: panel(t('Checkout', 'h') + btn('Continue as guest') + t('Have an account? <u>Log in</u>', 'xs c') + ln(70, 50)),
          ok: 'b', hint: 'Every extra step at checkout costs you buyers.', note: 'Forcing an account before paying makes many first-time buyers leave. Offer guest checkout and invite them to save details after the order.' },
        { type: 'ab', cat: 'Mobile', q: 'Most of your visitors shop on phones. Which product page works better?',
          a: phone(img(30) + t('Leather tote', 'h') + ln(90, 80, 85, 70, 88, 60) + t('Scroll for more…', 'xs c')),
          b: phone(img(30) + t('Leather tote', 'h') + ln(90, 80, 85, 70) + `<span class="mk__sticky"><b>₹1,499</b>${btn('Add to cart')}</span>`),
          ok: 'b', hint: 'Where is the buy button when the thumb is ready?', note: 'A sticky Add to cart bar keeps the main action one tap away, however far someone scrolls through photos and details.' },
        { type: 'ab', cat: 'Trust', q: 'Which product photos make people confident enough to buy?',
          a: phone(img(22) + t('Linen shirt', 'h') + t('₹1,999', 'pr') + ln(80, 60) + btn('Add to cart')),
          b: phone(img(44, '<i class="mk__dots"><i></i><i></i><i></i><i></i></i>') + tiles(4, 'th') + t('Model is 5′6″ and wears S', 'xs') + btn('Add to cart')),
          ok: 'b', hint: 'Online, the photos have to do the job of touching the product.', note: 'Several large photos, zoom and real-life context (like model size) answer questions a shopper would otherwise ask in a shop, and reduce returns.' },
        { type: 'mc', cat: 'Trust', q: 'Where do customer reviews help sales the most?',
          opts: ['In the footer, on a separate page', 'Right under the price, near Add to cart', 'In a popup when someone tries to leave', 'Only on the homepage'], ok: 1,
          hint: 'Reviews matter most at the moment of decision.', note: 'Show the star rating and review count next to the price and buy button, with the full reviews further down the same page.' },
        { type: 'ab', cat: 'Discovery', q: 'A first-time visitor lands on your homepage. Which hero works?',
          a: panel(img(46, '<b class="mk__heroT">Welcome to our store</b>') + ln(60, 40)),
          b: panel(img(46, '<b class="mk__heroT">Handmade leather bags.<br>Free returns for 30 days.</b>') + btn('Shop bags')),
          ok: 'b', hint: 'You have about five seconds.', note: 'Say what you sell, why it is worth it and what to do next. “Welcome to our store” uses the most valuable space on the site to say nothing.' },
        { type: 'ab', cat: 'Discovery', q: 'A shopper searches for “blak tote”. What should happen?',
          a: panel(fld('', 'blak tote') + t('0 results found', 'h') + t('Try another search.', 'xs')),
          b: panel(fld('', 'blak tote') + t('Showing results for <b>black tote</b>', 'xs') + tiles(3)),
          ok: 'b', hint: 'Typos are normal. Dead ends are not.', note: 'Search should forgive typos and never end in a dead end. Suggest corrections, close matches or best sellers instead of “0 results”.' },
        { type: 'mc', cat: 'Mobile', q: 'Your product page takes 8 seconds to load on mobile. What do you fix first?',
          opts: ['Add a bigger banner', 'Compress and lazy-load the large images', 'Add a live chat widget', 'Add a discount popup'], ok: 1,
          hint: 'What is usually the heaviest thing on a product page?', note: 'Large, uncompressed images are usually the biggest cause of slow store pages. Resize, compress and lazy-load them before adding anything else.' },
      ],
    },
    agency: {
      label: 'Agency owner', icon: '🏢', sub: 'Design, dev or marketing agency', meter: 'Client wins',
      story: 'Your agency wants better clients and smoother projects. Make 8 decisions to get there.',
      cats: ['Positioning', 'Lead generation', 'Process'],
      ranks: ['Freelance Hustler', 'Studio Builder', 'Client Magnet', 'Agency Legend'],
      cta: ['Need a designer working quietly behind your brand?', 'See the white-label partnership', 'white-label'],
      q: [
        { type: 'ab', cat: 'Positioning', q: 'Which agency homepage headline wins better clients?',
          a: panel(t('We do design, development, marketing, SEO, apps & more', 'h') + btn('Contact us')),
          b: panel(t('Shopify stores that convert, for D2C beauty brands', 'h') + btn('See our work')),
          ok: 'b', hint: 'Who is this agency for?', note: 'A clear niche makes the right clients say “that’s us” and lets you charge for expertise. “We do everything” sounds like everyone else.' },
        { type: 'ab', cat: 'Lead generation', q: 'Which case study convinces a prospect?',
          a: panel(t('Our work', 'h') + tiles(6)),
          b: panel(t('Problem', 'lbl') + ln(80) + t('What we did', 'lbl') + ln(70) + t('Result', 'lbl') + ln(60) + tiles(2)),
          ok: 'b', hint: 'Clients buy outcomes, not screenshots.', note: 'Tell the story: the client’s problem, the decisions you made and what changed. A grid of screenshots shows taste, not thinking.' },
        { type: 'ab', cat: 'Lead generation', q: 'Which contact form brings in more enquiries?',
          a: panel(fld('Name') + fld('Company') + fld('Website') + fld('Phone') + fld('Budget') + fld('Timeline') + t('+ 6 more fields', 'xs c')),
          b: panel(fld('Name') + fld('Email') + fld('What do you need?') + fld('Budget range') + btn('Send')),
          ok: 'b', hint: 'Each field is a reason to quit.', note: 'Ask only what you need to reply well. Collect the rest on the first call, when the prospect is already interested.' },
        { type: 'ab', cat: 'Lead generation', q: 'How should your services page talk about price?',
          a: panel(t('Pricing', 'h') + ln(80, 60) + btn('Contact us for pricing')),
          b: panel(`<span class="mk__plans"><i>Starter<br><b>from $X</b></i><i class="mk__hot">Growth<br><b>from $Y</b></i><i>Scale<br><b>Custom</b></i></span>` + btn('Book a call')),
          ok: 'b', hint: 'Prospects want to know if they are in the right place.', note: 'Starting prices and clear packages pre-qualify leads, so you spend calls with clients who can afford you.' },
        { type: 'mc', cat: 'Process', q: 'A new client signs. What should happen before any design?',
          opts: ['Start high-fidelity screens right away', 'Discovery: goals, users and what is not working', 'Choose the colour palette', 'Start building the website'], ok: 1,
          hint: 'You can’t solve a problem you haven’t defined.', note: 'Discovery aligns everyone on goals and users. It prevents the most expensive kind of revision: redesigning because the brief was wrong.' },
        { type: 'mc', cat: 'Process', q: 'How do you stop endless revision loops?',
          opts: ['Offer unlimited revisions', 'Agree revision rounds at the wireframe and UI stages', 'Skip wireframes to save time', 'Show everything only at the end'], ok: 1,
          hint: 'Fix structure early, when changes are cheap.', note: 'Get sign-off on structure at the wireframe stage, then on visuals. Agreed rounds keep feedback focused and projects on time.' },
        { type: 'mc', cat: 'Process', q: 'What makes design handoff smooth for your developers?',
          opts: ['JPG exports sent by email', 'An organised Figma file with components, specs and a prototype', 'A PDF of all screens', 'A video call and nothing else'], ok: 1,
          hint: 'Developers need to inspect, not guess.', note: 'Components, spacing, states and a clickable prototype answer most developer questions before they are asked.' },
        { type: 'mc', cat: 'Positioning', q: 'You bring in a white-label designer. What protects your client relationship?',
          opts: ['The designer emails your client directly', 'An NDA, your branding on every file and no client contact unless you want it', 'The designer’s logo on the files', 'Nothing, trust is enough'], ok: 1,
          hint: 'The client should only ever see your agency.', note: 'A good white-label partner stays invisible: NDA, your brand, your tools and your client relationship.' },
      ],
    },
    saas: {
      label: 'SaaS founder', icon: '🚀', sub: 'Startup, web app or AI product', meter: 'Activation',
      story: 'People sign up for your product, but many never come back. Make 8 decisions to turn trials into users.',
      cats: ['Activation', 'Clarity', 'Trust'],
      ranks: ['Beta Tester', 'Product Tinkerer', 'Activation Ace', 'Product Legend'],
      cta: ['Turning sign-ups into active users is what I design for.', 'Let’s talk about your product', 'contact'],
      q: [
        { type: 'ab', cat: 'Activation', q: 'A new user logs in for the first time. What do they see?',
          a: panel(t('Welcome tour · step 1 of 7', 'lbl') + t('Here is the sidebar…', 'h') + ln(80, 70) + btn('Next')),
          b: panel(t('Let’s get your first result', 'h') + `<span class="mk__chk"><i class="mk__done">Create your workspace</i><i>Add your first project</i><i>Invite a teammate</i></span>` + btn('Add first project')),
          ok: 'b', hint: 'Show value, not menus.', note: 'Lead new users to their first win quickly. A short checklist with one clear next step beats a long tour of the interface.' },
        { type: 'ab', cat: 'Clarity', q: 'Which dashboard helps a busy manager most?',
          a: panel(tiles(9, 'eq')),
          b: panel(`<span class="mk__kpi"><small>Revenue this month</small><b>$48.2k</b><em>▲ 12%</em></span>` + tiles(3)),
          ok: 'b', hint: 'What is the one number they open the dashboard for?', note: 'Lead with the one metric that matters, then supporting detail. Nine equal charts make people hunt for the answer.' },
        { type: 'ab', cat: 'Trust', q: 'Which pricing page converts trial users better?',
          a: panel(`<span class="mk__plans"><i>Basic</i><i>Pro</i><i>Team</i></span>` + btn('Contact sales')),
          b: panel(`<span class="mk__plans"><i>Basic<br><b>$9</b></i><i class="mk__hot">Pro · popular<br><b>$29</b></i><i>Team<br><b>$79</b></i></span>` + btn('Start free trial')),
          ok: 'b', hint: 'Decisions are easier with a recommendation.', note: 'Clear prices and one highlighted “most popular” plan reduce the effort of choosing, so more people pick a plan.' },
        { type: 'ab', cat: 'Activation', q: 'Which sign-up form gets more people through?',
          a: panel(fld('Email', 'priya@mail.com') + fld('Password', '••••••') + t('✕ Password is invalid', 'err') + btn('Sign up')),
          b: panel(fld('Email', 'priya@mail.com') + fld('Password', '••••••••') + `<span class="mk__chk"><i class="mk__done">8+ characters</i><i class="mk__done">One number</i></span>` + btn('Sign up')),
          ok: 'b', hint: 'Tell people the rules before they break them.', note: 'Show password rules up front and tick them off live. Vague errors after submitting make people give up.' },
        { type: 'ab', cat: 'Activation', q: 'A new user has no projects yet. Which empty state is better?',
          a: panel(t('No data', 'grey'), 'mk--empty'),
          b: panel(`<i class="mk__ill"></i>` + t('No projects yet', 'h') + t('Create your first one in under a minute.', 'xs') + btn('+ New project'), 'mk--empty'),
          ok: 'b', hint: 'An empty screen is still a first impression.', note: 'Explain what goes here and give one clear next step. Empty states are the onboarding most teams forget to design.' },
        { type: 'mc', cat: 'Clarity', q: 'Users keep missing a key feature. What is the best first fix?',
          opts: ['Write a longer help article', 'Put it where users already work, with a short hint at the right moment', 'Show a popup on every login', 'Rename the whole product'], ok: 1,
          hint: 'Meet users where they already are.', note: 'Features get discovered in context. Place them in the workflow and use one well-timed hint instead of interrupting everyone.' },
        { type: 'ab', cat: 'Trust', q: 'A payment fails. Which message keeps the customer?',
          a: panel(fld('Card number', '4242 4242', 'err') + t('Error 402: payment_failed', 'err') + btn('Retry')),
          b: panel(fld('Card number', '4242 4242', 'err') + t('Your card was declined. Try another card or contact your bank.', 'err') + btn('Try another card')),
          ok: 'b', hint: 'Would your customer understand error 402?', note: 'Good errors say what happened and how to fix it, in plain words. Error codes belong in your logs, not your UI.' },
        { type: 'mc', cat: 'Clarity', q: 'Data is loading in a table. What makes the wait feel shortest?',
          opts: ['A blank screen', 'A full-page spinner', 'A skeleton in the shape of the table', 'A popup saying “Please wait”'], ok: 2,
          hint: 'Show the shape of what is coming.', note: 'Skeleton screens show the layout straight away, so the product feels faster and nothing jumps when data arrives.' },
      ],
    },
    designer: {
      label: 'Designer', icon: '🎨', sub: 'UI/UX, product or web designer', meter: 'UX score',
      story: 'Eight classic UX decisions every product designer meets. How sharp is your eye?',
      cats: ['Usability', 'Visual design', 'UX laws'],
      ranks: ['Pixel Padawan', 'Wireframe Wizard', 'Flow Master', 'UX Legend'],
      cta: ['Like these principles in action? See them in real projects.', 'Browse my case studies', 'work'],
      q: [
        { type: 'ab', cat: 'Usability', q: 'Which “Buy now” button is easier to tap on a phone?',
          a: phone(img(36) + ln(80, 60) + `<span class="mk__tiny">Buy now</span>`), b: phone(img(36) + ln(80, 60) + btn('Buy now', 'big')),
          ok: 'b', hint: 'Fingers are not mouse pointers.', note: 'Fitts’s law: bigger, easier-to-reach targets are faster to hit. Aim for touch targets of at least 44–48px.' },
        { type: 'ab', cat: 'Visual design', q: 'Which text can more people read comfortably?',
          a: panel(t('Your order is on the way', 'h faint') + t('It arrives Friday between 10 am and 2 pm.', 'xs faint')),
          b: panel(t('Your order is on the way', 'h') + t('It arrives Friday between 10 am and 2 pm.', 'xs')),
          ok: 'b', hint: 'Not everyone has perfect eyesight or a bright screen.', note: 'Body text should reach at least 4.5:1 contrast against its background (WCAG AA). Light grey on white fails.' },
        { type: 'mc', cat: 'UX laws', q: 'A menu with 20 options makes people decide more slowly. Which law is this?',
          opts: ['Hick’s law', 'Fitts’s law', 'Murphy’s law', 'Moore’s law'], ok: 0,
          hint: 'More choices, more thinking time.', note: 'Hick’s law: decision time grows with the number of choices. Group, prioritise and hide what is rarely needed.' },
        { type: 'tap', cat: 'Visual design', q: 'One of these buttons breaks the design system. Tap it.',
          html: `<div class="mk mk--panel mk--row"><button data-t="0" class="mk__btn">Save</button><button data-t="1" class="mk__btn">Share</button><button data-t="2" class="mk__btn mk__btn--odd">Export</button><button data-t="3" class="mk__btn">Delete</button></div>`,
          ok: '2', hint: 'Look at colour, shape and type style.', note: 'Same role, same style: one colour, one corner radius and one font weight per button type builds trust.' },
        { type: 'ab', cat: 'Usability', q: 'Where should the main navigation live in a mobile app?',
          a: phone(`<span class="mk__nav mk__nav--top"><i></i><i></i><i></i></span>` + ln(90, 70, 80, 60)), b: phone(ln(90, 70, 80, 60) + `<span class="mk__nav mk__nav--bot"><i></i><i></i><i></i><i></i></span>`),
          ok: 'b', hint: 'Where does your thumb rest?', note: 'Most people hold a phone in one hand. A bottom tab bar sits in the thumb zone; a top menu means stretching for every tap.' },
        { type: 'tap', cat: 'Usability', q: 'Tap the field that will confuse people once they start typing.',
          html: `<div class="mk mk--panel mk--form"><div data-t="0" class="mk__fld"><span class="mk__lbl">Full name</span><span class="mk__in">Priya Sharma</span></div><div data-t="1" class="mk__fld"><span class="mk__in mk__in--ph">Email address</span></div><div data-t="2" class="mk__fld"><span class="mk__lbl">Phone</span><span class="mk__in">+91 98765 43210</span></div></div>`,
          ok: '1', hint: 'What disappears when you type?', note: 'A placeholder is not a label: it vanishes as soon as someone types. Keep a visible label above every field.' },
        { type: 'mc', cat: 'UX laws', q: 'People expect your site to work like the sites they already use. This is…',
          opts: ['Pareto principle', 'Jakob’s law', 'Parkinson’s law', 'Tesler’s law'], ok: 1,
          hint: 'Users spend most of their time on other sites.', note: 'Jakob’s law: reuse familiar patterns so people can use your product without learning it first.' },
        { type: 'mc', cat: 'Visual design', q: 'Which spacing set follows an 8-point grid?',
          opts: ['5 · 10 · 15 · 20', '8 · 16 · 24 · 32', '7 · 14 · 21 · 28', '6 · 12 · 18 · 24'], ok: 1,
          hint: 'Multiples of one number.', note: 'An 8-point grid (with 4 for fine detail) keeps spacing consistent and makes developer handoff easier.' },
      ],
    },
  };

  /* ---------- state ---------- */
  let P, key, i = 0, meter = 20, streak, right, answers, hints, playing = false, pendingHref = null;
  const N = 8;
  let bests = {}; try { bests = JSON.parse(localStorage.getItem('qz-best2') || '{}'); } catch (_) {}

  const roles = $('[data-roles]');
  roles.innerHTML = Object.entries(PATHS).map(([k, p]) => `<button type="button" class="qz__role" data-role="${k}"><span class="qz__ricon">${p.icon}</span><b>${p.label}</b><small>${p.sub}</small>${bests[k] ? `<em>Best ${bests[k]}%</em>` : ''}<span class="qz__rgo">${ARW}</span></button>`).join('');
  roles.querySelectorAll('[data-role]').forEach((b) => b.addEventListener('click', () => start(b.dataset.role)));

  const refresh = () => { if (typeof ScrollTrigger !== 'undefined') requestAnimationFrame(() => ScrollTrigger.refresh()); }; // page height changes, keep the solid header in sync
  const show = (k) => { Object.values(S).forEach((s) => s.classList.remove('is-on')); S[k].classList.add('is-on'); toTop(); refresh(); };
  const toTop = () => { const y = root.getBoundingClientRect().top + scrollY - 80; if (Math.abs(scrollY - y) > 40) (typeof lenis !== 'undefined' ? lenis.scrollTo(y, { duration: 0.6 }) : scrollTo({ top: y, behavior: 'smooth' })); };
  const setMeter = (v, delta) => {
    meter = Math.max(0, Math.min(100, v));
    mFill.style.width = meter + '%'; mVal.textContent = meter + '%';
    if (delta) { const f = document.createElement('span'); f.className = 'qz__delta ' + (delta > 0 ? 'up' : 'dn'); f.textContent = (delta > 0 ? '+' : '') + delta + '%'; $('[data-meter]').appendChild(f); setTimeout(() => f.remove(), 1200); }
  };

  function start(k) {
    key = k; P = PATHS[k]; i = 0; streak = 0; right = 0; answers = []; hints = 1; playing = true;
    mLbl.textContent = P.meter; setMeter(20);
    streakEl.querySelector('b').textContent = '0'; streakEl.classList.remove('is-hot');
    hintBtn.disabled = true; hintBtn.querySelector('small').textContent = '1 left';
    prog.innerHTML = P.q.map(() => '<i></i>').join('');
    document.body.classList.add('qz-playing');
    show('game'); intro();
  }

  function intro() {
    card.innerHTML = `<div class="qz__story"><span class="qz__ricon big">${P.icon}</span><p class="qz__meta"><span>Playing as</span><em>${P.label}</em></p><h2 class="qz__q">${P.story}</h2><p class="qz__rules">Each good decision raises your <b>${P.meter}</b> meter. Streaks add a bonus. You get one hint. Finish all 8 to unlock your <b>UX report card</b>.</p><button type="button" class="qz__next">Let’s go ${ARW}</button></div>`;
    anim(); card.querySelector('.qz__next').addEventListener('click', render);
    updLock();
  }

  function render() {
    const q = P.q[i];
    [...prog.children].forEach((d, k) => { d.className = k < i ? (answers[k] ? 'ok' : 'no') : k === i ? 'on' : ''; });
    let body = '';
    if (q.type === 'ab') body = `<div class="qz__ab">${['a', 'b'].map((k) => `<button type="button" class="qz__opt qz__opt--ab" data-k="${k}"><span class="qz__key">${k.toUpperCase()}</span>${q[k]}</button>`).join('<span class="qz__vs">VS</span>')}</div>`;
    if (q.type === 'mc') body = `<div class="qz__mc">${q.opts.map((o, k) => `<button type="button" class="qz__opt qz__opt--mc" data-k="${k}"><span class="qz__key">${'ABCD'[k]}</span>${o}</button>`).join('')}</div>`;
    if (q.type === 'tap') body = `<div class="qz__tap">${q.html}</div>`;
    card.innerHTML = `<p class="qz__meta"><span>Decision ${i + 1} of ${N}</span><em>${q.cat}</em></p><h2 class="qz__q">${q.q}</h2>${body}<p class="qz__hintx" data-hx hidden></p><div class="qz__fb" data-fb hidden></div>`;
    anim();
    card.querySelectorAll('.qz__opt, [data-t]').forEach((b) => {
      b.addEventListener('click', () => pick(b));
      if (b.tagName !== 'BUTTON') { b.tabIndex = 0; b.setAttribute('role', 'button'); b.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); pick(b); } }); }
    });
    hintBtn.disabled = hints < 1;
    updLock(); refresh();
  }
  const anim = () => { card.classList.remove('is-in', 'is-done'); void card.offsetWidth; card.classList.add('is-in'); };
  const updLock = () => { const left = N - i; lockT.textContent = left <= 0 ? 'Unlocked!' : left === 1 ? 'Unlocks after this decision' : `Unlocks in ${left} decisions`; $('[data-lock]').classList.toggle('is-near', left <= 3); };

  hintBtn.addEventListener('click', () => {
    if (hints < 1 || !playing || card.classList.contains('is-done') || !card.querySelector('[data-hx]')) return;
    hints--; hintBtn.disabled = true; hintBtn.querySelector('small').textContent = '0 left';
    const q = P.q[i], hx = card.querySelector('[data-hx]');
    hx.innerHTML = `<b>💡 Manpreet’s hint</b>${q.hint}`; hx.hidden = false;
    if (q.type === 'mc') { const wrong = [...card.querySelectorAll('.qz__opt')].filter((b) => +b.dataset.k !== q.ok); wrong.sort(() => Math.random() - 0.5).slice(0, 2).forEach((b) => { b.classList.add('is-out'); b.disabled = true; }); }
  });

  function pick(b) {
    if (card.classList.contains('is-done')) return;
    card.classList.add('is-done');
    const q = P.q[i], val = b.dataset.k ?? b.dataset.t, ok = String(val) === String(q.ok);
    answers.push(ok);
    let d;
    if (ok) { streak++; right++; d = 10 + (streak >= 2 ? Math.min(streak, 4) : 0); } else { streak = 0; d = -5; }
    setMeter(meter + d, d);
    streakEl.querySelector('b').textContent = streak; streakEl.classList.toggle('is-hot', streak >= 2);
    b.classList.add(ok ? 'is-ok' : 'is-no');
    const good = card.querySelector(`[data-k="${q.ok}"], [data-t="${q.ok}"]`); if (good && !ok) good.classList.add('is-ok');
    card.querySelectorAll('.qz__opt, [data-t]').forEach((x) => x.setAttribute('disabled', ''));
    hintBtn.disabled = true;
    const yes = ['Great call!', 'Spot on!', 'Exactly right!', 'Nailed it!'][right % 4];
    const left = N - i - 1;
    const nudge = left === 0 ? 'Your report card is ready' : left <= 2 ? `Only ${left} to go — your report is almost unlocked` : '';
    const fb = card.querySelector('[data-fb]');
    fb.innerHTML = `<p class="qz__verdict ${ok ? 'ok' : 'no'}">${ok ? `✓ ${yes}` : '✕ Costly choice'} <small>${d > 0 ? '+' : ''}${d}% ${P.meter.toLowerCase()}${streak >= 2 ? ` · 🔥 ${streak} in a row` : ''}</small></p><p class="qz__note"><b>Why</b>${q.note}</p><div class="qz__fbend">${nudge ? `<span class="qz__nudge">${nudge}</span>` : ''}<button type="button" class="qz__next">${left === 0 ? 'Unlock my report card 🔓' : `Next decision ${ARW}`}</button></div>`;
    fb.hidden = false; refresh();
    fb.querySelector('.qz__next').addEventListener('click', next);
    fb.querySelector('.qz__next').focus({ preventScroll: true });
    if (innerWidth < 1024) setTimeout(() => { const y = fb.getBoundingClientRect().bottom - innerHeight + 24; if (y > 0) (typeof lenis !== 'undefined' ? lenis.scrollTo(scrollY + y, { duration: 0.5 }) : scrollBy({ top: y, behavior: 'smooth' })); }, 80);
  }

  function next() { i++; if (i < N) render(); else result(); }

  function result() {
    playing = false; document.body.classList.remove('qz-playing');
    const tier = right >= 8 ? 3 : right >= 6 ? 2 : right >= 4 ? 1 : 0;
    const rank = P.ranks[tier];
    const isBest = !bests[key] || meter > bests[key];
    if (isBest) { bests[key] = meter; try { localStorage.setItem('qz-best2', JSON.stringify(bests)); } catch (_) {} }
    const cats = P.cats.map((c) => { const qs = P.q.map((q, k) => [q, answers[k]]).filter(([q]) => q.cat === c); const ok = qs.filter(([, a]) => a).length; return [c, ok, qs.length]; });
    const fixes = P.q.filter((q, k) => !answers[k]);
    S.result.innerHTML = `
      <div class="qz__report">
        <div class="qz__rhead">
          <p class="kicker">UX REPORT CARD · ${P.label.toUpperCase()}</p>
          <div class="qz__ring" style="--p:${meter}"><svg viewBox="0 0 120 120" aria-hidden="true"><circle cx="60" cy="60" r="52"/><circle class="qz__ringfg" cx="60" cy="60" r="52"/></svg><b><span class="qz__num">${meter}<small>%</small></span></b><span>${P.meter}</span></div>
          <h2 class="qz__rank">${rank}</h2>
          <p class="qz__pts">${right} of ${N} good decisions${isBest ? ' · <em>New best!</em>' : ''}</p>
        </div>
        <div class="qz__rbody">
          <h3>Your scores</h3>
          <ul class="qz__cats">${cats.map(([c, ok, n]) => `<li><span>${c}</span><i><b style="width:${Math.round((ok / n) * 100)}%"></b></i><em>${ok}/${n}</em></li>`).join('')}</ul>
          <h3>${fixes.length ? 'Fix these first' : 'Nothing to fix'}</h3>
          ${fixes.length ? `<ol class="qz__fixes">${fixes.map((q) => `<li><b>${q.cat}</b>${q.note}</li>`).join('')}</ol>` : '<p class="qz__perfect">A perfect run. You make the decisions most teams learn the hard way.</p>'}
        </div>
      </div>
      <div class="qz__btns">
        <button type="button" class="qz__again">Play again ↻</button>
        <button type="button" class="qz__swap">Try another role</button>
        <button type="button" class="qz__share">Share my result</button>
      </div>
      <div class="qz__cta"><p>${P.cta[0]}</p><a href="${P.cta[2]}">${P.cta[1]} ${ARW}</a></div>`;
    show('result');
    S.result.querySelector('.qz__again').addEventListener('click', () => start(key));
    S.result.querySelector('.qz__swap').addEventListener('click', () => show('intro'));
    S.result.querySelector('.qz__share').addEventListener('click', (e) => share(e.currentTarget, rank));
    if (right >= 6) confetti();
  }

  async function share(btn, rank) {
    const text = `I played “How UX are you?” as a ${P.label.toLowerCase()} and got ${right}/${N}: ${rank}. Can you beat it?`;
    const url = 'https://uiuxflow.co.in/quiz';
    try { if (navigator.share) { await navigator.share({ title: 'How UX are you?', text, url }); return; } await navigator.clipboard.writeText(`${text} ${url}`); btn.textContent = 'Copied to clipboard ✓'; } catch (_) {}
  }

  function confetti() {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const box = root.querySelector('.qz__confetti'); box.innerHTML = '';
    const cols = ['#FF5A1F', '#141414', '#FFD66B', '#2F9E5B', '#FCE6E1'];
    for (let k = 0; k < 70; k++) { const p = document.createElement('i'); p.style.cssText = `left:${Math.random() * 100}%;background:${cols[k % 5]};--d:${1.8 + Math.random() * 1.6}s;--x:${(Math.random() - 0.5) * 220}px;--r:${Math.random() * 720}deg;animation-delay:${Math.random() * 0.4}s;width:${6 + Math.random() * 6}px;height:${8 + Math.random() * 8}px`; box.appendChild(p); }
    setTimeout(() => (box.innerHTML = ''), 4200);
  }

  /* ---------- keep players in the game: confirm before leaving mid-game ---------- */
  const leave = $('[data-leave]');
  const openLeave = (href) => {
    pendingHref = href;
    const left = N - i;
    $('[data-leavet]').textContent = `You are ${left} decision${left === 1 ? '' : 's'} away from your UX report card. If you leave now, your progress is lost.`;
    leave.hidden = false; $('[data-stay]').focus();
  };
  window.addEventListener('click', (e) => {
    if (!playing) return;
    const a = e.target.closest('a[href]');
    if (!a || leave.contains(a) || root.contains(a)) return;
    const h = a.getAttribute('href');
    if (!h || h.startsWith('#') || a.target === '_blank') return;
    e.preventDefault(); e.stopImmediatePropagation(); openLeave(a.href);
  }, true);
  $('[data-stay]').addEventListener('click', () => { leave.hidden = true; });
  $('[data-go]').addEventListener('click', (e) => { e.preventDefault(); playing = false; leave.hidden = true; if (pendingHref) location.href = pendingHref; });
  leave.addEventListener('click', (e) => { if (e.target === leave) leave.hidden = true; });
  addEventListener('keydown', (e) => { if (e.key === 'Escape' && !leave.hidden) leave.hidden = true; });
  addEventListener('beforeunload', (e) => { if (playing && i > 0) { e.preventDefault(); e.returnValue = ''; } });
})();
