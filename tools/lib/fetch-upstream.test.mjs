import { test } from 'node:test';
import assert from 'node:assert/strict';
import { rawUrl, extractExampleNames, fetchSources } from './fetch-upstream.mjs';

test('rawUrl monta a URL correta', () => {
  assert.equal(
    rawUrl('v18.2.0', 'src/material/button/button.md'),
    'https://raw.githubusercontent.com/angular/components/v18.2.0/src/material/button/button.md',
  );
});

test('extractExampleNames pega os nomes dos comentários', () => {
  const p = 'a\n<!-- example(button-overview) -->\nb\n<!-- example(button-types) -->';
  assert.deepEqual(extractExampleNames(p), ['button-overview', 'button-types']);
});

// Fix A: upstream table.md usa a variante de 3 traços.
test('extractExampleNames tolera a variante de 3 traços <!--- example(x) --->', () => {
  const p = 'a\n<!--- example(bar) --->';
  assert.deepEqual(extractExampleNames(p), ['bar']);
});

// Fixture real: angular/components@21.0.2 src/cdk/menu/menu.md (trecho literal)
// Duas tags JSON referenciam o mesmo example (arquivo/região diferentes) seguidas de
// uma terceira tag JSON de outro example -> dedup deve colapsar as duas primeiras.
test('extractExampleNames dedup tags JSON do mesmo example (fixture real cdk-menu.md)', () => {
  const p = [
    'Import the `CdkMenuModule` into the `NgModule`...',
    '',
    '<!-- example({',
    '  "example": "cdk-menu-standalone-menu",',
    '  "file": "cdk-menu-standalone-menu-example.html"',
    '  }) -->',
    '',
    'Most menu interactions consist of two parts: a trigger and a menu panel.',
    '',
    '<!-- example({"example":"cdk-menu-standalone-menu",',
    '              "file":"cdk-menu-standalone-menu-example.html",',
    '              "region":"trigger"}) -->',
    '',
    'When creating a submenu trigger, add both `cdkMenuItem` and `cdkMenuTriggerFor`.',
    '',
    '<!-- example({"example":"cdk-menu-menubar",',
    '              "file":"cdk-menu-menubar-example.html",',
    '              "region":"file-trigger"}) -->',
  ].join('\n');
  assert.deepEqual(extractExampleNames(p), ['cdk-menu-standalone-menu', 'cdk-menu-menubar']);
});

test('extractExampleNames devolve uma única busca para 3 tags JSON do mesmo example com regiões diferentes', () => {
  const p = [
    '<!-- example({"example":"cdk-menu-standalone-stateful-menu","file":"x.html","region":"a"}) -->',
    '<!-- example({"example":"cdk-menu-standalone-stateful-menu","file":"x.html","region":"b"}) -->',
    '<!-- example({"example":"cdk-menu-standalone-stateful-menu","file":"x.ts"}) -->',
  ].join('\n');
  assert.deepEqual(extractExampleNames(p), ['cdk-menu-standalone-stateful-menu']);
});

test('extractExampleNames mistura forma simples e JSON preservando ordem de primeira aparição', () => {
  const p = [
    '<!-- example(button-overview) -->',
    '<!-- example({"example":"button-types","file":"button-types-example.ts"}) -->',
    '<!-- example(button-overview) -->',
  ].join('\n');
  assert.deepEqual(extractExampleNames(p), ['button-overview', 'button-types']);
});

test('fetchSources busca prosa + trio de exemplo via rawGet fake', async () => {
  const files = {
    'https://raw.githubusercontent.com/angular/components/v1/src/material/button/button.md':
      'Botões.\n<!-- example(button-overview) -->',
    'https://raw.githubusercontent.com/angular/components/v1/src/components-examples/material/button/button-overview/button-overview-example.ts':
      'export class ButtonOverviewExample {}',
    'https://raw.githubusercontent.com/angular/components/v1/src/components-examples/material/button/button-overview/button-overview-example.html':
      '<button mat-button>Oi</button>',
  };
  const rawGet = async (url) => (url in files ? files[url] : null);
  const sources = [
    { name: 'button', category: 'component', prosePath: 'src/material/button/button.md', examplesDir: 'src/components-examples/material/button' },
  ];
  const out = await fetchSources('v1', sources, rawGet);
  assert.match(out.button.prose, /Botões/);
  assert.equal(out.button.examples['button-overview'].ts, 'export class ButtonOverviewExample {}');
  assert.equal(out.button.examples['button-overview'].html, '<button mat-button>Oi</button>');
  assert.equal(out.button.examples['button-overview'].css, undefined);
});

test('fetchSources pula source sem prosa (404) com aviso', async () => {
  const rawGet = async () => null;
  const sources = [{ name: 'fantasma', category: 'component', prosePath: 'x/y.md', examplesDir: 'z' }];
  const out = await fetchSources('v1', sources, rawGet);
  assert.equal(out.fantasma, undefined);
});

// Fix 4: uma falha (throw, não 404) num source isola nele, não derruba os outros.
test('fetchSources isola falha (throw) de um source e continua os demais', async () => {
  const urlA = 'https://raw.githubusercontent.com/angular/components/v1/src/material/a/a.md';
  const urlB = 'https://raw.githubusercontent.com/angular/components/v1/src/material/b/b.md';
  const rawGet = async (url) => {
    if (url === urlA) throw new Error('HTTP 500 simulado');
    if (url === urlB) return 'Prosa de B.';
    return null;
  };
  const sources = [
    { name: 'a', category: 'component', prosePath: 'src/material/a/a.md' },
    { name: 'b', category: 'component', prosePath: 'src/material/b/b.md' },
  ];
  const out = await fetchSources('v1', sources, rawGet);
  assert.equal(out.a, undefined);
  assert.match(out.b.prose, /Prosa de B/);
});
