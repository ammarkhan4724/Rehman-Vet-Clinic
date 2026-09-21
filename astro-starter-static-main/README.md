# astro-starter-static

The canonical Organix Media **GitHub template** for client websites that are **static Astro with no CMS** — file-based YAML / Markdown, Cloudflare Pages, Turnstile on forms, CookieYes consent, and the Organix analytics pack.

> **Status:** Scaffold ready. `npm install && npm run build` works out of the box against placeholder demo content (Cedar & Pine Studio). Replace that copy before any client domain goes live.

This is the **no-CMS companion** to [`astro-starter-wordpress`](https://github.com/Organix-Media/astro-starter-wordpress). Production patterns come from [`jirarpar`](https://github.com/Organix-Media/jirarpar) (live: [jirarpar.org](https://jirarpar.org)), generalized so a new client does not inherit charity-specific pages, orphan records, or production D1 IDs.

---

## When to use which starter

| Starter | Use when | Do not use when |
|---|---|---|
| **This repo — `astro-starter-static`** | The client has no CMS. Writers edit YAML / Markdown in git. Site is static Astro on Cloudflare Pages. | Editors must publish from WordPress, or the project is a Reflex site. |
| **`astro-starter-wordpress`** | Headless WordPress + WPGraphQL + SCF. Editors live in WP; Astro is the frontend. | There is no WordPress, or you were about to add GraphQL “just in case”. |
| **`Reflex-Astro-Starter` (archived)** | Historical reference only. Reflex CMS client sites are archived. | Any new client. Do not create repos from the Reflex starter. |

If the brief is “static marketing site, we will change copy in PRs”, start here. If the brief is “the client’s staff will log into WordPress”, start from the WordPress starter. Do not bolt a CMS onto this repo later — switch starters.

---

## Stack

- **Frontend:** Astro (static-only, `output: 'static'`), TypeScript 6 (strict), **Tailwind CSS v4** via `@tailwindcss/vite`
- **Content:** Astro content collections — YAML for structured pages, Markdown for journal / legal
- **Hosting:** Cloudflare Pages
- **Forms:** Pages Functions + **Cloudflare Turnstile** (client widget + server `siteverify`) + optional D1
- **Cookie consent:** CookieYes (Quebec Law 25 / GDPR / CCPA) — env-gated; unset key skips the banner
- **Tracking:** GA4, GTM, Meta Pixel, Microsoft Clarity, CallRail — native load via `src/components/analytics/` (Google Consent Mode v2 + CookieYes auto-blocking). Same product bar as `astro-starter-wordpress` (ADR-014). Missing env vars skip render.
- **SEO:** `Heading`, `Image` (alt required), `SEOHead` in `BaseLayout`; Schema* components with real call sites
- **Machine-readable:** `/sitemap.xml`, `/sitemap.md`, `/llms.txt`, `/agents.md`, `/ai/*.txt`
- **Quality:** `astro check`, `scripts/lint-build.mjs`, `scripts/machine-readable.mjs`, `npm test`, CI. Product Lighthouse bar is **ADR-024: ≥80 mobile / ≥90 desktop** (`npm run lighthouse` — local report, not a CI gate).

There is **no WordPress, no WPGraphQL, no Reflex, and no SSR**.

### Styling

**Tailwind CSS v4** is wired the Astro 7–supported way: the `@tailwindcss/vite` plugin in `astro.config.mjs`, `@import "tailwindcss"` in `src/styles/global.css`, and that file imported from `BaseLayout`. Utility classes work in every `.astro` page and component.

Cedar & Pine colors, fonts, and the `nav` breakpoint (800px) live in the `@theme` block. Replace those tokens with the client brand. Do **not** add `@astrojs/tailwind` — that integration is for Tailwind 3.

---

## Repo layout

```
astro-starter-static/
├── .github/workflows/ci.yml     ← build, check, test, lint-build, machine-readable
├── functions/api/lead.js        ← POST /api/lead (Turnstile → D1 → optional email/CRM)
├── functions/api/leads-data.js  ← GET /api/leads-data (ADMIN_PASS)
├── migrations/0001_leads.sql    ← D1 schema
├── public/_headers              ← security headers + Turnstile / CookieYes / tracking CSP
├── scripts/lint-build.mjs       ← SEO / a11y / form / unused-schema gate
├── scripts/machine-readable.mjs ← sitemap + AI mirror gate
├── scripts/lighthouse-audit.mjs ← ADR-024 report (not a CI gate)
├── src/
│   ├── content/                 ← file-based CMS (YAML + Markdown)
│   ├── components/CookieYes.astro
│   ├── components/analytics/    ← Consent Mode v2, GTM, GA4, Meta, Clarity, CallRail
│   ├── components/seo/          ← Heading, Image, SEOHead
│   ├── components/schema/       ← Organization, LocalBusiness, Service, Article, FAQ, Breadcrumb
│   ├── components/forms/        ← LeadForm + Turnstile
│   ├── layouts/BaseLayout.astro
│   ├── lib/pages.ts             ← route catalog for sitemap / llms
│   ├── pages/                   ← routes + machine-readable endpoints
│   └── styles/global.css        ← Tailwind v4 entry + Cedar & Pine tokens
├── AGENTS.md                    ← how to work in this repo
├── CLAUDE.md                    ← hard rules for agents
├── LAUNCH-CHECKS.md             ← what the gates cover
├── astro.config.mjs             ← output: 'static' + `@tailwindcss/vite`
└── wrangler.toml                ← Pages + placeholder D1 binding
```

---

## Scripts

| Command | What it does |
|---|---|
| `npm run dev` | Astro dev server (`localhost:4321`). Pages Functions do **not** run here. |
| `npm run build` | `astro build` + lint-build + machine-readable. Fails on quality violations. |
| `npm run build:fast` | `astro build` only |
| `npm run check` | `astro check` |
| `npm run lint:build` | Gate against existing `dist/` |
| `npm run machine` | Confirm sitemap + `/ai` mirrors |
| `npm test` | Node test runner. Lead-capture tests read `dist/` — build first. |
| `npm run preview` | Serve `dist/` |
| `npm run lighthouse` | ADR-024 report against a local preview. Needs Chrome. Not a CI gate. |

Lighthouse walks every `dist/**/*.html` route. Serve the **built** site, not `astro dev`:

```bash
npm run build
npx astro preview --port 4331 --host 127.0.0.1
npm run lighthouse -- --origin http://127.0.0.1:4331
npm run lighthouse -- --origin http://127.0.0.1:4331 --form-factor desktop
```

`lighthouse@12` is not a `package.json` dependency. Install it once with
`npm install --no-save --no-package-lock lighthouse@12` so the sweep does not
re-resolve the registry on every route; otherwise the script uses
`npx --yes lighthouse@12`. Reports land in `.lighthouse/` (gitignored).

The only starter exemption is SEO on `/404.html` (`noindex` is correct). Do not
copy jirarpar's unpublished-blog or `/ai` HTML exemptions unless the client
site actually has those pages.

To exercise Turnstile + `/api/lead` locally:

```bash
npm run build:fast
npx wrangler pages dev dist --binding TURNSTILE_SECRET_KEY=1x0000000000000000000000000000000AA
```

Use Cloudflare’s [dummy Turnstile keys](https://developers.cloudflare.com/turnstile/troubleshooting/testing/) in development. They always pass / always fail on purpose.

---

## Creating a client repo from this template

This repository should be marked as a **GitHub template** (`is_template`). Use GitHub’s template mechanism, not a fork — the client repo must have no upstream link.

**Repo settings a human must flip** in GitHub **Settings → General** (the API token used to open this repo cannot set these):

1. Check **Template repository**
2. Add topics: `astro`, `tailwind`, `cloudflare-pages`, `starter-kit`, `template`, `static-site`, `typescript`, `no-cms`

```bash
gh repo create Organix-Media/[client-slug] \
  --template Organix-Media/astro-starter-static \
  --private --clone
```

Then, in the new repo:

1. Replace `src/data/site.ts` (name, URL, phone, address, schema types). Set `isPlaceholder: false`.
2. Set `site` in `astro.config.mjs` to the public origin.
3. Replace everything under `src/content/` with approved client copy. Delete Cedar & Pine.
4. Rename `wrangler.toml` `name` to the Pages project slug. Create a **new** D1 database (`npx wrangler d1 create [client]_leads`) and paste **that** `database_id`. Never copy another project’s ID.
5. Apply `migrations/0001_leads.sql` to the new database.
6. Create a real Turnstile widget for the client domain. Put `TURNSTILE_SITE_KEY` in the Pages **build** env (and GitHub Actions if you add a deploy workflow). Put `TURNSTILE_SECRET_KEY` in Pages **runtime** secrets.
7. Add the client domain in CookieYes. Put `COOKIEYES_SITE_KEY` in the Pages **build** env.
8. Set the tracking IDs the brief actually uses (`GTM_CONTAINER_ID` **or** `GA4_MEASUREMENT_ID`, plus optional Meta / Clarity / CallRail). Leave unused vars empty — components skip.
9. Optional: `CF_EMAIL_TOKEN`, `NOTIFY_TO` / `NOTIFY_FROM`, `ADMIN_PASS`, CRM webhooks.
10. `npm run build` locally. Push. Connect Cloudflare Pages to the repo (`build command: npm run build`, `output: dist`). Deploy from the **repo root** so `functions/` is discovered.

---

## No-CMS content edit workflow

1. Open the collection file a writer would change (`src/content/…`).
2. Edit YAML or Markdown. Do not put replaceable prose in `.astro` files.
3. If you add a page, wrap it in `BaseLayout`, use `<Heading>` / `<Image>`, and add the matching Schema* component.
4. If you add a dynamic route, register it in `src/lib/pages.ts` `DYNAMIC_ROUTES` or the build fails.
5. `npm run build`. Open a pull request. CI runs the same gates.

---

## Secrets and variables

Mirror of the WordPress starter table, trimmed to what a static (no-CMS) site uses. Tracking IDs are public — they ship in HTML — but this template still keeps them empty so the demo builds without live trackers.

### Build env (Astro — Pages build environment / GitHub Actions `env:`)

| Variable | Role |
|---|---|
| `TURNSTILE_SITE_KEY` | Public widget key. Dummy `1x00000000000000000000AA` is fine in this template only. |
| `COOKIEYES_SITE_KEY` | CookieYes site key. Unset = no banner. |
| `GTM_CONTAINER_ID` | GTM container (`GTM-…`). Unset = no GTM. |
| `GA4_MEASUREMENT_ID` | Standalone GA4 (`G-…`). Use **or** GTM, not both. |
| `META_PIXEL_ID` | Meta Pixel. Optional. |
| `MS_CLARITY_PROJECT_ID` | Microsoft Clarity. Optional. |
| `CALLRAIL_ACCOUNT_ID` | CallRail **company** id in the `swap.js` path. Optional. |
| `CALLRAIL_SWAP_KEY` | Completes the dashboard snippet URL. Optional. |

Not in this table (WordPress-only): `WP_GRAPHQL_URL`, reviews providers (`SERPAPI_*` / `OUTSCRAPER_*`), `GOOGLE_BUSINESS_*`, `LANGUAGES`, `CALLRAIL_COMPANY_ID` / `CALLRAIL_API_KEY` (runtime leads proxy — this starter uses D1).

### Pages runtime secrets (`functions/`)

| Variable | Role |
|---|---|
| `TURNSTILE_SECRET_KEY` | Server `siteverify`. Handler **rejects all submissions** if unset. Dummy `1x0000000000000000000000000000000AA` for local wrangler only. |
| `ADMIN_PASS` | `GET /api/leads-data` |
| `CF_EMAIL_TOKEN` / `CF_ACCOUNT_ID` | Optional notification after D1 write |
| `NOTIFY_TO` / `NOTIFY_FROM` | Optional email recipients |
| `CRM_WEBHOOK_URL` / `MASTER_GHL_WEBHOOK_URL` | Optional lead fan-out |

GitHub Actions secrets do **not** reach Pages Functions. Setting a secret on the project does not change an already-shipped deployment — it is baked in at deploy time (same lesson as jirarpar).

`.env.example` contains **placeholder / dummy keys only**. Never commit a real secret. Tracking rows stay empty in the template.

---

## Deploy notes (from jirarpar, still true)

- Run wrangler from the **repository root**, never `cd dist`. Functions resolve from cwd.
- Pass `--branch main` (or the project’s production branch) or you land on a preview that may have no D1 / no secrets.
- `wrangler.toml` `name` is the Pages project that a deploy without `--project-name` will hit or **create**. Set it before the first deploy.

---

## Documentation

- **[CLAUDE.md](./CLAUDE.md)** — hard rules (static-only, Heading / Image / SEOHead, Turnstile, consent + tracking, no unused schema)
- **[src/components/analytics/README.md](./src/components/analytics/README.md)** — tracker loading + consent gates
- **[AGENTS.md](./AGENTS.md)** — how sessions work in a template / client repo
- **[LAUNCH-CHECKS.md](./LAUNCH-CHECKS.md)** — gates, coverage, ADR-024 Lighthouse bar, intentional gaps

---

*Maintained by Organix Media. Internal — not for client distribution as a finished site. The demo identity (Cedar & Pine) is scaffold only.*
