import { test } from 'node:test';
import assert from 'node:assert/strict';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { mkdtemp, rm, readFile, readdir } from 'node:fs/promises';
import { runSync } from './sync.mjs';

const files = {
  'https://raw.githubusercontent.com/angular/components/v1/src/material/button/button.md':
    'Botões.\n<!-- example(button-overview) -->',
  'https://raw.githubusercontent.com/angular/components/v1/src/components-examples/material/button/button-overview/button-overview-example.ts':
    'export class ButtonOverviewExample {}',
};
const rawGet = async (url) => (url in files ? files[url] : null);
const sources = [
  { name: 'button', category: 'component', prosePath: 'src/material/button/button.md', examplesDir: 'src/components-examples/material/button' },
];

test('runSync gera reference, popula manifest e é idempotente', async () => {
  const dir = await mkdtemp(join(tmpdir(), 'ams-sync-'));
  try {
    const refsDir = dir;
    const manifestPath = join(dir, 'manifest.json');

    const first = await runSync({ tag: 'v1', sources, rawGet, refsDir, manifestPath });
    assert.deepEqual(first.changed, ['button']);
    assert.equal(first.total, 1);

    const md = await readFile(join(refsDir, 'button.md'), 'utf8');
    assert.match(md, /# Button/);
    assert.match(md, /export class ButtonOverviewExample/);

    const manifest = JSON.parse(await readFile(manifestPath, 'utf8'));
    assert.equal(manifest.generatedTag, 'v1');
    assert.ok(manifest.perFile.button);

    // segunda rodada na mesma tag → nada muda
    const second = await runSync({ tag: 'v1', sources, rawGet, refsDir, manifestPath });
    assert.deepEqual(second.changed, []);
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
});
