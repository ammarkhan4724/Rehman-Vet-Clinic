/**
 * Compose the CI job result. A step that did not run is never a pass.
 */
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';

const dir = process.argv[2] || 'ci-logs';
const status = await readFile(join(dir, 'status.tsv'), 'utf8');
const rows = status
  .trim()
  .split('\n')
  .map((line) => line.split('\t'))
  .filter((cols) => cols.length === 2);

let failed = false;
console.log('## Gate summary\n');
for (const [name, outcome] of rows) {
  const ok = outcome === 'success';
  if (!ok) failed = true;
  console.log(`- ${ok ? 'PASS' : 'FAIL'} ${name} (${outcome})`);
}

if (failed) {
  console.error('\nA gate failed or did not run. Not-run is never a pass.');
  process.exit(1);
}

console.log('\nAll gates passed.');
