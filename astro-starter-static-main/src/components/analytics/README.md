# Analytics components

Self-contained, env-gated trackers. Each component renders **nothing** when
its env var is unset — the demo site and CI stay clean.

Ported from `Organix-Media/astro-starter-wordpress` (`src/components/analytics/`,
CookieYes, BaseLayout wiring, ADR-014). CallRail is a real component here;
the WP starter documents it in BaseLayout but does not currently emit
`swap.js` from `src/`.

## Loading strategy

| Tracker | Strategy | Consent gate |
|---|---|---|
| **GoogleTagManager** | Native, async, main-thread | Google Consent Mode v2 (`ConsentDefaults.astro`) |
| **GA4** (standalone, only without GTM) | Native, async, main-thread | Google Consent Mode v2 |
| **FacebookPixel** | Native, CookieYes auto-blocker | `data-cookieyes="cookieyes-advertisement"` |
| **MicrosoftClarity** | Native, CookieYes auto-blocker | `data-cookieyes="cookieyes-analytics"` |
| **CallRail** | Native, `defer`, main-thread | Always on (essential — phone tracking) |
| **CookieYes** | Native, early in `<head>` | Always on (necessary) |

No Partytown. The WP starter still lists `@astrojs/partytown` in
`package.json` but ADR-014 loads trackers natively; this starter matches
that decision and does not install the package.

## Env vars

Build-time only — baked into static HTML. Tracking IDs are public
(visible in DevTools). Never commit a real client id in this template.

| Variable | Format | Required? |
|---|---|---|
| `COOKIEYES_SITE_KEY` | CookieYes site key | optional (no banner when unset) |
| `GTM_CONTAINER_ID` | `GTM-XXXXXXX` | optional |
| `GA4_MEASUREMENT_ID` | `G-XXXXXXXXXX` | optional (use this **or** GTM, not both) |
| `META_PIXEL_ID` | numeric | optional |
| `MS_CLARITY_PROJECT_ID` | 10-char alphanumeric | optional |
| `CALLRAIL_ACCOUNT_ID` | company id in the swap.js path | optional |
| `CALLRAIL_SWAP_KEY` | per-company snippet key | optional (completes the dashboard URL) |

If GTM is configured, add GA4 **inside** the GTM container. Do not set
both env vars.

## Future Partytown migration (only if field metrics justify it)

Same seam as the WP starter: install `@astrojs/partytown`, forward
`dataLayer.push` / `gtag` / `fbq` / `clarity`, change the relevant
`<script>` tags to `type="text/partytown"`. **Do not migrate CallRail.**
