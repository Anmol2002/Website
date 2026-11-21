# Website

Portfolio website of **Manpreet Kaur**, freelance UI/UX designer - live at [uiuxflow.co.in](https://uiuxflow.co.in).

Static HTML/CSS/JS site (GSAP + Lenis), no build step. Hosted on **Vercel**: every push to `main` deploys automatically.

- 65 pages: home, work, 14 case studies, services, white-label, about, blog (17 articles), contact, legal, 404 and thank-you
- SEO: titles, descriptions, canonical, OG/Twitter, JSON-LD schema, `sitemap.xml`, `robots.txt`
- `vercel.json`: www -> non-www redirect, `/index.html` -> `/`, cache headers (Vercel serves `404.html` automatically and handles HTTPS)
- `.htaccess`: the same rules for Apache hosting (ignored by Vercel)
- Analytics: GA4 `G-4D47KGGFRD`
- Forms: FormSubmit (confirm the activation email after the first live submission)
