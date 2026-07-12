import { test } from 'node:test';
import assert from 'node:assert/strict';
import { stripDocregionMarkers, extractRegion } from './docregion.mjs';

// Real fixture: angular/components@21.0.2
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

// Real fixture: angular/components@21.0.2
// src/components-examples/cdk/menu/cdk-menu-menubar/cdk-menu-menubar-example.html (excerpt)
const MENUBAR_HTML = [
  '<div cdkMenuBar>',
  '  <!-- #docregion file-trigger -->',
  '  <button class="example-menu-bar-item" cdkMenuItem [cdkMenuTriggerFor]="file">File</button>',
  '  <!-- #enddocregion file-trigger -->',
  '  <button class="example-menu-bar-item" cdkMenuItem [cdkMenuTriggerFor]="edit">Edit</button>',
  '</div>',
].join('\n');

// Real fixture: angular/components@21.0.2
// src/components-examples/cdk/listbox/cdk-listbox-overview/cdk-listbox-overview-example.html
// (region "option" nested inside "listbox")
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

test('stripDocregionMarkers removes HTML and // markers while preserving indentation and blank lines', () => {
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
  // the original blank line between the import and the removed marker is preserved
  assert.match(out, /import \{Component\} from '@angular\/core';\n\n<div>x<\/div>/);
});

test('extractRegion on the real fixture (trigger) returns exactly the expected excerpt, without markers or <ng-template>', () => {
  const out = extractRegion(STANDALONE_MENU_HTML, 'trigger');
  assert.equal(
    out,
    '\n<button [cdkMenuTriggerFor]="menu" class="example-standalone-trigger">Click me!</button>',
  );
  assert.doesNotMatch(out, /ng-template/);
  assert.doesNotMatch(out, /docregion/);
});

test('extractRegion respects the word boundary: "trigger" does not match "file-trigger"', () => {
  const out = extractRegion(MENUBAR_HTML, 'trigger');
  assert.equal(out, '');
});

test('extractRegion correctly finds "file-trigger" in the same file', () => {
  const out = extractRegion(MENUBAR_HTML, 'file-trigger');
  assert.match(out, /File<\/button>/);
  assert.doesNotMatch(out, /Edit/);
});

test('extractRegion returns an empty string for a non-existent region', () => {
  assert.equal(extractRegion(STANDALONE_MENU_HTML, 'nao-existe'), '');
});

test('extractRegion with a region nested inside another: extracts "listbox" without the inner "option" markers, but keeps the "option" content', () => {
  const out = extractRegion(LISTBOX_HTML, 'listbox');
  assert.doesNotMatch(out, /docregion/);
  assert.match(out, /Red<\/li>/);
  assert.match(out, /Green<\/li>/);
  assert.match(out, /Blue<\/li>/);
});

test('extractRegion isolates the nested "option" region, without the rest of the listbox', () => {
  const out = extractRegion(LISTBOX_HTML, 'option');
  assert.match(out, /Red<\/li>/);
  assert.doesNotMatch(out, /Green/);
  assert.doesNotMatch(out, /Favorite color/);
});

// Real fixture: angular/components@21.0.2
// src/components-examples/material/toolbar/toolbar-multirow/toolbar-multirow-example.css
// CSS uses the block-comment marker form `/* #docregion x */`, not `//` or `<!-- -->`.
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

test('extractRegion recognizes the CSS block-comment marker /* #docregion x */ (real toolbar-multirow.css fixture)', () => {
  const out = extractRegion(TOOLBAR_MULTIROW_CSS, 'toolbar-position-content-style');
  assert.match(out, /example-spacer/);
  assert.match(out, /flex: 1 1 auto;/);
  assert.doesNotMatch(out, /docregion/);
  assert.doesNotMatch(out, /example-icon/);
});

test('stripDocregionMarkers removes markers in the /* ... */ block-comment form', () => {
  const out = stripDocregionMarkers(TOOLBAR_MULTIROW_CSS);
  assert.doesNotMatch(out, /docregion/);
  assert.match(out, /example-icon/);
  assert.match(out, /example-spacer/);
});

test('extractRegion concatenates repeated blocks with the same region name', () => {
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
