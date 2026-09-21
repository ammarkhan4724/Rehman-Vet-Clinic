/**
 * lint-build — transferable quality gate over dist/.
 *
 * Coverage: every built *.html file.
 * Blind spots: does not render a page; does not run Lighthouse; does not
 * execute Pages Functions; cannot see a visual regression.
 *
 * Failures stop the build. A green run still prints what it did not cover.
 */
import { readdir, readFile } from 'node:fs/promises';
import { join, relative } from 'node:path';
import { parse } from 'node-html-parser';

const DIST = new URL('../dist/', import.meta.url);
const SRC = new URL('../src/', import.meta.url);

const failures = [];
const notes = [];

async function walk(dir, suffix, found = []) {
  const entries = await readdir(dir, { withFileTypes: true });
  for (const entry of entries) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) await walk(path, suffix, found);
    else if (entry.name.endsWith(suffix)) found.push(path);
  }
  return found;
}

function headingLevels(document) {
  return [...document.querySelectorAll('h1,h2,h3,h4,h5,h6')].map((node) =>
    Number(node.tagName.slice(1)),
  );
}

function checkHeadings(file, document) {
  const levels = headingLevels(document);
  const h1 = levels.filter((level) => level === 1);
  if (h1.length !== 1) {
    failures.push(`${file}: expected exactly one h1, found ${h1.length}`);
  }
  for (let i = 1; i < levels.length; i += 1) {
    if (levels[i] > levels[i - 1] + 1) {
      failures.push(`${file}: heading skip h${levels[i - 1]} → h${levels[i]}`);
    }
  }
}

function checkImages(file, document) {
  for (const img of document.querySelectorAll('img')) {
    if (!img.hasAttribute('alt')) {
      failures.push(`${file}: <img src="${img.getAttribute('src') || ''}"> missing alt`);
    }
  }
}

function checkSeo(file, document) {
  const title = document.querySelector('title')?.text?.trim();
  if (!title) failures.push(`${file}: missing <title>`);

  const robots = document.querySelector('meta[name="robots"]')?.getAttribute('content') || '';
  const noindex = /noindex/i.test(robots);
  const description = document.querySelector('meta[name="description"]');
  const canonical = document.querySelector('link[rel="canonical"]');

  if (!description && !noindex) failures.push(`${file}: missing meta description`);
  if (!noindex && !canonical) failures.push(`${file}: missing canonical`);
  if (noindex && canonical) failures.push(`${file}: noindex page must not advertise a canonical`);
}

function checkSchema(file, document) {
  const blocks = document.querySelectorAll('script[type="application/ld+json"]');
  if (blocks.length === 0) {
    failures.push(`${file}: no JSON-LD schema`);
    return;
  }
  for (const block of blocks) {
    try {
      JSON.parse(block.text);
    } catch {
      failures.push(`${file}: invalid JSON-LD`);
    }
  }
}

function checkForms(file, document) {
  for (const form of document.querySelectorAll('form[data-lead-form]')) {
    const key = form.getAttribute('data-lead-form');
    if (!form.querySelector('input[name="_hp"]')) {
      failures.push(`${file}: lead form "${key}" missing honeypot`);
    }
    if (!form.querySelector('.cf-turnstile, [data-sitekey]')) {
      failures.push(`${file}: lead form "${key}" missing Turnstile widget`);
    }
    if ((form.getAttribute('action') || '') !== '/api/lead') {
      failures.push(`${file}: lead form "${key}" action must be /api/lead`);
    }
  }
}

function checkHandler(htmlFiles, documents) {
  const formPages = htmlFiles.filter((_, i) => documents[i].querySelector('form[data-lead-form]'));
  if (formPages.length === 0) {
    failures.push('no lead forms found in dist/');
    return;
  }
  for (const [i, file] of htmlFiles.entries()) {
    if (!formPages.includes(file)) continue;
    const html = documents[i].toString();
    if (!html.includes('data-lead-form') || !html.includes('/api/lead')) {
      failures.push(`${file}: lead form page does not reference /api/lead`);
    }
  }
  notes.push(`lead forms: ${formPages.length} page(s) carry data-lead-form`);
}

async function checkSchemaCallSites() {
  const schemaFiles = await walk(new URL('components/schema/', SRC).pathname, '.astro');
  const callers = [
    ...(await walk(new URL('pages/', SRC).pathname, '.astro')),
    ...(await walk(new URL('layouts/', SRC).pathname, '.astro')),
  ];
  const callerSource = (await Promise.all(callers.map((file) => readFile(file, 'utf8')))).join('\n');

  for (const file of schemaFiles) {
    const name = file.split('/').pop().replace('.astro', '');
    if (!callerSource.includes(name)) {
      failures.push(`unused schema builder: ${relative(process.cwd(), file)} has no call site`);
    }
  }
}

const htmlFiles = await walk(DIST.pathname, '.html');
if (htmlFiles.length === 0) {
  console.error('lint-build: dist/ has no HTML. Run astro build first.');
  process.exit(1);
}

const documents = [];
for (const file of htmlFiles) {
  const html = await readFile(file, 'utf8');
  const document = parse(html);
  documents.push(document);
  const rel = relative(new URL('..', DIST).pathname, file);
  checkHeadings(rel, document);
  checkImages(rel, document);
  checkSeo(rel, document);
  checkSchema(rel, document);
  checkForms(rel, document);
}

checkHandler(htmlFiles.map((file) => relative(new URL('..', DIST).pathname, file)), documents);
await checkSchemaCallSites();

const indexable = documents.filter(
  (doc) => !/noindex/i.test(doc.querySelector('meta[name="robots"]')?.getAttribute('content') || ''),
);

console.log(`lint-build: ${htmlFiles.length} HTML files, ${indexable.length} indexable`);
console.log(`coverage: ${htmlFiles.length}/${htmlFiles.length} HTML pages checked`);
console.log('blind spots: no browser render; no Lighthouse; Functions not executed');
for (const note of notes) console.log(note);

if (failures.length) {
  console.error('\nFAIL');
  for (const failure of failures) console.error(`  - ${failure}`);
  process.exit(1);
}

console.log('PASS');
