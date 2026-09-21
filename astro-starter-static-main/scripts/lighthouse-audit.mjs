/**
 * lighthouse-audit.mjs — Lighthouse, every built HTML route, one form factor per run.
 *
 * Ported from Organix-Media/jirarpar and trimmed to this starter's demo routes.
 * Charity-specific exemptions (unpublished blog, /ai HTML machine views) are
 * not copied. Walk dist/ so a page added tomorrow is audited tomorrow.
 *
 * Run against the BUILT output served locally, never the dev server and never
 * a live client domain:
 *
 *   npm run build
 *   npx astro preview --port 4331 --host 127.0.0.1
 *   npm run lighthouse -- --origin http://127.0.0.1:4331
 *   npm run lighthouse -- --origin http://127.0.0.1:4331 --form-factor desktop
 *
 * Thresholds are ADR-024 in organix-mdm (2026-09-04, superseding ADR-008):
 * every category at or above 80 on mobile and 90 on desktop. Both are floors.
 * Desktop is a separate run because Lighthouse's desktop preset changes
 * emulation and throttling, not just the viewport.
 *
 * This script reports. It does not gate CI. Exit status is 0 either way
 * (same as jirarpar): Chrome/temp-profile teardown can raise after a report
 * is written, and a 1–3 point swing is noise. Read the table.
 *
 * lighthouse@12 is not a package.json dependency (~50 MB, launch-check only).
 * Prefer a local copy (`npm install --no-save --no-package-lock lighthouse@12`)
 * so a sweep does not re-resolve the registry on every route; otherwise the
 * script falls back to `npx --yes lighthouse@12`.
 *
 * Reports land in .lighthouse/<form-factor>/ (gitignored).
 */
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const CATEGORIES = ['performance', 'accessibility', 'best-practices', 'seo'];

/** ADR-024: the floor per form factor, all four categories. */
const TARGETS = { mobile: 80, desktop: 90 };

const args = process.argv.slice(2);
const origin = valueOf('--origin') ?? 'http://127.0.0.1:4331';
const formFactor = valueOf('--form-factor') ?? 'mobile';
if (!(formFactor in TARGETS)) {
  console.error(`--form-factor must be mobile or desktop, got "${formFactor}"`);
  process.exit(2);
}
const TARGET = TARGETS[formFactor];
const outDir = path.join(valueOf('--out') ?? '.lighthouse', formFactor);
const only = valueOf('--only');
const reuse = args.includes('--reuse');

/**
 * Routes that cannot meet a category by design. Recorded so the report marks
 * them EXEMPT rather than as findings. Every entry names its reason and the
 * whole list is printed on every run.
 *
 * Starter-only: the demo blog is indexable (unlike jirarpar's unpublished
 * blog). Machine views here are text (`/ai/*.txt`), not HTML, so they never
 * enter this walk — do not copy jirarpar's `/ai/*` SEO exemption unless a
 * client later serves HTML machine views.
 */
const EXCEPTIONS = {
  '/404.html': {
    seo: 'noindex on an error document is correct; Lighthouse is-crawlable cannot pass and should not',
  },
};

/** Exact route, or a `/prefix/*` entry covering every route under it. */
const exempt = (route, category) =>
  Boolean(
    EXCEPTIONS[route]?.[category] ||
      Object.entries(EXCEPTIONS).some(
        ([key, cats]) => key.endsWith('/*') && route.startsWith(key.slice(0, -1)) && cats[category],
      ),
  );

function valueOf(flag) {
  const i = args.indexOf(flag);
  return i === -1 ? undefined : args[i + 1];
}

/** Every .html in dist, as the URL path the preview server answers on. */
function routes(dir = 'dist', prefix = '') {
  if (!fs.existsSync(dir)) {
    console.error('dist/ missing — run npm run build before lighthouse');
    process.exit(2);
  }
  const found = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      found.push(...routes(full, `${prefix}${entry.name}/`));
    } else if (entry.name === 'index.html') {
      found.push(`/${prefix}`);
    } else if (entry.name.endsWith('.html')) {
      // 404.html has no index.html. Walking for index.html alone silently
      // omits it — the exact miscount AGENTS.md calls out.
      found.push(`/${prefix}${entry.name}`);
    }
  }
  return found;
}

const all = routes().sort();
const list = only ? all.filter((r) => r.includes(only)) : all;

fs.mkdirSync(outDir, { recursive: true });

const slug = (route) =>
  route === '/' ? 'root' : route.replace(/^\/|\/$/g, '').replace(/[\/.]/g, '-');

const LOCAL_CLI = 'node_modules/lighthouse/cli/index.js';
const LIGHTHOUSE = fs.existsSync(LOCAL_CLI)
  ? `"${process.execPath}" ${LOCAL_CLI}`
  : 'npx --yes lighthouse@12';

const rows = [];

