import { test } from 'node:test';
import assert from 'node:assert/strict';
import { renderIndex } from './gen-index.mjs';

test('renderIndex lista cada source com link relativo e categoria', () => {
  const sources = [
    { name: 'button', category: 'component' },
    { name: 'theming', category: 'guide' },
  ];
  const md = renderIndex(sources);
  assert.match(md, /\[button\]\(\.\/button\.md\)/);
  assert.match(md, /\[theming\]\(\.\/theming\.md\)/);
  assert.match(md, /component/);
  assert.match(md, /guide/);
});
