import { test } from 'node:test';
import assert from 'node:assert/strict';
import { SOURCES, getSource, UPSTREAM_REPO } from './sources.mjs';

test('UPSTREAM_REPO aponta para angular/components', () => {
  assert.equal(UPSTREAM_REPO, 'angular/components');
});

test('SOURCES é não-vazio e cobre a fatia completa (>= 50)', () => {
  assert.ok(SOURCES.length >= 50, `esperado >= 50 sources, veio ${SOURCES.length}`);
});

test('todo source tem name, category válida e prosePath .md', () => {
  for (const s of SOURCES) {
    assert.ok(s.name, 'name presente');
    assert.ok(['component', 'guide'].includes(s.category), `category válida: ${s.name}`);
    assert.match(s.prosePath, /\.md$/, `prosePath .md: ${s.name}`);
  }
});

test('nomes são únicos', () => {
  const names = SOURCES.map((s) => s.name);
  assert.equal(new Set(names).size, names.length);
});

test('todo cdk-* tem prosePath em src/cdk/', () => {
  for (const s of SOURCES.filter((s) => s.name.startsWith('cdk-'))) {
    assert.match(s.prosePath, /^src\/cdk\//, `cdk prosePath: ${s.name}`);
  }
});

test('âncoras de smoke presentes', () => {
  const names = new Set(SOURCES.map((s) => s.name));
  for (const anchor of ['button', 'cdk-overlay', 'theming']) {
    assert.ok(names.has(anchor), `âncora ${anchor} presente`);
  }
});

test('getSource retorna a entrada do button e lança para desconhecido', () => {
  assert.equal(getSource('button').prosePath, 'src/material/button/button.md');
  assert.throws(() => getSource('inexistente'), /desconhecid/i);
});
