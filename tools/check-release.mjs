import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { readManifest } from './lib/manifest.mjs';

export async function checkRelease({ manifestPath, apiGet }) {
  const manifest = await readManifest(manifestPath);
  const latest = await apiGet('https://api.github.com/repos/angular/components/releases/latest');
  return { current: manifest.generatedTag, latest: latest.tag_name, behind: latest.tag_name !== manifest.generatedTag };
}

async function httpApiGet(url) {
  const res = await fetch(url, { headers: { 'User-Agent': 'angular-material-skill', Accept: 'application/vnd.github+json' } });
  if (!res.ok) throw new Error(`GET ${url} → HTTP ${res.status}`);
  return await res.json();
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const repoRoot = join(dirname(fileURLToPath(import.meta.url)), '..');
  const manifestPath = join(repoRoot, 'manifest.json');
  const r = await checkRelease({ manifestPath, apiGet: httpApiGet });
  if (r.behind) {
    console.log(`⚠️  angular/components ${r.latest} disponível (skill gerada em ${r.current}). Rode: npm run sync -- ${r.latest}`);
    process.exit(10);
  } else {
    console.log(`✅ em dia com ${r.latest}`);
    process.exit(0);
  }
}
