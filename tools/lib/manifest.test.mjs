import { test } from 'node:test';
import assert from 'node:assert/strict';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { mkdtemp, rm } from 'node:fs/promises';
import { hashContent, emptyManifest, readManifest, writeManifest, changedSources } from './manifest.mjs';

test('hashContent é determinístico e sensível a mudança', () => {
  assert.equal(hashContent('abc'), hashContent('abc'));
  assert.notEqual(hashContent('abc'), hashContent('abd'));
  assert.equal(hashContent('abc').length, 16);
});

test('readManifest devolve manifest vazio quando arquivo não existe', async () => {
  const m = await readManifest(join(tmpdir(), 'nao-existe-xyz.json'));
  assert.equal(m.generatedTag, null);
  assert.deepEqual(m.perFile, {});
});

test('write→read roundtrip preserva conteúdo', async () => {
  const dir = await mkdtemp(join(tmpdir(), 'ams-'));
  try {
    const path = join(dir, 'manifest.json');
    const m = { ...emptyManifest(), generatedTag: 'v1', perFile: { button: 'aaa' } };
    await writeManifest(path, m);
    const back = await readManifest(path);
    assert.deepEqual(back, m);
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
});

test('changedSources detecta novos e modificados, ignora iguais', () => {
  const manifest = { ...emptyManifest(), perFile: { button: 'h1', table: 'h2' } };
  const current = { button: 'h1', table: 'h2-NOVO', dialog: 'h3' };
  assert.deepEqual(changedSources(manifest, current).sort(), ['dialog', 'table']);
});
