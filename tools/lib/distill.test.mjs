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

test('header carries attribution, tag, and official link', () => {
  const out = distill({ name: 'button', category: 'component', prose, examples, tag: 'v18.2.0' });
  assert.match(out, /^# Button/m);
  assert.match(out, /angular\/components/);
  assert.match(out, /v18\.2\.0/);
  assert.match(out, /material\.angular\.dev\/components\/button/);
});

test('resolves the example tag by inlining the real code and removing the comment', () => {
  const out = distill({ name: 'button', category: 'component', prose, examples, tag: 'v18.2.0' });
  assert.doesNotMatch(out, /<!--\s*example\(/);
  assert.match(out, /export class ButtonOverviewExample/);
  assert.match(out, /```ts/);
  assert.match(out, /```html/);
  assert.ok(!out.includes('```css'), 'no css block when the example has no css');
});

test('missing example becomes a warning, does not break', () => {
  const p = 'Texto.\n\n<!-- example(nao-existe) -->\n';
  const out = distill({ name: 'button', category: 'component', prose: p, examples: {}, tag: 'v1' });
  assert.match(out, /not found/i);
  assert.doesNotMatch(out, /<!--\s*example\(/);
});

test('global guide uses guide URL', () => {
  const out = distill({ name: 'theming', category: 'guide', prose: '# Theming\nTexto.', examples: {}, tag: 'v1' });
  assert.match(out, /material\.angular\.dev\/guide\/theming/);
});

test('deterministic: same input, same output', () => {
  const a = distill({ name: 'button', category: 'component', prose, examples, tag: 'v1' });
  const b = distill({ name: 'button', category: 'component', prose, examples, tag: 'v1' });
  assert.equal(a, b);
});

// Fix A: upstream table.md uses the 3-dash variant `<!--- example(x) --->`.
test('tolerates the 3-dash variant <!--- example(x) ---> and inlines the code', () => {
  const p = 'Texto.\n\n<!--- example(foo) --->\n\nMais texto.';
  const out = distill({ name: 'table', category: 'component', prose: p, examples: { foo: { ts: 'CODE' } }, tag: 'v1' });
  assert.match(out, /CODE/);
  assert.doesNotMatch(out, /<!--[-\s]*example\(/);
});

// Fix C: guides whose prose already starts with an H1 must not duplicate the template title.
test('guide whose prose already has an H1 does not duplicate the title (Theming)', () => {
  const out = distill({ name: 'theming', category: 'guide', prose: '# Theming\nTexto.', examples: {}, tag: 'v1' });
  const count = (out.match(/^# Theming/mg) || []).length;
  assert.equal(count, 1);
});

// Fix C: components without their own H1 still receive the template title.
test('component without its own H1 still shows # Button', () => {
  const out = distill({ name: 'button', category: 'component', prose, examples, tag: 'v18.2.0' });
  assert.match(out, /^# Button/m);
});

// Fix D: known acronyms (CDK) must stay uppercase in the title.
test('titleCase keeps CDK uppercase in cdk-overlay', () => {
  const out = distill({ name: 'cdk-overlay', category: 'component', prose: 'Texto sem H1.', examples: {}, tag: 'v1' });
  assert.match(out, /^# CDK Overlay/m);
});

// Polish A: a not-found example whose name (malformed upstream) contains a line
// break must not produce a multi-line fallback (raw JSON, etc).
test('missing example with a name containing a line break renders a single-line fallback', () => {
  const p = 'Texto.\n\n<!-- example(nao\nexiste) -->\n';
  const out = distill({ name: 'dialog', category: 'component', prose: p, examples: {}, tag: 'v1' });
  const fallbackLine = out.split('\n').find((l) => l.includes('not found'));
  assert.ok(fallbackLine, 'there must be a fallback line');
  assert.ok(!fallbackLine.includes('\n'), 'the fallback line must not contain an embedded line break');
  // the whole output must not have two consecutive blank lines splitting the name into parts
  assert.doesNotMatch(out, /nao\nexiste/);
});

// Task 4b - Bug #1: JSON tag with "file" -> renders only that file (real cdk-menu.md fixture).
test('JSON tag with file renders only the requested file (not the whole example)', () => {
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
  assert.ok(!out.includes('```ts'), 'must not include the .ts when the JSON tag asks for only the .html');
});

// Task 4b - Bug #1: JSON tag with "file" + "region" -> renders only the extracted region (real fixture).
test('JSON tag with file+region renders only the extracted region, without docregion markers', () => {
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

// Task 4b - Bug #2: plain name (whole file) must come out without leaked #docregion markers.
test('whole example (plain name) comes out without leaked #docregion/#enddocregion markers', () => {
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

// Task 4b: file requested by the JSON tag but missing from the fetch -> single-line fallback, does not break.
test('JSON tag asks for a file that was not fetched -> fallback, does not break', () => {
  const p = '<!-- example({"example":"cdk-menu-standalone-menu","file":"nao-baixado.css"}) -->';
  const ex = { 'cdk-menu-standalone-menu': { html: '<button>x</button>' } };
  const out = distill({ name: 'cdk-menu', category: 'component', prose: p, examples: ex, tag: 'v1' });
  assert.match(out, /not found/i);
  assert.doesNotMatch(out, /<!--[-\s]*example\(/);
});

// Task 4b: JSON tag asks for a region that does not exist in the file -> fallback, does not break.
test('JSON tag asks for a region that does not exist in the file -> fallback, does not break', () => {
  const p = '<!-- example({"example":"cdk-menu-standalone-menu","file":"x.html","region":"nao-existe"}) -->';
  const ex = { 'cdk-menu-standalone-menu': { html: '<button>x</button>' } };
  const out = distill({ name: 'cdk-menu', category: 'component', prose: p, examples: ex, tag: 'v1' });
  assert.match(out, /not found/i);
  assert.doesNotMatch(out, /<!--[-\s]*example\(/);
});

// Task 4b - Bug #3: robust H1 dedup — H1 preceded by a <style> block (real fixture:
// theming-your-components.md) must not duplicate the title.
test('robust H1: <style> block before the prose H1 does not duplicate the title (theming-your-components)', () => {
  const p = '<style>.x{}</style>\n\n# Theming your components\nTexto.';
  const out = distill({ name: 'theming-your-components', category: 'guide', prose: p, examples: {}, tag: 'v1' });
  const count = (out.match(/^# /mg) || []).length;
  assert.equal(count, 1);
  assert.match(out, /^# Theming your components$/m);
});

// Task 4b - Bug #3: a lone H2 must not be confused with H1 -> template still injects the title.
test('robust H1: prose with only an H2 still receives the template title', () => {
  const p = '## Só subtítulo\nTexto';
  const out = distill({ name: 'button', category: 'component', prose: p, examples: {}, tag: 'v1' });
  assert.match(out, /^# Button/m);
});
