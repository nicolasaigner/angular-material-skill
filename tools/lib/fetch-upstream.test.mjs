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
