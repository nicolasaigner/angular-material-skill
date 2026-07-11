import { writeFile, mkdir } from 'node:fs/promises';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { SOURCES } from './lib/sources.mjs';
import { fetchSources, httpRawGet } from './lib/fetch-upstream.mjs';
import { distill } from './lib/distill.mjs';
import { hashContent, readManifest, writeManifest, changedSources } from './lib/manifest.mjs';

export async function runSync({ tag, sources, rawGet, refsDir, manifestPath }) {
  const fetched = await fetchSources(tag, sources, rawGet);
  const currentHashes = {};
  for (const [name, s] of Object.entries(fetched)) {
    // NB: o hash cobre o conteúdo BUSCADO (prosa + exemplos), não a saída do distill().
    // Uma mudança só na lógica do distill (sem bump do upstream) NÃO dispara regeneração;
    // nesse caso, limpe manifest.perFile para forçar um regen completo. O workflow
    // sync-upstream dispara em release novo (conteúdo muda → hash muda), então não é afetado.
    currentHashes[name] = hashContent(s.prose + JSON.stringify(s.examples));
  }
  const manifest = await readManifest(manifestPath);
  const changed = changedSources(manifest, currentHashes);
  if (changed.length) await mkdir(refsDir, { recursive: true });
  for (const name of changed) {
    const s = fetched[name];
    const md = distill({ name, category: s.category, prose: s.prose, examples: s.examples, tag });
    await writeFile(join(refsDir, `${name}.md`), md, 'utf8');
    manifest.perFile[name] = currentHashes[name];
  }
  if (Object.keys(fetched).length > 0) manifest.generatedTag = tag;
  await writeManifest(manifestPath, manifest);
  return { changed, total: Object.keys(fetched).length };
}

export function parseTag(argv) {
  const i = argv.indexOf('--to');
  if (i !== -1 && argv[i + 1]) return argv[i + 1];
  const positional = argv.find((a) => !a.startsWith('-'));
  return positional || null;
}

// Executa como CLI quando chamado diretamente.
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const repoRoot = join(dirname(fileURLToPath(import.meta.url)), '..');
  const tag = parseTag(process.argv.slice(2));
  if (!tag) {
    console.error('uso: npm run sync -- <tag>   (ou: node tools/sync.mjs --to <tag>)');
    process.exit(2);
  }
  const refsDir = join(repoRoot, 'skills', 'angular-material', 'references');
  const manifestPath = join(repoRoot, 'manifest.json');
  const { changed, total } = await runSync({ tag, sources: SOURCES, rawGet: httpRawGet, refsDir, manifestPath });
  console.log(`sync ${tag}: ${changed.length}/${total} refs regenerados` + (changed.length ? `: ${changed.join(', ')}` : ''));
}
