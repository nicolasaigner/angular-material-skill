import { test } from 'node:test';
import assert from 'node:assert/strict';
import { renderIndex } from './gen-index.mjs';

const sources = [
  { name: 'button', category: 'component' },
  { name: 'cdk-overlay', category: 'component' },
  { name: 'theming', category: 'guide' },
];

test('renderIndex groups into Material, CDK, and Guides', () => {
  const md = renderIndex(sources);
  assert.match(md, /## Material \(1\)/);
  assert.match(md, /## CDK \(1\)/);
  assert.match(md, /## Guides \(1\)/);
});

test('renderIndex lists each source with a relative link in the right section', () => {
  const md = renderIndex(sources);
  assert.match(md, /\[button\]\(\.\/button\.md\)/);
  assert.match(md, /\[cdk-overlay\]\(\.\/cdk-overlay\.md\)/);
  assert.match(md, /\[theming\]\(\.\/theming\.md\)/);
  // cdk-overlay appears after the CDK header and before the Guides header
  const cdkIdx = md.indexOf('## CDK');
  const guidesIdx = md.indexOf('## Guides');
  const overlayIdx = md.indexOf('cdk-overlay](');
  assert.ok(cdkIdx < overlayIdx && overlayIdx < guidesIdx, 'cdk-overlay is under the CDK section');
});
