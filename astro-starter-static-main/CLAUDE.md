# CLAUDE.md — Rules for agents in this repo

This file is the rulebook for any session working in this repository or in a
client repo created from it. Read it before generating, editing, or scaffolding
anything.

`AGENTS.md` is how to work alongside other sessions. `LAUNCH-CHECKS.md` is what
the gates cover. This file is the *what to do / not do* layer.

---

## Stack

- **Frontend:** Astro, **static-only** (`output: 'static'`), TypeScript strict, Tailwind CSS v4 (`@tailwindcss/vite`)
- **Content:** file-based collections in `src/content/` — no WordPress, no Reflex, no GraphQL CMS
- **Hosting:** Cloudflare Pages
- **Forms:** `functions/api/lead.js` + Cloudflare Turnstile
- **Styling:** Tailwind CSS v4 — `@tailwindcss/vite` in `astro.config.mjs`, tokens in `src/styles/global.css`. Do not add `@astrojs/tailwind`.
- **Cookie consent:** CookieYes (`src/components/CookieYes.astro`, env-gated)
- **Tracking:** GA4, GTM, Meta Pixel, Microsoft Clarity, CallRail — native load (no Partytown) via `src/components/analytics/`, Google Consent Mode v2 defaults, CookieYes auto-blocking. Same product bar as `astro-starter-wordpress` [ADR-014](https://github.com/Organix-Media/astro-starter-wordpress/blob/main/decisions/014-tracking-architecture.md). Missing env vars skip render.
- **Performance bar:** ADR-024 — Lighthouse ≥80 mobile / ≥90 desktop on all four scored categories. `npm run lighthouse` reports; it is not a CI gate. Do not claim a 95 floor.
- **Companion starter:** `Organix-Media/astro-starter-wordpress` when the client needs headless WP

---

## Hard rules — never break these

### Astro / build mode

- ❌ **Never** use `export const prerender = false`. The whole site is static.
- ❌ **Never** use `Astro.locals.runtime.env`. Read build-time env via `import.meta.env.*`.
- ❌ **Never** add server-rendered routes or request-time Astro endpoints. Form handlers in `functions/` are Pages Functions — different runtime, that is fine.
- ❌ **Never** add an Astro adapter or change `output` away from `'static'`.
- ✅ Assume the site is built once at deploy time and served as static HTML.

### Markup discipline

- ❌ **Never** write raw `<h1>`–`<h6>` in a `.astro` file. Use `<Heading level={n}>`.
- ❌ **Never** write raw `<img>` tags. Use `src/components/seo/Image.astro`. It throws when `alt` is missing and `decorative` is not set.
- ✅ **One sanctioned exception:** the Meta Pixel `<noscript>` 1×1 in `FacebookPixel.astro`. It is a conversion pixel, not site imagery, and `Image.astro` does not forward `style`.
- ❌ **Never** write raw `<title>` or `<meta>` tags in a page. Use `<SEOHead>` via `BaseLayout`.
- ✅ Every page uses `BaseLayout` (so SEOHead, SchemaBreadcrumb, CookieYes, and the analytics pack are always present) and at least one additional Schema* component appropriate to the page type.

### Images

- ❌ **Never** ship an `<Image>` without `alt`. For decorative images pass `alt=""` **and** `decorative={true}`.

### Content

- ✅ Prose a writer would change lives in `src/content/`, not in `.astro` files.
- ✅ Facts about the organisation live in `src/data/site.ts`. Do not invent a phone number, address, or claim. If unknown, leave it out.
- ❌ **Never** copy orphan / child PII, live donation credentials, or production D1 IDs from `jirarpar` or any other client repo.

### Forms / Turnstile

- ✅ Lead forms use `<LeadForm form="contact|newsletter">`. The page owns fields; the component owns endpoint, `_form`, honeypot, and Turnstile; `BaseLayout` owns `src/scripts/lead-forms.ts`; `functions/api/lead.js` owns `FORMS`.
- ❌ **Never** import the handler from `LeadForm.astro`. A page that forgot the handler would native-POST without `_form` and lose the submission.
- ✅ Server verifies Turnstile (`TURNSTILE_SECRET_KEY`) **before** the D1 write. If the secret is unset, reject (fail closed). Do not leave Turnstile as a TODO.
- ❌ **Never** commit a real Turnstile secret. `.env.example` may only contain Cloudflare’s documented dummy keys.

### Schema (JSON-LD)

- ✅ Use `src/components/schema/Schema*.astro`. Do not write raw `application/ld+json` script tags.
- ✅ Do not add a Schema* file that nothing imports. `npm run lint:build` and `tests/schema-call-sites.test.mjs` fail unused builders.
- Expected call sites in this starter:
  - Home / contact → `SchemaOrganization` + `SchemaLocalBusiness`
  - About → `SchemaOrganization`
  - Service pages → `SchemaService`
  - Journal posts → `SchemaArticle`
  - FAQ → `SchemaFAQPage`
  - Every page → `SchemaBreadcrumb` (via BaseLayout)

### Consent and tracking

- ✅ Wire trackers only through `src/components/CookieYes.astro` and `src/components/analytics/`. Env-gate every script. Unset = render nothing.
- ✅ Load natively (`async` / `defer` / CookieYes `text/plain`). Do **not** install `@astrojs/partytown` unless CrUX / Lighthouse show tracker INP as the bottleneck. See WP ADR-014.
- ✅ Consent Mode v2 defaults (`ConsentDefaults.astro`) must precede GTM / GA4 in `<head>`. CookieYes must precede the trackers it auto-blocks.
- ✅ Use GTM **or** standalone GA4, not both.
- ❌ **Never** invent a real CookieYes, GTM, GA4, Meta, Clarity, or CallRail id. `.env.example` stays empty for those rows.
- ❌ **Never** load CallRail under Partytown. Number swapping mutates the DOM.

### Environment

- ✅ Build-time (public, baked into HTML): `TURNSTILE_SITE_KEY`, `COOKIEYES_SITE_KEY`, `GTM_CONTAINER_ID`, `GA4_MEASUREMENT_ID`, `META_PIXEL_ID`, `MS_CLARITY_PROJECT_ID`, `CALLRAIL_ACCOUNT_ID`, `CALLRAIL_SWAP_KEY`.
- ✅ Runtime (Pages dashboard / `wrangler pages secret put`): `TURNSTILE_SECRET_KEY`, optional `ADMIN_PASS`, `CF_EMAIL_TOKEN`, webhooks.
- ❌ **Never** put secrets in client-side code. If it ships to the browser, it is public. Tracking IDs are public by construction; still do not commit a client's live ids in this template.

---

## Adding a page

1. Put replaceable copy in `src/content/`.
2. Create `src/pages/[name].astro` wrapped in `BaseLayout`.
3. Use `<Heading>` and `<Image>`.
4. Include the matching Schema* component(s).
5. If the route is dynamic, add it to `DYNAMIC_ROUTES` in `src/lib/pages.ts`.
6. `npm run build` — do not push a red local build.

---

## When in doubt

1. This file.
2. `AGENTS.md` / `LAUNCH-CHECKS.md`
3. The sibling WordPress starter’s `CLAUDE.md` for shared Organix rules (Heading, Image, SEOHead, static-only) — ignore its WordPress-specific sections.
4. Ask the human before introducing a CMS, an adapter, or a new form endpoint.

---

*Organix Media — astro-starter-static*
