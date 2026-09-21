/**
 * Consent + tracking are wired, and unset keys emit nothing.
 *
 * Dist checks need `npm run build` first (CI runs build:fast before test).
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile, readdir, access } from 'node:fs/promises';
import { join } from 'node:path';

const ROOT = new URL('..', import.meta.url).pathname;
const DIST = join(ROOT, 'dist');

const TRACKER_HOSTS = [
  'cdn-cookieyes.com',
  'www.googletagmanager.com',
  'connect.facebook.net',
  'www.facebook.com/tr',
  'www.clarity.ms',
  'cdn.callrail.com',
];

const COMPONENTS = [
  'CookieYes.astro',
  'analytics/ConsentDefaults.astro',
  'analytics/GoogleTagManager.astro',
  'analytics/GA4.astro',
  'analytics/FacebookPixel.astro',
  'analytics/MicrosoftClarity.astro',
  'analytics/CallRail.astro',
];

async function walk(dir, suffix, found = []) {
  const entries = await readdir(dir, { withFileTypes: true });
  for (const entry of entries) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name === 'node_modules' || entry.name === 'dist' || entry.name === '.git') continue;
      await walk(path, suffix, found);
    } else if (entry.name.endsWith(suffix)) found.push(path);
  }
  return found;
}

async function distExists() {
  try {
    await access(DIST);
    return true;
  } catch {
    return false;
  }
}

test('BaseLayout imports CookieYes and every analytics component', async () => {
  const layout = await readFile(join(ROOT, 'src/layouts/BaseLayout.astro'), 'utf8');
  assert.match(layout, /import CookieYes from '~\/components\/CookieYes\.astro'/);
  assert.match(layout, /import ConsentDefaults from '~\/components\/analytics\/ConsentDefaults\.astro'/);
  assert.match(layout, /import GoogleTagManager from '~\/components\/analytics\/GoogleTagManager\.astro'/);
  assert.match(layout, /import GA4 from '~\/components\/analytics\/GA4\.astro'/);
  assert.match(layout, /import FacebookPixel from '~\/components\/analytics\/FacebookPixel\.astro'/);
  assert.match(layout, /import MicrosoftClarity from '~\/components\/analytics\/MicrosoftClarity\.astro'/);
  assert.match(layout, /import CallRail from '~\/components\/analytics\/CallRail\.astro'/);
  assert.match(layout, /<CookieYes \/>/);
  assert.match(layout, /<ConsentDefaults \/>/);
  assert.match(layout, /<GoogleTagManager position="body" \/>/);
  assert.match(layout, /<CallRail \/>/);
});

test('analytics components exist and env-gate themselves', async () => {
  for (const relative of COMPONENTS) {
    const source = await readFile(join(ROOT, 'src/components', relative), 'utf8');
    assert.match(source, /import\.meta\.env\./, `${relative} must read an env var`);
  }
});

test('package.json does not install Partytown', async () => {
  const pkg = JSON.parse(await readFile(join(ROOT, 'package.json'), 'utf8'));
  const deps = { ...pkg.dependencies, ...pkg.devDependencies };
  assert.equal(deps['@astrojs/partytown'], undefined);
});

test('CSP already allows CookieYes and the tracking pack', async () => {
  const headers = await readFile(join(ROOT, 'public/_headers'), 'utf8');
  assert.match(headers, /cdn-cookieyes\.com/);
  assert.match(headers, /log\.cookieyes\.com/);
  assert.match(headers, /www\.googletagmanager\.com/);
  assert.match(headers, /connect\.facebook\.net/);
  assert.match(headers, /clarity\.ms/);
  assert.match(headers, /\*\.callrail\.com/);
});

test('demo dist emits no tracker hosts when keys are unset', async () => {
  if (!(await distExists())) {
    assert.fail('dist/ missing — run npm run build (or build:fast) before this test');
  }
  const htmlFiles = await walk(DIST, '.html');
  assert.ok(htmlFiles.length > 0, 'dist/ has no HTML');
  for (const file of htmlFiles) {
    const html = await readFile(file, 'utf8');
    for (const host of TRACKER_HOSTS) {
      assert.doesNotMatch(html, new RegExp(host.replace(/\./g, '\\.')), `${file} leaked ${host}`);
    }
    assert.doesNotMatch(html, /gtag\('consent'/);
    assert.doesNotMatch(html, /id="cookieyes"/);
  }
});
