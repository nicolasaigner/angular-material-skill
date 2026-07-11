import { createHash } from 'node:crypto';
import { readFile, writeFile } from 'node:fs/promises';
import { UPSTREAM_REPO } from './upstream.mjs';

export function hashContent(str) {
  return createHash('sha256').update(str, 'utf8').digest('hex').slice(0, 16);
}

export function emptyManifest() {
  return { upstreamRepo: UPSTREAM_REPO, generatedTag: null, perFile: {} };
}

export async function readManifest(path) {
  try {
    return JSON.parse(await readFile(path, 'utf8'));
  } catch (err) {
    if (err.code === 'ENOENT') return emptyManifest();
    throw err;
  }
}

export async function writeManifest(path, manifest) {
  await writeFile(path, JSON.stringify(manifest, null, 2) + '\n', 'utf8');
}

export function changedSources(manifest, currentHashes) {
  const changed = [];
  for (const [name, hash] of Object.entries(currentHashes)) {
    if (manifest.perFile[name] !== hash) changed.push(name);
  }
  return changed;
}
