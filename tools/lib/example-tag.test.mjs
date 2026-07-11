import { test } from 'node:test';
import assert from 'node:assert/strict';
import { parseExampleTag } from './example-tag.mjs';

test('parseExampleTag: nome simples', () => {
  assert.deepEqual(parseExampleTag('badge-overview'), { example: 'badge-overview' });
});

test('parseExampleTag: nome simples com espaços ao redor é aparado', () => {
  assert.deepEqual(parseExampleTag('  badge-overview  '), { example: 'badge-overview' });
});

// Fixture real: angular/components@21.0.2 src/cdk/menu/menu.md
test('parseExampleTag: JSON multi-linha com file', () => {
  const payload = `{
  "example": "cdk-menu-standalone-menu",
  "file": "cdk-menu-standalone-menu-example.html"
  }`;
  const out = parseExampleTag(payload);
  assert.equal(out.example, 'cdk-menu-standalone-menu');
  assert.equal(out.file, 'cdk-menu-standalone-menu-example.html');
  assert.equal(out.region, undefined);
});

// Fixture real: angular/components@21.0.2 src/cdk/menu/menu.md
test('parseExampleTag: JSON de uma linha com region', () => {
  const payload =
    '{"example":"cdk-menu-standalone-menu",\n' +
    '              "file":"cdk-menu-standalone-menu-example.html",\n' +
    '              "region":"trigger"}';
  const out = parseExampleTag(payload);
  assert.equal(out.example, 'cdk-menu-standalone-menu');
  assert.equal(out.file, 'cdk-menu-standalone-menu-example.html');
  assert.equal(out.region, 'trigger');
});

test('parseExampleTag: nome com quebra de linha e sem chave -> nome simples colapsado (whitespace vira espaço único)', () => {
  const out = parseExampleTag('nao\nexiste');
  assert.deepEqual(out, { example: 'nao existe' });
});

test('parseExampleTag: JSON malformado cai para nome colapsado tolerante (não quebra)', () => {
  const out = parseExampleTag('{ "example": "foo", }'); // vírgula sobrando invalida o JSON
  assert.equal(typeof out.example, 'string');
  assert.ok(!out.example.includes('\n'), 'fallback tolerante não deve conter quebra de linha');
});

test('parseExampleTag: JSON sem file/region deixa os dois undefined', () => {
  const out = parseExampleTag('{"example":"badge-overview"}');
  assert.deepEqual(out, { example: 'badge-overview', file: undefined, region: undefined });
});
