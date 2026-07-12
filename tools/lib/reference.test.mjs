// tools/lib/reference.test.mjs
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { officialUrl } from './reference.mjs';
import { SOURCES } from './sources.mjs';

test('officialUrl of a regular component points to /components/<name>/overview', () => {
  assert.equal(officialUrl('button', 'component'), 'https://material.angular.dev/components/button/overview');
});

test('officialUrl of a cdk-* component points to /cdk/<name>/overview (without the cdk- prefix)', () => {
  assert.equal(officialUrl('cdk-overlay', 'component'), 'https://material.angular.dev/cdk/overlay/overview');
});

test('officialUrl of a guide points to /guide/<name>', () => {
  assert.equal(officialUrl('theming', 'guide'), 'https://material.angular.dev/guide/theming');
});

test('every source in SOURCES resolves to a URL under material.angular.dev', () => {
  for (const s of SOURCES) {
    const url = officialUrl(s.name, s.category);
    assert.ok(
      url.startsWith('https://material.angular.dev/'),
      `officialUrl(${s.name}, ${s.category}) should start with https://material.angular.dev/, got ${url}`,
    );
  }
});
