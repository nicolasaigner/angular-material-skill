import { test } from 'node:test';
import assert from 'node:assert/strict';
import { SOURCES, getSource, UPSTREAM_REPO } from './sources.mjs';

test('UPSTREAM_REPO points to angular/components', () => {
  assert.equal(UPSTREAM_REPO, 'angular/components');
});

test('SOURCES is non-empty and covers the full slice (>= 50)', () => {
  assert.ok(SOURCES.length >= 50, `expected >= 50 sources, got ${SOURCES.length}`);
});

test('every source has name, valid category, and .md prosePath', () => {
  for (const s of SOURCES) {
    assert.ok(s.name, 'name present');
    assert.ok(['component', 'guide'].includes(s.category), `valid category: ${s.name}`);
    assert.match(s.prosePath, /\.md$/, `.md prosePath: ${s.name}`);
  }
});

test('names are unique', () => {
  const names = SOURCES.map((s) => s.name);
  assert.equal(new Set(names).size, names.length);
});

test('every cdk-* has prosePath under src/cdk/', () => {
  for (const s of SOURCES.filter((s) => s.name.startsWith('cdk-'))) {
    assert.match(s.prosePath, /^src\/cdk\//, `cdk prosePath: ${s.name}`);
  }
});

test('smoke anchors present', () => {
  const names = new Set(SOURCES.map((s) => s.name));
  for (const anchor of ['button', 'cdk-overlay', 'theming']) {
    assert.ok(names.has(anchor), `anchor ${anchor} present`);
  }
});

test('getSource returns the button entry and throws for unknown', () => {
  assert.equal(getSource('button').prosePath, 'src/material/button/button.md');
  assert.throws(() => getSource('inexistente'), /unknown/i);
});
