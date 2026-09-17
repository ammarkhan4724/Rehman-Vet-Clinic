# BeyondSEO crawl report

Seed: https://rehmanvetclinic.com/

Attempted 1 URLs; extracted 1 unique HTML documents; 0 URLs remain queued; 0 fetch/HTTP errors.

This is the discovered, scoped sample. It cannot establish that all site URLs were found. Canonical/robots observations do not prove indexing.

No supported access-denial or challenge signal was observed in this sample. This does not predict larger or later crawls.

Stop reasons: discovered_frontier_exhausted

Fetch elapsed time includes waits/retries and transfer. It is not TTFB or Core Web Vitals.

## Findings

| Severity | Finding | URL | Evidence | Action |
|---|---|---|---|---|
| low | missing_description | https://rehmanvetclinic.com/ | No nonempty meta description. | Add a useful page-specific summary where appropriate. |
| low | canonical_not_declared | https://rehmanvetclinic.com/ | No HTML canonical link. | Review URL variants; add a canonical when useful. HTTP Link canonicals are not parsed. |
| info | javascript_content | https://rehmanvetclinic.com/ | Initial main words: 0; rendered: 591. | Main content depends on rendering. Consider delivering essential text and metadata in initial HTML; indexing is not established by this observation. |

## Evidence files

pages.jsonl contains extraction, headers, timestamps and hashes. pages.csv is the page inventory; links.csv records observed edges and check status. robots.json, sitemaps.json, frontier.csv and crawl.sqlite3 preserve scope and recovery evidence.

## Not measured

search rankings, search volume, organic traffic, conversions, complete inbound backlink profile, Google-selected canonical, actual indexing, Core Web Vitals, structured-data semantic validity.
