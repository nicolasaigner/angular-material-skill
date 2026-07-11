// tools/discover-sources.test.mjs
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { deriveSource, discoverSources } from './discover-sources.mjs';

const TREE = [
  'src/material/button/button.md',
  'src/material/button/button.ts',
  'src/material/button/testing/button-harness.ts',
  'src/material/button/README.md',            // dir != basename → ignora
  'src/material/form-field/form-field.md',
  'src/material/core/core.md',                // regra objetiva: entra
  'src/cdk/overlay/overlay.md',
  'src/cdk/drag-drop/drag-drop.md',
  'guides/theming.md',
  'guides/getting-started.md',
  'README.md',
];

test('deriveSource: componente Material vira name simples', () => {
  assert.deepEqual(deriveSource('src/material/button/button.md'), {
    name: 'button', category: 'component',
    prosePath: 'src/material/button/button.md',
    examplesDir: 'src/components-examples/material/button',
  });
});

test('deriveSource: CDK vira cdk-* com examplesDir de cdk', () => {
  assert.deepEqual(deriveSource('src/cdk/drag-drop/drag-drop.md'), {
    name: 'cdk-drag-drop', category: 'component',
    prosePath: 'src/cdk/drag-drop/drag-drop.md',
    examplesDir: 'src/components-examples/cdk/drag-drop',
  });
});

test('deriveSource: guia tem category guide e sem examplesDir', () => {
  assert.deepEqual(deriveSource('guides/theming.md'), {
    name: 'theming', category: 'guide', prosePath: 'guides/theming.md',
  });
});

test('deriveSource: ignora paths que não casam (dir != basename, .ts, raiz)', () => {
  assert.equal(deriveSource('src/material/button/button.ts'), null);
  assert.equal(deriveSource('src/material/button/README.md'), null);
  assert.equal(deriveSource('src/material/button/testing/button-harness.ts'), null);
  assert.equal(deriveSource('README.md'), null);
});

test('discoverSources: deriva, ordena por name e é determinístico', async () => {
  const treeGet = async () => TREE;
  const a = await discoverSources('v1', treeGet);
  const b = await discoverSources('v1', treeGet);
  assert.deepEqual(a, b);
  assert.deepEqual(a.map((s) => s.name), [
    'button', 'cdk-drag-drop', 'cdk-overlay', 'core', 'form-field', 'getting-started', 'theming',
  ]);
});

test('discoverSources: lança em nome duplicado', async () => {
  const treeGet = async () => ['guides/button.md', 'src/material/button/button.md'];
  await assert.rejects(() => discoverSources('v1', treeGet), /duplicad/i);
});
