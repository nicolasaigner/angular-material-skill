import { test } from 'node:test';
import assert from 'node:assert/strict';
import { SOURCES, getSource, UPSTREAM_REPO } from './sources.mjs';

test('UPSTREAM_REPO aponta para angular/components', () => {
  assert.equal(UPSTREAM_REPO, 'angular/components');
});

test('a fatia v1 tem os 6 nomes esperados', () => {
  const names = SOURCES.map((s) => s.name).sort();
  assert.deepEqual(names, ['button', 'cdk-overlay', 'dialog', 'form-field', 'table', 'theming']);
});

test('todo source tem name, category válida e prosePath', () => {
  for (const s of SOURCES) {
    assert.ok(s.name, 'name presente');
    assert.ok(['component', 'guide'].includes(s.category), `category válida: ${s.name}`);
    assert.match(s.prosePath, /\.md$/, `prosePath .md: ${s.name}`);
  }
});

test('getSource retorna a entrada do button', () => {
  assert.equal(getSource('button').prosePath, 'src/material/button/button.md');
});

test('getSource lança para nome desconhecido', () => {
  assert.throws(() => getSource('inexistente'), /desconhecid/i);
});
