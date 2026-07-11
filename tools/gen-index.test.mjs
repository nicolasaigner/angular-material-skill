import { test } from 'node:test';
import assert from 'node:assert/strict';
import { renderIndex } from './gen-index.mjs';

const sources = [
  { name: 'button', category: 'component' },
  { name: 'cdk-overlay', category: 'component' },
  { name: 'theming', category: 'guide' },
];

test('renderIndex agrupa em Material, CDK e Guias', () => {
  const md = renderIndex(sources);
  assert.match(md, /## Material \(1\)/);
  assert.match(md, /## CDK \(1\)/);
  assert.match(md, /## Guias \(1\)/);
});

test('renderIndex lista cada source com link relativo na seção certa', () => {
  const md = renderIndex(sources);
  assert.match(md, /\[button\]\(\.\/button\.md\)/);
  assert.match(md, /\[cdk-overlay\]\(\.\/cdk-overlay\.md\)/);
  assert.match(md, /\[theming\]\(\.\/theming\.md\)/);
  // cdk-overlay aparece depois do header CDK e antes do header Guias
  const cdkIdx = md.indexOf('## CDK');
  const guiasIdx = md.indexOf('## Guias');
  const overlayIdx = md.indexOf('cdk-overlay](');
  assert.ok(cdkIdx < overlayIdx && overlayIdx < guiasIdx, 'cdk-overlay sob a seção CDK');
});
