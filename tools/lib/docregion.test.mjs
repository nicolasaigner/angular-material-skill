import { test } from 'node:test';
import assert from 'node:assert/strict';
import { stripDocregionMarkers, extractRegion } from './docregion.mjs';

// Fixture real: angular/components@21.0.2
// src/components-examples/cdk/menu/cdk-menu-standalone-menu/cdk-menu-standalone-menu-example.html
const STANDALONE_MENU_HTML = [
  '<!-- #docregion trigger -->',
  '<button [cdkMenuTriggerFor]="menu" class="example-standalone-trigger">Click me!</button>',
  '<!-- #enddocregion trigger -->',
  '',
  '<ng-template #menu>',
  '  <div class="example-menu" cdkMenu>',
  '    <button class="example-menu-item" cdkMenuItem>Refresh</button>',
  '    <button class="example-menu-item" cdkMenuItem>Settings</button>',
  '    <button class="example-menu-item" cdkMenuItem>Help</button>',
  '    <button class="example-menu-item" cdkMenuItem>Sign out</button>',
  '  </div>',
  '</ng-template>',
].join('\n');

// Fixture real: angular/components@21.0.2
// src/components-examples/cdk/menu/cdk-menu-menubar/cdk-menu-menubar-example.html (trecho)
const MENUBAR_HTML = [
  '<div cdkMenuBar>',
  '  <!-- #docregion file-trigger -->',
  '  <button class="example-menu-bar-item" cdkMenuItem [cdkMenuTriggerFor]="file">File</button>',
  '  <!-- #enddocregion file-trigger -->',
  '  <button class="example-menu-bar-item" cdkMenuItem [cdkMenuTriggerFor]="edit">Edit</button>',
  '</div>',
].join('\n');

// Fixture real: angular/components@21.0.2
// src/components-examples/cdk/listbox/cdk-listbox-overview/cdk-listbox-overview-example.html
// (região "option" aninhada dentro de "listbox")
const LISTBOX_HTML = [
  '<div class="example-listbox-container">',
  '  <!-- #docregion listbox -->',
  '  <label class="example-listbox-label" id="example-fav-color-label">',
  '    Favorite color',
  '  </label>',
  '  <ul cdkListbox',
  '      aria-labelledby="example-fav-color-label"',
  '      class="example-listbox">',
  '    <!-- #docregion option -->',
  '    <li cdkOption="red" class="example-option">Red</li>',
  '    <!-- #enddocregion option -->',
  '    <li cdkOption="green" class="example-option">Green</li>',
  '    <li cdkOption="blue" class="example-option">Blue</li>',
  '  </ul>',
  '  <!-- #enddocregion listbox -->',
  '</div>',
].join('\n');

test('stripDocregionMarkers remove marcadores HTML e // preservando indentação e linhas em branco', () => {
  const code = [
    '// #docregion foo',
    'import {Component} from \'@angular/core\';',
    '',
    '  // #enddocregion foo',
    '<!-- #docregion bar -->',
    '<div>x</div>',
    '<!--   #enddocregion   bar   -->',
  ].join('\n');
  const out = stripDocregionMarkers(code);
  assert.doesNotMatch(out, /docregion/);
  assert.match(out, /import \{Component\}/);
  assert.match(out, /<div>x<\/div>/);
  // linha em branco original entre import e o marcador removido é preservada
  assert.match(out, /import \{Component\} from '@angular\/core';\n\n<div>x<\/div>/);
});

test('extractRegion sobre fixture real (trigger) devolve exatamente o trecho esperado, sem marcadores nem <ng-template>', () => {
  const out = extractRegion(STANDALONE_MENU_HTML, 'trigger');
  assert.equal(
    out,
    '\n<button [cdkMenuTriggerFor]="menu" class="example-standalone-trigger">Click me!</button>',
  );
  assert.doesNotMatch(out, /ng-template/);
  assert.doesNotMatch(out, /docregion/);
});

test('extractRegion respeita fronteira de palavra: "trigger" não casa com "file-trigger"', () => {
  const out = extractRegion(MENUBAR_HTML, 'trigger');
  assert.equal(out, '');
});

test('extractRegion acha "file-trigger" corretamente no mesmo arquivo', () => {
  const out = extractRegion(MENUBAR_HTML, 'file-trigger');
  assert.match(out, /File<\/button>/);
  assert.doesNotMatch(out, /Edit/);
});

test('extractRegion região inexistente devolve string vazia', () => {
  assert.equal(extractRegion(STANDALONE_MENU_HTML, 'nao-existe'), '');
});

test('extractRegion com região aninhada de outro nome: extrai "listbox" sem os marcadores internos de "option", mas mantém o conteúdo de "option"', () => {
  const out = extractRegion(LISTBOX_HTML, 'listbox');
  assert.doesNotMatch(out, /docregion/);
  assert.match(out, /Red<\/li>/);
  assert.match(out, /Green<\/li>/);
  assert.match(out, /Blue<\/li>/);
});

test('extractRegion isola a região "option" aninhada, sem o restante do listbox', () => {
  const out = extractRegion(LISTBOX_HTML, 'option');
  assert.match(out, /Red<\/li>/);
  assert.doesNotMatch(out, /Green/);
  assert.doesNotMatch(out, /Favorite color/);
});

// Fixture real: angular/components@21.0.2
// src/components-examples/material/toolbar/toolbar-multirow/toolbar-multirow-example.css
// CSS usa a forma de comentário de bloco `/* #docregion x */`, não `//` nem `<!-- -->`.
const TOOLBAR_MULTIROW_CSS = [
  '.example-icon {',
  '  padding: 0 14px;',
  '}',
  '/* #docregion toolbar-position-content-style */',
  '.example-spacer {',
  '  flex: 1 1 auto;',
  '}',
  '/* #enddocregion toolbar-position-content-style */',
].join('\n');

test('extractRegion reconhece marcador CSS em comentário de bloco /* #docregion x */ (fixture real toolbar-multirow.css)', () => {
  const out = extractRegion(TOOLBAR_MULTIROW_CSS, 'toolbar-position-content-style');
  assert.match(out, /example-spacer/);
  assert.match(out, /flex: 1 1 auto;/);
  assert.doesNotMatch(out, /docregion/);
  assert.doesNotMatch(out, /example-icon/);
});

test('stripDocregionMarkers remove marcadores em comentário de bloco /* ... */', () => {
  const out = stripDocregionMarkers(TOOLBAR_MULTIROW_CSS);
  assert.doesNotMatch(out, /docregion/);
  assert.match(out, /example-icon/);
  assert.match(out, /example-spacer/);
});

test('extractRegion concatena blocos repetidos com o mesmo nome de região', () => {
  const code = [
    '// #docregion foo',
    'const a = 1;',
    '// #enddocregion foo',
    'const skip = true;',
    '// #docregion foo',
    'const b = 2;',
    '// #enddocregion foo',
  ].join('\n');
  const out = extractRegion(code, 'foo');
  assert.match(out, /const a = 1;/);
  assert.match(out, /const b = 2;/);
  assert.doesNotMatch(out, /skip/);
});
