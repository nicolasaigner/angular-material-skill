import { UPSTREAM_REPO } from './sources.mjs';
import { EXAMPLE_TAG_PATTERN } from './example-tag.mjs';

const EXAMPLE_TAG = new RegExp(EXAMPLE_TAG_PATTERN, 'g');

export function rawUrl(tag, path) {
  return `https://raw.githubusercontent.com/${UPSTREAM_REPO}/${tag}/${path}`;
}

export function extractExampleNames(prose) {
  const names = [];
  for (const m of prose.matchAll(EXAMPLE_TAG)) names.push(m[1].trim());
  return names;
}

async function fetchExample(tag, examplesDir, exName, rawGet) {
  const base = `${examplesDir}/${exName}/${exName}-example`;
  const [ts, html, css] = await Promise.all([
    rawGet(rawUrl(tag, `${base}.ts`)),
    rawGet(rawUrl(tag, `${base}.html`)),
    rawGet(rawUrl(tag, `${base}.css`)),
  ]);
  const ex = {};
  if (ts) ex.ts = ts;
  if (html) ex.html = html;
  if (css) ex.css = css;
  return Object.keys(ex).length ? ex : null;
}

export async function fetchSources(tag, sources, rawGet) {
  const out = {};
  for (const s of sources) {
    try {
      const prose = await rawGet(rawUrl(tag, s.prosePath));
      if (prose == null) {
        console.warn(`[fetch] pulando '${s.name}': prosa 404 em ${s.prosePath}`);
        continue;
      }
      const examples = {};
      if (s.examplesDir) {
        for (const exName of extractExampleNames(prose)) {
          let ex = null;
          try {
            ex = await fetchExample(tag, s.examplesDir, exName, rawGet);
          } catch (err) {
            console.warn(`[fetch] exemplo '${exName}' de '${s.name}' falhou: ${err.message}`);
          }
          if (ex) examples[exName] = ex;
          else console.warn(`[fetch] exemplo '${exName}' de '${s.name}' não encontrado`);
        }
      }
      out[s.name] = { category: s.category, prose, examples };
    } catch (err) {
      console.warn(`[fetch] falha em '${s.name}', pulando: ${err.message}`);
    }
  }
  return out;
}

export async function httpRawGet(url, { retries = 3 } = {}) {
  for (let attempt = 1; ; attempt++) {
    try {
      const res = await fetch(url);
      if (res.status === 404) return null;
      if (!res.ok) throw new Error(`GET ${url} → HTTP ${res.status}`);
      return await res.text();
    } catch (err) {
      if (attempt >= retries) throw err;
      await new Promise((r) => setTimeout(r, 500 * attempt));
    }
  }
}
