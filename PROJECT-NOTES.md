# Manpreet Kaur — Portfolio · Project Notes

Last updated: 13 Nov 2026
Share this file and the Figma link at the start of a new chat to continue from here.

---

## 1. Links

- **Figma file ("mk"):** https://www.figma.com/design/1irCjvKWgJhCVWQw03yCbB/mk
  - Page **"Portfolio — Animated"**: original hero prototype (frames 01–09, Smart Animate), the old 2D Work/Services frames (W10–W25), the standalone **"3D — Services"** frame (22:2), the **"Project Shots"** frame (all project images) and the **"Export Tmp"** frame (full-size images used for export, safe to delete).
  - Page **"Portfolio — Full Page"**:
    - **"Manpreet Kaur — Portfolio"** (node 32:2): the full desktop design (1920 wide) with all animations as timeline keyframes.
    - **"Portfolio — Live Preview"** (node 50:2): a 1920×1080 frame that auto-scrolls the page with a sticky navbar. Press play in Figma.
- **Source projects ("Animations" file):** https://www.figma.com/design/F91Z4hk38cYYGCm1r7cdcs/Animations
  - HALCYON, KORA (page "V2 Premium"), VEKTA, CARGO Logistics, FORMA, Idea Machine, Build Crew, ODDPAPER.
  - **Do NOT use:** VELA (travel), Xq / Xq VIP, HOK, DIY. These are excluded at the client's request.

## 2. Website code (this folder)

```
mk-portfolio/
├── index.html      page markup (all sections)
├── css/style.css   design; 1rem = 10 design px at 1920 width
├── js/main.js      all animations (GSAP + ScrollTrigger + Lenis)
├── images/         mkp-*.jpg project screenshots (22)
├── svg/            girl, guy, dog, loop-l, loop-r illustrations
├── fonts/          Anton, Sora 400/600, Familjen Grotesk 600 (self-hosted)
└── vendor/         gsap 3.12.5, ScrollTrigger, lenis 1.1.13
```

To run it, double-click `index.html`. It works offline and needs no install.

### Key implementation facts
- **Scaling:** `html{font-size:calc(100vw/192)}` makes the layout match the 1920px Figma design at any desktop width.
- **Pinned 3D scenes:** these use `--su` (1 Figma px = `max(100vw/1920, 100vh/1080)`), so a 16:9 stage always covers the screen. Text near the screen edges is anchored with `calc(540*var(--su) ± 50vh …)`.
- **Selected Work:**
  - Pinned for `+=420%` of scroll, scrubbed.
  - A 30-tile wall at different depths (perspective 1500) falls in, then the camera pushes into HALCYON. The push uses `translateZ = 1500*(1-400/1920)`.
  - KORA, VEKTA and CARGO then wipe in, using `yPercent` (not px) so resizing the window doesn't break them.
  - Titles are **not scrubbed**. They play on their own when the timeline passes each wipe (`showTitle`), so they never sit half-revealed.
- **Services:**
  - Pinned for `+=480%`, scrubbed.
  - A ring of 6 cards: slot `rotateX(-60*i)`, card `translateZ(470)`, tilt `translateZ(-80) rotateY(-24) rotateZ(-4)`, perspective 1700.
  - Cards use a cream / orange / dark theme with SVG line drawings. Do not use project images on these cards.
  - The section ends with the "LET'S MAKE IT [img] NOTICEABLE /" marquee.
- **Navbar:**
  - The original design (Work and Services pills, MANPREET KAUR wordmark, "Top Rated on Upwork / 100% Job Success", "Let's talk"). Keep this design.
  - Sticky. After 60px of scroll, a blurred bar fades in: cream on light sections, dark on dark sections.
  - On dark sections (`body.nav-dark`), the hours text and the Let's talk pill turn white.
- **Easings from Figma:**
  - ease-out `cubic-bezier(.16,1,.3,1)` → `expo.out`
  - in-out `(.65,0,.35,1)` → `power3.inOut`
  - pop `(.34,1.4,.64,1)` → `back.out(1.7)`

## 3. Design system

| Token | Value |
|---|---|
| Orange (primary) | `#FF5A1F` |
| Ink | `#141414` (dark sections `#0F0E0D`) |
| Background | `#FCE6E1` |
| Card | `#FFF3EE` |
| Muted text | `#5B4A44` |
| Display font | Anton 400 (headlines, uppercase) |
| UI / body font | Sora 600 / 400 |
| Lead text font | Familjen Grotesk 600 |
| Corner radius | Low (8–14px) on cards and images; pills fully rounded |

The client prefers low corner radii, orange and cream, and no purple backgrounds.

## 4. Content in use

- **Name:** Manpreet Kaur, freelance UI/UX designer, Mohali, India, working worldwide.
- **Stats:**
  - Top Rated on Upwork
  - 100% Job Success
  - 5.0 / 5 rating
  - 1,195+ hours
  - Freelancing since 2021
- **Credentials:**
  - Google UX Design Professional Certificate
  - Bachelor's degree, Guru Nanak Dev University (2016–2020). The page currently says "Graphics & Web Designing", which still needs confirming.
  - Advanced UI/UX Design & Product Experience (2026)
- **Testimonials:** real Upwork reviews (5.0) plus Akash K., Project Lead.
- **Services (6):**
  - UI/UX Design
  - SaaS & Dashboards
  - Website Design
  - Landing Pages & CRO
  - Animated Hero & Prototypes
  - Design Systems
- **Packages (no prices shown):**
  - Landing Page
  - Website (most popular)
  - Product / SaaS
- **Socials:**
  - Instagram @manpreetdesign
  - YouTube @UIUXFlow19

## 5. Still to do (next sessions)

1. **Real links:** add the real Upwork, Behance and "Book a free call" links. They are currently `#`.
2. **Case study template** (Figma first, then code). Start with HALCYON. Sections:
   - Animated hero
   - Overview (client, role, timeline, tools)
   - Problem
   - Process / wireframes
   - Final screens
   - Design system snippet
   - Results / testimonial
   - Next project
3. **Remaining case studies:** KORA, VEKTA, CARGO, FORMA and Idea Machine, reusing the template.
4. **Case-study code:** one `case-study.html` plus a data file per project. Link it from the homepage project cards and the "View case study" button.
5. **Mobile version:** for the homepage and case studies. The current mobile CSS is basic only.
6. **Go live (optional):** drag the folder onto Netlify, or use Vercel.

## 6. Time estimate (Claude's working time)

| Task | Time |
|---|---|
| Case study template (design + animated hero) | ~40–50 min |
| Each additional case study | ~10–15 min |
| Case-study code | ~40 min template, then ~10 min per project |
| Mobile version | ~45–60 min |
