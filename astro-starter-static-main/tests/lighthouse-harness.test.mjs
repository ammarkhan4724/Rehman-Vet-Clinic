/**
 * The Lighthouse harness is present, ADR-024 is the stated bar, and
 * exemptions carry reasons. This does not run Chrome.
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';

const ROOT = new URL('..', import.meta.url).pathname;

async function read(relative) {
  return readFile(join(ROOT, relative), 'utf8');
}

test('package.json exposes npm run lighthouse', async () => {
  const pkg = JSON.parse(await read('package.json'));
  assert.equal(pkg.scripts.lighthouse, 'node scripts/lighthouse-audit.mjs');
});

test('lighthouse-audit.mjs uses ADR-024 floors (80 mobile / 90 desktop)', async () => {
  const source = await read('scripts/lighthouse-audit.mjs');
  assert.match(source, /ADR-024/);
  assert.match(source, /const TARGETS = \{ mobile: 80, desktop: 90 \}/);
  assert.doesNotMatch(source, /mobile:\s*95/);
  assert.doesNotMatch(source, /desktop:\s*95/);
  assert.match(source, /walked from dist/);
  assert.match(source, /does not gate CI|not a CI gate/);
});

test('lighthouse exemptions name a reason and only cover the starter 404 SEO case', async () => {
  const source = await read('scripts/lighthouse-audit.mjs');
  assert.match(source, /'\/404\.html':/);
  assert.match(source, /noindex on an error document/);
  assert.doesNotMatch(source, /86bbutyr5|orphans|qurbani|_legacy/);
  const page404 = await read('src/pages/404.astro');
  assert.match(page404, /noindex=\{true\}/);
});

test('docs state ADR-024 as the product bar, not a fake 95', async () => {
  const files = ['README.md', 'LAUNCH-CHECKS.md', 'AGENTS.md', 'CLAUDE.md'];
  for (const file of files) {
    const text = await read(file);
    assert.match(text, /ADR-024/, `${file} must name ADR-024`);
    assert.match(text, /80/, `${file} must mention the mobile floor`);
    assert.match(text, /90/, `${file} must mention the desktop floor`);
    assert.doesNotMatch(
      text,
      /mobile 95\+|Lighthouse CI \(mobile 95|≥ 95|>= 95|bar of 95/,
      `${file} still claims 95 as the product bar`,
    );
  }
});
