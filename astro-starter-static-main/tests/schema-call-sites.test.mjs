/**
 * Every Schema* component has a call site. Unused builders must not ship.
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readdir, readFile } from 'node:fs/promises';
import { join } from 'node:path';

const ROOT = new URL('../src/', import.meta.url).pathname;

async function walk(dir, suffix, found = []) {
  const entries = await readdir(dir, { withFileTypes: true });
  for (const entry of entries) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) await walk(path, suffix, found);
    else if (entry.name.endsWith(suffix)) found.push(path);
  }
  return found;
}

test('each schema component is imported from a page or layout', async () => {
  const schemas = await walk(join(ROOT, 'components/schema'), '.astro');
  const callers = [
    ...(await walk(join(ROOT, 'pages'), '.astro')),
    ...(await walk(join(ROOT, 'layouts'), '.astro')),
  ];
  const source = (await Promise.all(callers.map((file) => readFile(file, 'utf8')))).join('\n');

  assert.ok(schemas.length > 0);
  for (const file of schemas) {
    const name = file.split('/').pop().replace('.astro', '');
    assert.ok(source.includes(name), `${name} has no call site`);
  }
});
