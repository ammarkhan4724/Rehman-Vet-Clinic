# BeyondSEO crawl report

Seed: https://roundlakeanimalhospital.com.pk/

Attempted 1 URLs; extracted 1 unique HTML documents; 55 URLs remain queued; 0 fetch/HTTP errors.

This is the discovered, scoped sample. It cannot establish that all site URLs were found. Canonical/robots observations do not prove indexing.

Some requests or rendering were incomplete; blocking is not established from those observations alone.

Stop reasons: configured_page_limit

Fetch elapsed time includes waits/retries and transfer. It is not TTFB or Core Web Vitals.

## Findings

| Severity | Finding | URL | Evidence | Action |
|---|---|---|---|---|
| medium | capture_incomplete | https://roundlakeanimalhospital.com.pk/ | Browser error: TimeoutError: Page.goto: Timeout 17437ms exceeded. Call log:   - navigating to "https://roundlakeanimalhospital.com.pk/", waiting until "domcontentloaded" ; Browser javascript_errors: ['wp is not defined'] | Inspect access and browser evidence, then recapture this URL before assessing missing content. |
| medium | render_failed | https://roundlakeanimalhospital.com.pk/ | TimeoutError: Page.goto: Timeout 17437ms exceeded. Call log:   - navigating to "https://roundlakeanimalhospital.com.pk/", waiting until "domcontentloaded"  | Inspect the local browser failure; raw HTML findings remain available. |

## Evidence files

pages.jsonl contains extraction, headers, timestamps and hashes. pages.csv is the page inventory; links.csv records observed edges and check status. robots.json, sitemaps.json, frontier.csv and crawl.sqlite3 preserve scope and recovery evidence.

## Not measured

search rankings, search volume, organic traffic, conversions, complete inbound backlink profile, Google-selected canonical, actual indexing, Core Web Vitals, structured-data semantic validity.
