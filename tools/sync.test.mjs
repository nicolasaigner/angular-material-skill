import { test } from 'node:test';
import assert from 'node:assert/strict';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { mkdtemp, rm, readFile, readdir } from 'node:fs/promises';
import { runSync, parseTag } from './sync.mjs';
import { readManifest } from './lib/manifest.mjs';

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

// Fix B: runSync deve criar o refsDir quando ele ainda não existe.
test('runSync cria refsDir quando ele não existe', async () => {
  const dir = await mkdtemp(join(tmpdir(), 'ams-sync-'));
  try {
    const refsDir = join(dir, 'does', 'not', 'exist', 'references');
    const manifestPath = join(dir, 'manifest.json');

    const result = await runSync({ tag: 'v1', sources, rawGet, refsDir, manifestPath });
    assert.deepEqual(result.changed, ['button']);

    const md = await readFile(join(refsDir, 'button.md'), 'utf8');
    assert.match(md, /# Button/);
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
});

// Fix E: parseTag deve ser puro, testável e aceitar forma posicional (npm 11 mangla --to).
test('parseTag aceita --to <tag>', () => {
  assert.equal(parseTag(['--to', '21.0.2']), '21.0.2');
});

test('parseTag aceita tag posicional', () => {
  assert.equal(parseTag(['21.0.2']), '21.0.2');
});

test('parseTag retorna null sem argumentos', () => {
  assert.equal(parseTag([]), null);
});

// Fix 2: um run todo-404 (nada buscado) não deve gravar a tag no manifest.
test('runSync não grava generatedTag quando nada foi buscado (all-404)', async () => {
  const dir = await mkdtemp(join(tmpdir(), 'ams-sync-'));
  try {
    const refsDir = join(dir, 'references');
    const manifestPath = join(dir, 'manifest.json');
    const allNotFoundRawGet = async () => null;

    const result = await runSync({ tag: 'v1', sources, rawGet: allNotFoundRawGet, refsDir, manifestPath });
    assert.deepEqual(result.changed, []);
    assert.equal(result.total, 0);

    const manifest = await readManifest(manifestPath);
    assert.equal(manifest.generatedTag, null);

    await assert.rejects(readdir(refsDir));
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
});
