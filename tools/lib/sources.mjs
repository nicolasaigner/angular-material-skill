import sourcesData from './sources.generated.json' with { type: 'json' };
export { UPSTREAM_REPO } from './upstream.mjs';

export const SOURCES = sourcesData.sources;

export function getSource(name) {
  const found = SOURCES.find((s) => s.name === name);
  if (!found) throw new Error(`Unknown source: ${name}`);
  return found;
}
