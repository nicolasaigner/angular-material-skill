import { writeFile } from 'node:fs/promises';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { SOURCES } from './lib/sources.mjs';

export function renderIndex(sources) {
  const byName = (a, b) => (a.name < b.name ? -1 : a.name > b.name ? 1 : 0);
  const material = sources.filter((s) => s.category === 'component' && !s.name.startsWith('cdk-'));
  const cdk = sources.filter((s) => s.name.startsWith('cdk-'));
  const guides = sources.filter((s) => s.category === 'guide');
  const section = (title, list) => {
    if (!list.length) return [];
    const rows = list.slice().sort(byName).map((s) => `| [${s.name}](./${s.name}.md) |`).join('\n');
    return [`## ${title} (${list.length})`, '', '| Referência |', '| --- |', rows, ''];
  };
  return [
    '<!-- GENERATED. NÃO editar à mão. -->', '', '# Índice', '',
    ...section('Material', material),
    ...section('CDK', cdk),
    ...section('Guias', guides),
  ].join('\n');
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const repoRoot = join(dirname(fileURLToPath(import.meta.url)), '..');
  const out = join(repoRoot, 'skills', 'angular-material', 'references', '_index.md');
  await writeFile(out, renderIndex(SOURCES), 'utf8');
  console.log(`_index.md escrito com ${SOURCES.length} referências`);
}
