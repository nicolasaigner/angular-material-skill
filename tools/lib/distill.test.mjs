// tools/lib/distill.test.mjs
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { distill } from './distill.mjs';

const prose = [
  'Botões acionam ações.',
  '',
  '<!-- example(button-overview) -->',
  '',
  '## Accessibility',
  'Use texto claro.',
].join('\n');

const examples = {
  'button-overview': {
    ts: 'export class ButtonOverviewExample {}',
    html: '<button mat-button>Oi</button>',
  },
};

test('cabeçalho traz atribuição, tag e link oficial', () => {
  const out = distill({ name: 'button', category: 'component', prose, examples, tag: 'v18.2.0' });
  assert.match(out, /^# Button/m);
  assert.match(out, /angular\/components/);
  assert.match(out, /v18\.2\.0/);
  assert.match(out, /material\.angular\.dev\/components\/button/);
});

test('resolve a tag example inlineando o código real e remove o comentário', () => {
  const out = distill({ name: 'button', category: 'component', prose, examples, tag: 'v18.2.0' });
  assert.doesNotMatch(out, /<!--\s*example\(/);
  assert.match(out, /export class ButtonOverviewExample/);
  assert.match(out, /```ts/);
  assert.match(out, /```html/);
  assert.ok(!out.includes('```css'), 'sem bloco css quando o exemplo não tem css');
});

test('exemplo ausente vira aviso, não quebra', () => {
  const p = 'Texto.\n\n<!-- example(nao-existe) -->\n';
  const out = distill({ name: 'button', category: 'component', prose: p, examples: {}, tag: 'v1' });
  assert.match(out, /não encontrado/i);
  assert.doesNotMatch(out, /<!--\s*example\(/);
});

test('guia global usa URL de guia', () => {
  const out = distill({ name: 'theming', category: 'guide', prose: '# Theming\nTexto.', examples: {}, tag: 'v1' });
  assert.match(out, /material\.angular\.dev\/guide\/theming/);
});

test('determinístico: mesma entrada, mesma saída', () => {
  const a = distill({ name: 'button', category: 'component', prose, examples, tag: 'v1' });
  const b = distill({ name: 'button', category: 'component', prose, examples, tag: 'v1' });
  assert.equal(a, b);
});
