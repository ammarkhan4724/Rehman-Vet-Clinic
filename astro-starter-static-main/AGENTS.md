# AGENTS.md

How to work in this template and in client repos created from it.

`CLAUDE.md` is the hard-rules layer for the code. This file is how sessions
avoid producing work that has to be done twice.

Durable coordination lessons from `Organix-Media/jirarpar` `AGENTS.md` apply
here. Charity-specific conversion rules (`_legacy/` is read-only, parity vs
live HTML, orphan biography mirrors) do **not**. This starter has no `_legacy/`
and no live client site to stay in lockstep with.

---

## Product line

| Repo | Role |
|---|---|
| `Organix-Media/astro-starter-static` (this) | No-CMS static Astro + Tailwind v4 template (CookieYes + analytics pack, ADR-024 Lighthouse harness) |
| `Organix-Media/astro-starter-wordpress` | Headless WordPress + Astro template |
| `Organix-Media/Reflex-Astro-Starter` | Archived. Do not start new clients here. |
| `Organix-Media/jirarpar` | Production no-CMS reference (do not copy PII or live IDs) |

Before you state which starter a client should use, read the brief. File-based
content → this repo. WordPress editors → the WordPress starter.

**Stack (this repo):** static Astro, file-based YAML / Markdown, Tailwind CSS v4
(`@tailwindcss/vite`), CookieYes + analytics pack, Cloudflare Turnstile,
Cloudflare Pages. Product Lighthouse bar is **ADR-024: ≥80 mobile / ≥90 desktop**.

---

## Never describe shared state you have not just read

Before you say what is on a branch:

```
git fetch origin
git diff origin/<branch>..HEAD --stat
```

An instruction naming a commit is stale the moment it is sent. Say “rebase onto
the tip and check what is there”.

A runbook that misquotes `wrangler.toml` or `.env.example` is the same failure
as describing a branch you have not read. Read the file.

Cite a rule by **name**, not only its number — numbers move when sections are
inserted.

---

## After you push, verify the pushed tip

A green build in your working tree says nothing about what anyone else will get.

```
git fetch origin
npm ci && npm run build
```

`npm ci` requires the lockfile to match `package.json`.

---

## One file, one owner

The owner of a file is whoever has an open pull request touching it. No open PR
means it is unowned — take it. If you must touch a file you do not own, say so
in the same message.

Never let git splice two versions of a shared props interface. Take theirs
wholesale, then put your own additions back.

---

## Every gate states coverage and blind spots

`scripts/lint-build.mjs` and `scripts/machine-readable.mjs` print, on every run,
what they checked and what they cannot see.

**No CI gate in this repository renders a page in a browser.**
`scripts/lighthouse-audit.mjs` (`npm run lighthouse`) is a local report against
`astro preview`, not a merge blocker. ADR-024 is the product bar (≥80 mobile /
≥90 desktop). Do not claim a visual result you did not open.

A step that cannot run is NOT RUN. It never passes.

A throw in a component (Image refusing a missing alt) is enforcement, not a
gate. Do not restate it as an advisory check.

---

## Make it fail before you trust it

If you add a gate, break the thing it is for and watch it catch that. Confirm
the mutation landed (`git diff`) before you read the result.

---

## Production is never a side effect

- Never push to `main` on a client repo that has branch protection.
- Never deploy a client domain as a side effect of working in this template.
- Never enter a password, API token, or secret into chat. Report what is needed
  and who must set it.
- A test that writes to a production D1 database is worse than no test.

Setting `TURNSTILE_SECRET_KEY` on a Pages project does not reach the running
deployment. Variables are baked in at deploy time.

---

## Template hygiene

- Demo identity is Cedar & Pine Studio. It is marked `isPlaceholder: true`.
  Client repos must replace it.
- `wrangler.toml` ships `database_id = "00000000-0000-0000-0000-000000000000"`.
  Create a new D1 database per client.
- Dummy Turnstile keys in `.env.example` are Cloudflare’s documented test keys,
  not a secret.
- CookieYes / GTM / GA4 / Meta / Clarity / CallRail rows in `.env.example` stay
  **empty**. Components skip. Do not invent a live id.
- Do not port jirarpar orphan profiles, donation buttons, or live account IDs.

---

*Organix Media — astro-starter-static*
