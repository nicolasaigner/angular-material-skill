import { test } from 'node:test';
import assert from 'node:assert/strict';
import { parseExampleTag } from './example-tag.mjs';

test('parseExampleTag: plain name', () => {
  assert.deepEqual(parseExampleTag('badge-overview'), { example: 'badge-overview' });
});

test('parseExampleTag: plain name with surrounding spaces is trimmed', () => {
  assert.deepEqual(parseExampleTag('  badge-overview  '), { example: 'badge-overview' });
});

// Real fixture: angular/components@21.0.2 src/cdk/menu/menu.md
test('parseExampleTag: multi-line JSON with file', () => {
  const payload = `{
  "example": "cdk-menu-standalone-menu",
  "file": "cdk-menu-standalone-menu-example.html"
  }`;
  const out = parseExampleTag(payload);
  assert.equal(out.example, 'cdk-menu-standalone-menu');
  assert.equal(out.file, 'cdk-menu-standalone-menu-example.html');
  assert.equal(out.region, undefined);
});

// Real fixture: angular/components@21.0.2 src/cdk/menu/menu.md
test('parseExampleTag: single-line JSON with region', () => {
  const payload =
    '{"example":"cdk-menu-standalone-menu",\n' +
    '              "file":"cdk-menu-standalone-menu-example.html",\n' +
    '              "region":"trigger"}';
  const out = parseExampleTag(payload);
  assert.equal(out.example, 'cdk-menu-standalone-menu');
  assert.equal(out.file, 'cdk-menu-standalone-menu-example.html');
  assert.equal(out.region, 'trigger');
});

test('parseExampleTag: name with a line break and no braces -> collapsed plain name (whitespace becomes a single space)', () => {
  const out = parseExampleTag('nao\nexiste');
  assert.deepEqual(out, { example: 'nao existe' });
});

test('parseExampleTag: malformed JSON falls back to a tolerant collapsed name (does not break)', () => {
  const out = parseExampleTag('{ "example": "foo", }'); // trailing comma invalidates the JSON
  assert.equal(typeof out.example, 'string');
  assert.ok(!out.example.includes('\n'), 'the tolerant fallback must not contain a line break');
});

test('parseExampleTag: JSON without file/region leaves both undefined', () => {
  const out = parseExampleTag('{"example":"badge-overview"}');
  assert.deepEqual(out, { example: 'badge-overview', file: undefined, region: undefined });
});
