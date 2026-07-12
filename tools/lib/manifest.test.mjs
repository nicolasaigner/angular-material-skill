import { test } from 'node:test';
import assert from 'node:assert/strict';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { mkdtemp, rm } from 'node:fs/promises';
import { hashContent, emptyManifest, readManifest, writeManifest, changedSources } from './manifest.mjs';

test('hashContent is deterministic and sensitive to change', () => {
  assert.equal(hashContent('abc'), hashContent('abc'));
  assert.notEqual(hashContent('abc'), hashContent('abd'));
  assert.equal(hashContent('abc').length, 16);
});

test('readManifest returns an empty manifest when the file does not exist', async () => {
  const m = await readManifest(join(tmpdir(), 'nao-existe-xyz.json'));
  assert.equal(m.generatedTag, null);
  assert.deepEqual(m.perFile, {});
});

test('write→read roundtrip preserves content', async () => {
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

test('changedSources detects new and modified entries, ignores unchanged ones', () => {
  const manifest = { ...emptyManifest(), perFile: { button: 'h1', table: 'h2' } };
  const current = { button: 'h1', table: 'h2-NOVO', dialog: 'h3' };
  assert.deepEqual(changedSources(manifest, current).sort(), ['dialog', 'table']);
});
