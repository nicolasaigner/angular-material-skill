// tools/lib/distill.mjs
import { referenceHeader } from './reference.mjs';

const EXAMPLE_TAG = /<!--\s*example\(([^)]+)\)\s*-->/g;

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
  return referenceHeader({ name, category, tag }) + body.trimEnd() + '\n';
}
