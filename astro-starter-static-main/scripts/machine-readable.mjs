/**
 * machine-readable — confirm the crawler / agent files exist in dist/.
 *
 * Denominator: URLs in dist/sitemap.xml. A page added to the site is required
 * here on the next build; a noindex page is not in the sitemap and is not
 * required to have a mirror.
 *
 * Blind spots: does not fetch the live host; does not judge copy quality.
 */
import { readFile, access } from 'node:fs/promises';
import { join } from 'node:path';

const DIST = new URL('../dist/', import.meta.url).pathname;

const required = ['robots.txt', 'sitemap.xml', 'sitemap.md', 'llms.txt', 'agents.md', 'ai/index.txt'];
const missing = [];

for (const file of required) {
  try {
    await access(join(DIST, file));
  } catch {
    missing.push(file);
  }
}

const sitemap = await readFile(join(DIST, 'sitemap.xml'), 'utf8').catch(() => '');
const locs = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]);

function slugFor(loc) {
  const url = new URL(loc);
  if (url.pathname === '/') return 'home';
  return url.pathname.replace(/^\/|\/$/g, '').replace(/\//g, '-');
}

const missingMirrors = [];
for (const loc of locs) {
  const slug = slugFor(loc);
  try {
    await access(join(DIST, 'ai', `${slug}.txt`));
  } catch {
    missingMirrors.push(slug);
  }
}

console.log(`machine-readable: ${required.length} root files, ${locs.length} sitemap URLs`);
console.log(`coverage: ${locs.length - missingMirrors.length}/${locs.length} mirrors`);
console.log('blind spots: does not fetch production; does not score content');

if (missing.length || missingMirrors.length) {
  console.error('FAIL');
  for (const file of missing) console.error(`  missing ${file}`);
  for (const slug of missingMirrors) console.error(`  missing ai/${slug}.txt`);
  process.exit(1);
}

console.log('PASS');
