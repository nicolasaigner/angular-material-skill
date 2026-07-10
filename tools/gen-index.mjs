import { writeFile } from 'node:fs/promises';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { SOURCES } from './lib/sources.mjs';

export function renderIndex(sources) {
  const rows = sources
    .slice()
    .sort((a, b) => (a.name < b.name ? -1 : a.name > b.name ? 1 : 0))
    .map((s) => `| [${s.name}](./${s.name}.md) | ${s.category} |`)
    .join('\n');
  return ['<!-- GENERATED. NÃO editar à mão. -->', '', '# Índice', '', '| Referência | Categoria |', '| --- | --- |', rows, ''].join('\n');
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const repoRoot = join(dirname(fileURLToPath(import.meta.url)), '..');
  const out = join(repoRoot, 'skills', 'angular-material', 'references', '_index.md');
  await writeFile(out, renderIndex(SOURCES), 'utf8');
  console.log(`_index.md escrito com ${SOURCES.length} referências`);
}
