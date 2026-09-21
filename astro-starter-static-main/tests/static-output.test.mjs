/**
 * The site stays static. SSR / request-time routes are a hard fail.
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile, readdir } from 'node:fs/promises';
import { join } from 'node:path';

const ROOT = new URL('..', import.meta.url).pathname;

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

test('astro.config.mjs is output: static and has no adapter', async () => {
  const source = await readFile(join(ROOT, 'astro.config.mjs'), 'utf8');
  assert.match(source, /output:\s*'static'/);
  assert.doesNotMatch(source, /adapter:/);
  assert.doesNotMatch(source, /prerender\s*=\s*false/);
});

test('no page sets prerender = false', async () => {
  const files = await walk(join(ROOT, 'src'), '.astro');
  for (const file of files) {
    const source = await readFile(file, 'utf8');
    assert.doesNotMatch(source, /prerender\s*=\s*false/, file);
    assert.doesNotMatch(source, /Astro\.locals\.runtime/, file);
  }
});

test('.env.example ships dummy Turnstile keys only', async () => {
  const source = await readFile(join(ROOT, '.env.example'), 'utf8');
  assert.match(source, /TURNSTILE_SITE_KEY=1x00000000000000000000AA/);
  assert.match(source, /TURNSTILE_SECRET_KEY=1x0000000000000000000000000000000AA/);
  assert.doesNotMatch(source, /0x[0-9A-Za-z]{10,}/);
});

test('.env.example documents consent + tracking vars as empty placeholders', async () => {
  const source = await readFile(join(ROOT, '.env.example'), 'utf8');
  for (const name of [
    'COOKIEYES_SITE_KEY',
    'GTM_CONTAINER_ID',
    'GA4_MEASUREMENT_ID',
    'META_PIXEL_ID',
    'MS_CLARITY_PROJECT_ID',
    'CALLRAIL_ACCOUNT_ID',
    'CALLRAIL_SWAP_KEY',
  ]) {
    assert.match(source, new RegExp(`^${name}=$`, 'm'), `${name} must be present and empty`);
  }
  assert.doesNotMatch(source, /^GTM_CONTAINER_ID=GTM-/m);
  assert.doesNotMatch(source, /^GA4_MEASUREMENT_ID=G-/m);
});

test('wrangler.toml does not ship a production D1 id', async () => {
  const source = await readFile(join(ROOT, 'wrangler.toml'), 'utf8');
  assert.match(source, /00000000-0000-0000-0000-000000000000/);
  assert.doesNotMatch(source, /1ded64e1-e4db-460e-9774-c00db7c6267e/);
  assert.doesNotMatch(source, /8287c13fa2b7a836fa4832a5ec3f3a97/);
});
