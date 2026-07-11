import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { appendFile } from 'node:fs/promises';
import { readManifest } from './lib/manifest.mjs';

export async function checkRelease({ manifestPath, apiGet }) {
  const manifest = await readManifest(manifestPath);
  const latest = await apiGet('https://api.github.com/repos/angular/components/releases/latest');
  return { current: manifest.generatedTag, latest: latest.tag_name, behind: latest.tag_name !== manifest.generatedTag };
}

export function buildApiHeaders(env = process.env) {
  const headers = { 'User-Agent': 'angular-material-skill', Accept: 'application/vnd.github+json' };
  if (env.GITHUB_TOKEN) headers.Authorization = `Bearer ${env.GITHUB_TOKEN}`;
  return headers;
}

export function formatActionsOutput({ latest, behind }) {
  return `latest=${latest}\nbehind=${behind}\n`;
}

async function httpApiGet(url) {
  const res = await fetch(url, { headers: buildApiHeaders() });
  if (!res.ok) throw new Error(`GET ${url} → HTTP ${res.status}`);
  return await res.json();
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const repoRoot = join(dirname(fileURLToPath(import.meta.url)), '..');
  const manifestPath = join(repoRoot, 'manifest.json');
  try {
    const r = await checkRelease({ manifestPath, apiGet: httpApiGet });
    if (process.env.GITHUB_OUTPUT) {
      await appendFile(process.env.GITHUB_OUTPUT, formatActionsOutput(r));
      console.log(`latest=${r.latest} behind=${r.behind}`);
      process.exit(0);
    }
    if (r.behind) {
      console.log(`⚠️  angular/components ${r.latest} disponível (skill gerada em ${r.current}). Rode: npm run sync -- ${r.latest}`);
      process.exit(10);
    }
    console.log(`✅ em dia com ${r.latest}`);
    process.exit(0);
  } catch (err) {
    console.error(`✖ não foi possível consultar a API do GitHub: ${err.message}`);
    console.error(`  Defina GITHUB_TOKEN para elevar o rate-limit. Ver docs/agendamento.md.`);
    process.exit(1);
  }
}
