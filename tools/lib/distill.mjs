// tools/lib/distill.mjs
import { referenceHeader } from './reference.mjs';
import { EXAMPLE_TAG_PATTERN } from './example-tag.mjs';

const EXAMPLE_TAG = new RegExp(EXAMPLE_TAG_PATTERN, 'g');

function renderExample(name, ex) {
  if (!ex) return `> _(exemplo \`${name}\` não encontrado no upstream)_`;
  const blocks = [`#### Exemplo: \`${name}\``, ''];
  if (ex.ts) blocks.push('```ts', ex.ts.trimEnd(), '```', '');
  if (ex.html) blocks.push('```html', ex.html.trimEnd(), '```', '');
  if (ex.css) blocks.push('```css', ex.css.trimEnd(), '```', '');
  return blocks.join('\n').trimEnd();
}

export function distill({ name, category, prose, examples, tag }) {
  const body = prose.replace(EXAMPLE_TAG, (_, exName) =>
    renderExample(exName.trim(), examples[exName.trim()]),
  );
  const includeTitle = !/^\s*#\s/.test(prose);
  return referenceHeader({ name, category, tag, includeTitle }) + body.trimEnd() + '\n';
}
