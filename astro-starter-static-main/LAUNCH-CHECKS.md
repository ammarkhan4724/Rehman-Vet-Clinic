# Launch checks

What is enforced, what is documented, and what is deliberately left for a
client repo.

This starter prefers **transferable** gates over charity-specific parity against
`_legacy/` HTML. jirarpar needed that harness because it was a like-for-like
conversion of a live site. A template has no live HTML to match.

---

## Commands

```bash
npm install
npm run build          # astro build + lint-build + machine-readable
npx astro check
npm test               # after a build; lead-capture reads dist/
npm run lighthouse     # local report only — needs Chrome + astro preview
```

CI (`.github/workflows/ci.yml`) runs the same set on every pull request, on the
**merge result**, not the branch head. Every gate runs even after one fails.
A step that did not run fails the job.

---

## What lint-build covers

Over every `dist/**/*.html`:

| Check | Fail when |
|---|---|
| One `h1` | 0 or 2+ |
| Heading hierarchy | a skip (h2 → h4) |
| Images | any `<img>` without `alt` |
| SEO | missing title; missing description or canonical on an indexable page; canonical on a noindex page |
| Schema | no `application/ld+json`, or invalid JSON |
| Lead forms | missing honeypot, Turnstile widget, or `action="/api/lead"` |
| Schema builders | a file in `src/components/schema/` with no page/layout call site |

**Blind spots (printed on every run):** no browser render; no Lighthouse; Pages
Functions are not executed.

---

## What machine-readable covers

- `robots.txt`, `sitemap.xml`, `sitemap.md`, `llms.txt`, `agents.md`, `ai/index.txt` exist
- every URL in `sitemap.xml` has a matching `ai/<slug>.txt`

Denominator grows from the sitemap, not from a hand-kept list.

---

## What tests cover

| File | Guards |
|---|---|
| `tests/lead-capture.test.mjs` | `FORMS` contract; honeypot; Turnstile; required fields; handler present |
| `tests/schema-call-sites.test.mjs` | unused Schema* files |
| `tests/static-output.test.mjs` | `output: 'static'`; no `prerender = false`; dummy secrets only |
| `tests/analytics-gating.test.mjs` | BaseLayout wires CookieYes + analytics; unset keys emit no tracker hosts; no Partytown |
| `tests/lighthouse-harness.test.mjs` | `npm run lighthouse` exists; ADR-024 floors; docs do not claim a 95 bar |

Lead-capture does **not** write to production D1 and does not call live
`siteverify` with a real secret.

---

## Intentional gaps (later)

These are real, and they are not TODOs pretending to be done:

1. **Lighthouse in CI.** The harness is here (`scripts/lighthouse-audit.mjs`,
   `npm run lighthouse`). The product bar is **ADR-024: ≥80 mobile / ≥90 desktop**
   on performance, accessibility, best-practices, and SEO — the same floors as
   jirarpar, not a fake 95. The script reports; it does not fail CI. It needs
   Chrome and minutes per form factor, so CI does not run it. Run it by hand
   against `astro preview` before a client launch. Add a live-URL job per client
   only if that repo wants a production check.
2. **Visual / browser verification of chrome** (drawer, form inline success).
   Gates do not render pages. Confirm in `wrangler pages dev` before launch.
3. **Legacy HTML parity / heading baselines.** Those exist for conversions.
   A greenfield client has nothing to parity against. If you *are* converting a
   live site, port jirarpar’s parity harness into the **client** repo, not here.
4. **Deploy workflow.** Pages can build from git, or you can add a GitHub
   Actions deploy later. This template documents the wrangler path; it does not
   bind every clone to one Cloudflare account.
5. **Live consent / tracker QA.** CookieYes and the analytics pack **are** in
   this starter (same product bar as the WordPress starter). Components skip
   when env vars are unset, so CI cannot prove a real banner or a real GTM
   hit. Confirm on a client domain after keys are set: first visit denied,
   accept analytics, reject-all as the negative control.
6. **i18n.** This starter is English-only. Bilingual clients should decide
   whether to follow the WordPress starter’s `LANGUAGES` pattern or stay single-locale.

---

## Pre-launch checklist (client repo)

- [ ] `site.isPlaceholder === false` and Cedar & Pine copy is gone
- [ ] `astro.config.mjs` `site` is the real origin
- [ ] Real Turnstile site + secret keys (not the `1x000…` dummy pair)
- [ ] CookieYes site key + the tracking IDs the brief uses (GTM **or** GA4, optional Meta / Clarity / CallRail)
- [ ] New D1 database created, migrated, bound — not the all-zero placeholder
- [ ] `TURNSTILE_SECRET_KEY` set on the **deployment** you will publish, not only on the project
- [ ] Test submit on the production hostname; row appears in D1
- [ ] Legal pages replaced with counsel-approved copy
- [ ] `npm run build` green; CI green
- [ ] `npm run lighthouse` against local preview — ADR-024 floors (≥80 mobile / ≥90 desktop)
