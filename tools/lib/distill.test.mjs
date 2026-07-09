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

// Fix A: upstream table.md usa a variante de 3 traços `<!--- example(x) --->`.
test('tolera a variante de 3 traços <!--- example(x) ---> e inlineia o código', () => {
  const p = 'Texto.\n\n<!--- example(foo) --->\n\nMais texto.';
  const out = distill({ name: 'table', category: 'component', prose: p, examples: { foo: { ts: 'CODE' } }, tag: 'v1' });
  assert.match(out, /CODE/);
  assert.doesNotMatch(out, /<!--[-\s]*example\(/);
});

// Fix C: guias cuja prosa já começa com H1 não devem duplicar o título do template.
test('guia cuja prosa já tem H1 não duplica o título (Theming)', () => {
  const out = distill({ name: 'theming', category: 'guide', prose: '# Theming\nTexto.', examples: {}, tag: 'v1' });
  const count = (out.match(/^# Theming/mg) || []).length;
  assert.equal(count, 1);
});

// Fix C: componentes sem H1 próprio continuam recebendo o título do template.
test('componente sem H1 próprio continua mostrando # Button', () => {
  const out = distill({ name: 'button', category: 'component', prose, examples, tag: 'v18.2.0' });
  assert.match(out, /^# Button/m);
});

// Fix D: siglas conhecidas (CDK) devem ficar maiúsculas no título.
test('titleCase mantém CDK maiúsculo em cdk-overlay', () => {
  const out = distill({ name: 'cdk-overlay', category: 'component', prose: 'Texto sem H1.', examples: {}, tag: 'v1' });
  assert.match(out, /^# CDK Overlay/m);
});
