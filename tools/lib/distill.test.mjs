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

// Polish A: exemplo não encontrado cujo nome (upstream malformado) contém quebra
// de linha não deve produzir um fallback multi-linha (JSON cru, etc).
test('exemplo ausente com nome contendo quebra de linha renderiza fallback de uma linha só', () => {
  const p = 'Texto.\n\n<!-- example(nao\nexiste) -->\n';
  const out = distill({ name: 'dialog', category: 'component', prose: p, examples: {}, tag: 'v1' });
  const fallbackLine = out.split('\n').find((l) => l.includes('não encontrado'));
  assert.ok(fallbackLine, 'deve haver uma linha de fallback');
  assert.ok(!fallbackLine.includes('\n'), 'a linha de fallback não deve conter quebra de linha embutida');
  // a saída inteira não deve ter duas linhas consecutivas vazias quebrando o nome em partes
  assert.doesNotMatch(out, /nao\nexiste/);
});

// Task 4b - Bug #1: tag JSON com "file" -> renderiza só aquele arquivo (fixture real cdk-menu.md).
test('tag JSON com file renderiza só o arquivo pedido (não o exemplo inteiro)', () => {
  const p = [
    'Texto antes.',
    '',
    '<!-- example({',
    '  "example": "cdk-menu-standalone-menu",',
    '  "file": "cdk-menu-standalone-menu-example.html"',
    '  }) -->',
    '',
    'Texto depois.',
  ].join('\n');
  const ex = {
    'cdk-menu-standalone-menu': {
      ts: 'export class CdkMenuStandaloneMenuExample {}',
      html: '<button [cdkMenuTriggerFor]="menu" class="example-standalone-trigger">Click me!</button>',
    },
  };
  const out = distill({ name: 'cdk-menu', category: 'component', prose: p, examples: ex, tag: 'v1' });
  assert.doesNotMatch(out, /<!--[-\s]*example\(/);
  assert.match(out, /```html/);
  assert.match(out, /Click me!/);
  assert.ok(!out.includes('```ts'), 'não deve incluir o .ts quando a tag JSON pede só o .html');
});

// Task 4b - Bug #1: tag JSON com "file" + "region" -> renderiza só a região extraída (fixture real).
test('tag JSON com file+region renderiza só a região extraída, sem marcadores docregion', () => {
  const p = [
    'Texto antes.',
    '',
    '<!-- example({"example":"cdk-menu-standalone-menu",',
    '              "file":"cdk-menu-standalone-menu-example.html",',
    '              "region":"trigger"}) -->',
    '',
    'Texto depois.',
  ].join('\n');
  const html = [
    '<!-- #docregion trigger -->',
    '<button [cdkMenuTriggerFor]="menu" class="example-standalone-trigger">Click me!</button>',
    '<!-- #enddocregion trigger -->',
    '',
    '<ng-template #menu>',
    '  <div class="example-menu" cdkMenu>...</div>',
    '</ng-template>',
  ].join('\n');
  const ex = { 'cdk-menu-standalone-menu': { html } };
  const out = distill({ name: 'cdk-menu', category: 'component', prose: p, examples: ex, tag: 'v1' });
  assert.doesNotMatch(out, /<!--[-\s]*example\(/);
  assert.match(out, /Click me!/);
  assert.doesNotMatch(out, /ng-template/);
  assert.doesNotMatch(out, /docregion/);
});

// Task 4b - Bug #2: nome simples (arquivo inteiro) deve sair sem marcadores #docregion vazados.
test('exemplo inteiro (nome simples) sai sem marcadores #docregion/#enddocregion vazados', () => {
  const p = 'Texto.\n\n<!-- example(cdk-menu-standalone-menu) -->\n';
  const ex = {
    'cdk-menu-standalone-menu': {
      html: [
        '<!-- #docregion trigger -->',
        '<button>Click me!</button>',
        '<!-- #enddocregion trigger -->',
        '<ng-template #menu>menu</ng-template>',
      ].join('\n'),
    },
  };
  const out = distill({ name: 'cdk-menu', category: 'component', prose: p, examples: ex, tag: 'v1' });
  assert.doesNotMatch(out, /docregion/);
  assert.match(out, /Click me!/);
});

// Task 4b: file pedido pela tag JSON mas ausente no fetch -> fallback de uma linha, não quebra.
test('tag JSON pede um file que não veio no fetch -> fallback, não quebra', () => {
  const p = '<!-- example({"example":"cdk-menu-standalone-menu","file":"nao-baixado.css"}) -->';
  const ex = { 'cdk-menu-standalone-menu': { html: '<button>x</button>' } };
  const out = distill({ name: 'cdk-menu', category: 'component', prose: p, examples: ex, tag: 'v1' });
  assert.match(out, /não encontrado/i);
  assert.doesNotMatch(out, /<!--[-\s]*example\(/);
});

// Task 4b: tag JSON pede uma region que não existe no arquivo -> fallback, não quebra.
test('tag JSON pede uma region inexistente no arquivo -> fallback, não quebra', () => {
  const p = '<!-- example({"example":"cdk-menu-standalone-menu","file":"x.html","region":"nao-existe"}) -->';
  const ex = { 'cdk-menu-standalone-menu': { html: '<button>x</button>' } };
  const out = distill({ name: 'cdk-menu', category: 'component', prose: p, examples: ex, tag: 'v1' });
  assert.match(out, /não encontrado/i);
  assert.doesNotMatch(out, /<!--[-\s]*example\(/);
});

// Task 4b - Bug #3: dedup de H1 robusto — H1 precedido por bloco <style> (fixture real:
// theming-your-components.md) não deve duplicar o título.
test('H1 robusto: bloco <style> antes do H1 da prosa não duplica o título (theming-your-components)', () => {
  const p = '<style>.x{}</style>\n\n# Theming your components\nTexto.';
  const out = distill({ name: 'theming-your-components', category: 'guide', prose: p, examples: {}, tag: 'v1' });
  const count = (out.match(/^# /mg) || []).length;
  assert.equal(count, 1);
  assert.match(out, /^# Theming your components$/m);
});

// Task 4b - Bug #3: H2 sozinho não deve ser confundido com H1 -> template ainda injeta o título.
test('H1 robusto: prosa com só H2 continua recebendo o título do template', () => {
  const p = '## Só subtítulo\nTexto';
  const out = distill({ name: 'button', category: 'component', prose: p, examples: {}, tag: 'v1' });
  assert.match(out, /^# Button/m);
});
