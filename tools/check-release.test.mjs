import { test } from 'node:test';
import assert from 'node:assert/strict';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { mkdtemp, rm, writeFile } from 'node:fs/promises';
import { checkRelease } from './check-release.mjs';

async function withManifest(tag, fn) {
  const dir = await mkdtemp(join(tmpdir(), 'ams-chk-'));
  try {
    const path = join(dir, 'manifest.json');
    await writeFile(path, JSON.stringify({ upstreamRepo: 'angular/components', generatedTag: tag, perFile: {} }));
    return await fn(path);
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
}

test('behind=true quando a tag latest difere da gerada', async () => {
  await withManifest('18.2.0', async (path) => {
    const apiGet = async () => ({ tag_name: '18.3.0' });
    const r = await checkRelease({ manifestPath: path, apiGet });
    assert.equal(r.current, '18.2.0');
    assert.equal(r.latest, '18.3.0');
    assert.equal(r.behind, true);
  });
});

test('behind=false quando as tags coincidem', async () => {
  await withManifest('18.3.0', async (path) => {
    const apiGet = async () => ({ tag_name: '18.3.0' });
    const r = await checkRelease({ manifestPath: path, apiGet });
    assert.equal(r.behind, false);
  });
});

import { buildApiHeaders, formatActionsOutput } from './check-release.mjs';

test('buildApiHeaders inclui Authorization só quando há GITHUB_TOKEN', () => {
  const semToken = buildApiHeaders({});
  assert.equal(semToken.Authorization, undefined);
  assert.match(semToken.Accept, /vnd\.github/);
  const comToken = buildApiHeaders({ GITHUB_TOKEN: 'abc' });
  assert.equal(comToken.Authorization, 'Bearer abc');
});

test('formatActionsOutput serializa latest e behind para o GITHUB_OUTPUT', () => {
  assert.equal(formatActionsOutput({ latest: '21.1.0', behind: true }), 'latest=21.1.0\nbehind=true\n');
  assert.equal(formatActionsOutput({ latest: '21.0.2', behind: false }), 'latest=21.0.2\nbehind=false\n');
});
