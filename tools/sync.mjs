import { writeFile } from 'node:fs/promises';
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
    currentHashes[name] = hashContent(s.prose + JSON.stringify(s.examples));
  }
  const manifest = await readManifest(manifestPath);
  const changed = changedSources(manifest, currentHashes);
  for (const name of changed) {
    const s = fetched[name];
    const md = distill({ name, category: s.category, prose: s.prose, examples: s.examples, tag });
    await writeFile(join(refsDir, `${name}.md`), md, 'utf8');
    manifest.perFile[name] = currentHashes[name];
  }
  manifest.generatedTag = tag;
  await writeManifest(manifestPath, manifest);
  return { changed, total: Object.keys(fetched).length };
}

function parseTag(argv) {
  const i = argv.indexOf('--to');
  if (i === -1 || !argv[i + 1]) {
    console.error('uso: node tools/sync.mjs --to <tag>   (ex.: --to 18.2.0 ou --to main)');
    process.exit(2);
  }
  return argv[i + 1];
}

// Executa como CLI quando chamado diretamente.
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const repoRoot = join(dirname(fileURLToPath(import.meta.url)), '..');
  const tag = parseTag(process.argv.slice(2));
  const refsDir = join(repoRoot, 'skills', 'angular-material', 'references');
  const manifestPath = join(repoRoot, 'manifest.json');
  const { changed, total } = await runSync({ tag, sources: SOURCES, rawGet: httpRawGet, refsDir, manifestPath });
  console.log(`sync ${tag}: ${changed.length}/${total} refs regenerados` + (changed.length ? `: ${changed.join(', ')}` : ''));
}
