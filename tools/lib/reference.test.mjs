// tools/lib/reference.test.mjs
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { officialUrl } from './reference.mjs';
import { SOURCES } from './sources.mjs';

test('officialUrl de componente comum aponta para /components/<name>/overview', () => {
  assert.equal(officialUrl('button', 'component'), 'https://material.angular.dev/components/button/overview');
});

test('officialUrl de componente cdk-* aponta para /cdk/<name>/overview (sem o prefixo cdk-)', () => {
  assert.equal(officialUrl('cdk-overlay', 'component'), 'https://material.angular.dev/cdk/overlay/overview');
});

test('officialUrl de guia aponta para /guide/<name>', () => {
  assert.equal(officialUrl('theming', 'guide'), 'https://material.angular.dev/guide/theming');
});

test('todo source em SOURCES resolve para uma URL sob material.angular.dev', () => {
  for (const s of SOURCES) {
    const url = officialUrl(s.name, s.category);
    assert.ok(
      url.startsWith('https://material.angular.dev/'),
      `officialUrl(${s.name}, ${s.category}) deveria começar com https://material.angular.dev/, recebeu ${url}`,
    );
  }
});