for (const [i, route] of list.entries()) {
  const file = path.join(outDir, `${slug(route)}.json`);
  if (!(reuse && fs.existsSync(file))) {
    process.stderr.write(`[${i + 1}/${list.length}] ${route}\n`);
    spawnSync(
      [
        LIGHTHOUSE,
        `"${origin + route}"`,
        '--output=json',
        `--output-path="${file}"`,
        '--quiet',
        '--chrome-flags="--headless=new --no-sandbox --disable-gpu"',
        ...(formFactor === 'desktop' ? ['--preset=desktop'] : ['--form-factor=mobile', '--screenEmulation.mobile']),
        '--throttling-method=simulate',
        `--only-categories=${CATEGORIES.join(',')}`,
      ].join(' '),
      { stdio: ['ignore', 'ignore', 'inherit'], shell: true },
    );
  }
  if (!fs.existsSync(file)) {
    rows.push({ route, error: 'NOT RUN — no report written' });
    continue;
  }
  const report = JSON.parse(fs.readFileSync(file, 'utf8'));
  if (report.runtimeError) {
    rows.push({ route, error: `NOT RUN — ${report.runtimeError.code}` });
    continue;
  }
  const scores = {};
  const failing = {};
  for (const key of CATEGORIES) {
    const category = report.categories[key];
    scores[key] = category?.score == null ? null : Math.round(category.score * 100);
    failing[key] = (category?.auditRefs ?? [])
      .filter((ref) => ref.weight > 0)
      .map((ref) => ({ id: ref.id, weight: ref.weight, audit: report.audits[ref.id] }))
      .filter((x) => x.audit && x.audit.score !== null && x.audit.score < 1)
      .map((x) => `${x.id}(w${x.weight})`);
  }
  rows.push({ route, scores, failing, version: report.lighthouseVersion });
}

const pad = (s, n) => String(s).padEnd(n);
const head = ['route', ...CATEGORIES.map((c) => c.slice(0, 4))];
console.log('');
console.log(`${pad(head[0], 22)} ${head.slice(1).map((h) => pad(h, 5)).join(' ')}`);
console.log('-'.repeat(22 + 4 * 6));

let passed = 0;
for (const row of rows) {
  if (row.error) {
    console.log(`${pad(row.route, 22)} ${row.error}`);
    continue;
  }
  const cells = CATEGORIES.map((c) => {
    const v = row.scores[c];
    if (v === null) return pad('n/a', 5);
    const mark = v >= TARGET ? ' ' : exempt(row.route, c) ? 'x' : '!';
    return pad(v + mark, 5);
  });
  console.log(`${pad(row.route, 22)} ${cells.join(' ')}`);
  if (CATEGORIES.every((c) => (row.scores[c] ?? 0) >= TARGET || exempt(row.route, c))) passed += 1;
}

console.log('');
const exemptions = Object.entries(EXCEPTIONS).flatMap(([route, cats]) =>
  Object.entries(cats).map(([c, why]) => ({ route, c, why })),
);
console.log(`RESULT   ${passed}/${rows.length} routes at >= ${TARGET} in all four categories (${formFactor}, ADR-024)`);
console.log(`COVERAGE ${list.length}/${all.length} routes in dist/ audited` + (only ? ` (--only ${only})` : ''));
console.log(`         route list walked from dist/, not written down`);
console.log(`         lighthouse ${rows.find((r) => r.version)?.version ?? '?'}, ${formFactor} emulation, simulated throttling`);
console.log(`EXEMPT   ${exemptions.length} route/category pair(s) approved as unable to meet the bar by design ('x' above):`);
for (const e of exemptions) console.log(`         ${pad(e.route, 14)} ${pad(e.c, 5)} ${e.why}`);
console.log('');
console.log('BLIND SPOTS — true on a green run as well as a red one:');
console.log('  - Served from 127.0.0.1. No TLS handshake, no CDN, no real RTT,');
console.log('    no Cloudflare cache. Production performance is not this number.');
console.log('  - Simulated throttling models one device class. Lantern estimates');
console.log('    LCP/TBT from a trace; it does not measure a real slow phone.');
console.log('  - One run per route, unaveraged. Performance moves a few points');
console.log('    run to run on the same commit; a 1-3 point gap is noise.');
console.log('  - Only the four scored categories are read. PWA and any unscored');
console.log('    audit is invisible here.');
console.log('  - Static HTML only. Text machine views (/ai/*.txt, llms.txt) are');
console.log('    not in this walk. Nothing behind a form submit, a JS-rendered');
console.log('    state, or a Pages Function (functions/) is ever loaded.');
console.log('  - Accessibility is axe-core: automated checks only. It cannot see');
console.log('    a wrong reading order, an unclear label, or a keyboard trap.');
console.log('  - Scores are rounded. 79.5 prints as 80 and passes this report.');
console.log('  - Exemptions are a list somebody approved once. The page a listed');
console.log('    exemption covers can change under it; the list does not notice.');
console.log(`  - One form factor per run. This was ${formFactor}; the other bar is not tested here.`);
console.log('  - This is a report, not a CI gate. CI does not run Chrome.');

const failed = rows.filter((r) => r.error || CATEGORIES.some((c) => (r.scores?.[c] ?? 0) < TARGET && !exempt(r.route, c)));
if (failed.length) {
  console.log('');
  console.log('FAILING AUDITS on routes below target (id and its weight in that category):');
  for (const row of failed) {
    if (row.error) continue;
    for (const c of CATEGORIES) {
      if ((row.scores[c] ?? 0) >= TARGET || exempt(row.route, c)) continue;
      console.log(`  ${pad(row.route, 20)} ${pad(c, 15)} ${row.failing[c].join(' ') || '(score is metric-driven, no failing audit)'}`);
    }
  }
}
