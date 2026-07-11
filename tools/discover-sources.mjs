// tools/discover-sources.mjs
import { writeFile } from 'node:fs/promises';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { UPSTREAM_REPO } from './lib/upstream.mjs';

const MATERIAL = /^src\/material\/([a-z0-9-]+)\/([a-z0-9-]+)\.md$/;
const CDK = /^src\/cdk\/([a-z0-9-]+)\/([a-z0-9-]+)\.md$/;
const GUIDE = /^guides\/([a-z0-9-]+)\.md$/;

export function deriveSource(path) {
  let m;
  if ((m = MATERIAL.exec(path)) && m[1] === m[2]) {
    return { name: m[1], category: 'component', prosePath: path, examplesDir: `src/components-examples/material/${m[1]}` };
  }
  if ((m = CDK.exec(path)) && m[1] === m[2]) {
    return { name: `cdk-${m[1]}`, category: 'component', prosePath: path, examplesDir: `src/components-examples/cdk/${m[1]}` };
  }
  if ((m = GUIDE.exec(path))) {
    return { name: m[1], category: 'guide', prosePath: path };
  }
  return null;
}

export async function discoverSources(tag, treeGet) {
  const paths = await treeGet(tag);
  const sources = [];
  const seen = new Set();
  for (const p of paths) {
    const s = deriveSource(p);
    if (!s) continue;
    if (seen.has(s.name)) throw new Error(`Nome de source duplicado: ${s.name}`);
    seen.add(s.name);
    sources.push(s);
  }
  sources.sort((a, b) => (a.name < b.name ? -1 : a.name > b.name ? 1 : 0));
  return sources;
}

export async function treeGetGitHub(tag, { fetchImpl = fetch, env = process.env, retries = 3 } = {}) {
  const url = `https://api.github.com/repos/${UPSTREAM_REPO}/git/trees/${tag}?recursive=1`;
  const headers = { 'User-Agent': 'angular-material-skill', Accept: 'application/vnd.github+json' };
  if (env.GITHUB_TOKEN) headers.Authorization = `Bearer ${env.GITHUB_TOKEN}`;
  for (let attempt = 1; ; attempt++) {
    try {
      const res = await fetchImpl(url, { headers });
      if (!res.ok) throw new Error(`GET ${url} → HTTP ${res.status}`);
      const json = await res.json();
      if (json.truncated) throw new Error('árvore truncada pela API — descoberta por subárvore não implementada');
      return json.tree.filter((n) => n.type === 'blob').map((n) => n.path);
    } catch (err) {
      if (attempt >= retries) throw err;
      await new Promise((r) => setTimeout(r, 500 * attempt));
    }
  }
}

function parseTag(argv) {
  const i = argv.indexOf('--to');
  if (i !== -1 && argv[i + 1]) return argv[i + 1];
  const positional = argv.find((a) => !a.startsWith('-'));
  return positional || null;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const tag = parseTag(process.argv.slice(2));
  if (!tag) {
    console.error('uso: node tools/discover-sources.mjs --to <tag>');
    process.exit(2);
  }
  const sources = await discoverSources(tag, (t) => treeGetGitHub(t));
  const out = join(dirname(fileURLToPath(import.meta.url)), 'lib', 'sources.generated.json');
  const payload = { upstreamRepo: UPSTREAM_REPO, discoveredTag: tag, sources };
  await writeFile(out, JSON.stringify(payload, null, 2) + '\n', 'utf8');
  console.log(`discover ${tag}: ${sources.length} sources → tools/lib/sources.generated.json`);
}
