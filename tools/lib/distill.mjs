// tools/lib/distill.mjs
import { referenceHeader } from './reference.mjs';
import { EXAMPLE_TAG_PATTERN, parseExampleTag } from './example-tag.mjs';
import { stripDocregionMarkers, extractRegion } from './docregion.mjs';

const EXAMPLE_TAG = new RegExp(EXAMPLE_TAG_PATTERN, 'g');

function extForFile(file) {
  const m = /\.(ts|html|css)$/.exec(file || '');
  return m ? m[1] : null;
}

function exampleHeading({ example, file, region }) {
  let heading = `#### Exemplo: \`${example}\``;
  if (file) heading += ` — \`${file}\``;
  if (region) heading += ` (região \`${region}\`)`;
  return heading;
}

function notFound(label, extra) {
  return `> _(exemplo \`${label}\`${extra ? ` ${extra}` : ''} não encontrado no upstream)_`;
}

// Renders one `<!-- example(...) -->` occurrence. `parsed` is the result of
// parseExampleTag (plain name, or JSON with optional file/region); `ex` is the
// fetched {ts?, html?, css?} for that example name (or undefined/null if the
// example itself wasn't found upstream).
function renderExample(parsed, ex) {
  const label = (parsed.example || '').toString();
  if (!ex) return notFound(label);

  if (parsed.file) {
    const ext = extForFile(parsed.file);
    const raw = ext ? ex[ext] : null;
    if (!raw) return notFound(label, `(arquivo \`${parsed.file}\`)`);

    let code;
    if (parsed.region) {
      code = extractRegion(raw, parsed.region).trim();
      if (!code) return notFound(label, `(região \`${parsed.region}\` de \`${parsed.file}\`)`);
    } else {
      code = stripDocregionMarkers(raw).trim();
    }
    return [exampleHeading(parsed), '', '```' + ext, code, '```'].join('\n').trimEnd();
  }

  const blocks = [exampleHeading(parsed), ''];
  if (ex.ts) blocks.push('```ts', stripDocregionMarkers(ex.ts).trim(), '```', '');
  if (ex.html) blocks.push('```html', stripDocregionMarkers(ex.html).trim(), '```', '');
  if (ex.css) blocks.push('```css', stripDocregionMarkers(ex.css).trim(), '```', '');
  return blocks.join('\n').trimEnd();
}

// True when the prose already contains its own top-level `# ` heading,
// wherever it appears (not just at the very start - e.g. after a <style>
// block), while ignoring `## ` (H2+) and any `# ` found inside a fenced code
// block (so a shell comment in an example doesn't suppress the template
// title).
function hasOwnH1(prose) {
  let inFence = false;
  for (const line of prose.split('\n')) {
    if (/^\s*```/.test(line)) {
      inFence = !inFence;
      continue;
    }
    if (inFence) continue;
    if (/^#(?!#)\s/.test(line)) return true;
  }
  return false;
}

export function distill({ name, category, prose, examples, tag }) {
  const body = prose.replace(EXAMPLE_TAG, (_, payload) => {
    const parsed = parseExampleTag(payload);
    return renderExample(parsed, examples[parsed.example]);
  });
  const includeTitle = !hasOwnH1(prose);
  return referenceHeader({ name, category, tag, includeTitle }) + body.trimEnd() + '\n';
}
