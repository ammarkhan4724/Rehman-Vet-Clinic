/**
 * Lead capture — markup agrees with FORMS, and every form page ships the handler.
 *
 * Client half reads dist/. Run `npm run build` first. A stale dist/ makes this
 * suite lie.
 *
 * Blind spots: does not POST to a live Pages project; does not solve Turnstile
 * against production keys; does not write to a production D1 database.
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readdir, readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { parse } from 'node-html-parser';
import { FORMS } from '../functions/api/lead.js';

const DIST = new URL('../dist/', import.meta.url).pathname;

async function walkHtml(dir, found = []) {
  const entries = await readdir(dir, { withFileTypes: true });
  for (const entry of entries) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) await walkHtml(path, found);
    else if (entry.name.endsWith('.html')) found.push(path);
  }
  return found;
}

test('FORMS exports the contact and newsletter contracts', () => {
  assert.ok(FORMS.contact);
  assert.ok(FORMS.newsletter);
  assert.deepEqual(FORMS.contact.required, ['name', 'email', 'message']);
  assert.deepEqual(FORMS.newsletter.required, ['email']);
});

test('every built lead form matches FORMS and carries Turnstile + honeypot', async () => {
  const files = await walkHtml(DIST);
  assert.ok(files.length > 0, 'dist/ is empty — run npm run build first');

  let forms = 0;
  for (const file of files) {
    const document = parse(await readFile(file, 'utf8'));
    for (const form of document.querySelectorAll('form[data-lead-form]')) {
      forms += 1;
      const key = form.getAttribute('data-lead-form');
      assert.ok(FORMS[key], `${file}: unknown form key "${key}"`);
      assert.ok(form.querySelector('input[name="_hp"]'), `${file}: ${key} missing honeypot`);
      assert.ok(
        form.querySelector('.cf-turnstile[data-sitekey]'),
        `${file}: ${key} missing Turnstile widget`,
      );
      assert.equal(form.getAttribute('action'), '/api/lead');
      for (const field of FORMS[key].required) {
        assert.ok(
          form.querySelector(`[name="${field}"]`),
          `${file}: ${key} missing required field ${field}`,
        );
      }
    }
  }
  assert.ok(forms >= 2, `expected contact + newsletter, found ${forms}`);
});

test('lead form pages ship a script that talks to /api/lead', async () => {
  const files = await walkHtml(DIST);
  const withForm = [];
  for (const file of files) {
    const html = await readFile(file, 'utf8');
    if (html.includes('data-lead-form')) withForm.push(html);
  }
  assert.ok(withForm.length > 0);
  for (const html of withForm) {
    assert.match(html, /\/api\/lead/);
    assert.match(html, /data-lead-form/);
    assert.match(html, /cf-turnstile-response|_form/);
  }
});
