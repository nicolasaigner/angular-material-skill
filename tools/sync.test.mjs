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

test('runSync generates the reference, populates the manifest, and is idempotent', async () => {
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

    // second run on the same tag → nothing changes
    const second = await runSync({ tag: 'v1', sources, rawGet, refsDir, manifestPath });
    assert.deepEqual(second.changed, []);
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
});

// Fix B: runSync must create refsDir when it does not exist yet.
test('runSync creates refsDir when it does not exist', async () => {
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

// Fix E: parseTag must be pure, testable, and accept the positional form (npm 11 mangles --to).
test('parseTag accepts --to <tag>', () => {
  assert.equal(parseTag(['--to', '21.0.2']), '21.0.2');
});

test('parseTag accepts a positional tag', () => {
  assert.equal(parseTag(['21.0.2']), '21.0.2');
});

test('parseTag returns null with no arguments', () => {
  assert.equal(parseTag([]), null);
});

// Fix 2: a run that is all-404 (nothing fetched) must not write the tag to the manifest.
test('runSync does not write generatedTag when nothing was fetched (all-404)', async () => {
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
