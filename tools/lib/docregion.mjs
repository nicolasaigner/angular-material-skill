// tools/lib/docregion.mjs
// Pure helpers for the `#docregion`/`#enddocregion` build-tool markers used by
// angular/components example files (HTML uses `<!-- #docregion x -->`, TS/CSS
// use `// #docregion x`). Zero deps, deterministic.

// A marker line contains nothing but the marker itself (region name(s) and, for
// the HTML/CSS-block forms, the closing `-->`/`*/`). Matches both the docregion
// and enddocregion forms, the `//`, `<!-- -->` and `/* */` comment styles (CSS
// example files use the block-comment form), and variable internal spacing.
const MARKER_LINE_RE = /^[ \t]*(?:\/\/|<!--|\/\*)[ \t]*#(?:end)?docregion\b.*$/;

// Region tokens on a marker line may be space- and/or comma-separated
// (angular/components allows `#docregion a, b`). Strips a trailing HTML `-->`
// or block-comment `*/` closer before splitting.
function regionTokens(rest) {
  return rest
    .replace(/--+>\s*$/, '')
    .replace(/\*+\/\s*$/, '')
    .split(/[\s,]+/)
    .map((s) => s.trim())
    .filter(Boolean);
}

function findRegionMarkers(code, kind, region) {
  const re = new RegExp(`^[ \\t]*(?:\\/\\/|<!--|\\/\\*)[ \\t]*#${kind}\\b([^\\n]*)$`, 'gm');
  const markers = [];
  let m;
  while ((m = re.exec(code)) !== null) {
    if (regionTokens(m[1]).includes(region)) {
      markers.push({ start: m.index, end: m.index + m[0].length });
    }
  }
  return markers;
}

// Removes every #docregion/#enddocregion marker LINE (whole line, in either
// comment style), leaving all other lines - including blank lines and
// indentation - untouched.
export function stripDocregionMarkers(code) {
  return code
    .split('\n')
    .filter((line) => !MARKER_LINE_RE.test(line))
    .join('\n');
}

// Returns just the content between `#docregion <region>` and
// `#enddocregion <region>` (marker lines themselves excluded). Repeated blocks
// with the same region name are concatenated in order of appearance. Any
// OTHER region's markers nested inside are also stripped, since the result
// must never contain a marker line. Returns '' when the region isn't found.
export function extractRegion(code, region) {
  const starts = findRegionMarkers(code, 'docregion', region);
  const ends = findRegionMarkers(code, 'enddocregion', region);
  if (!starts.length || !ends.length) return '';

  let out = '';
  let endCursor = 0;
  for (const s of starts) {
    while (endCursor < ends.length && ends[endCursor].start < s.end) endCursor++;
    if (endCursor >= ends.length) break;
    const e = ends[endCursor];
    out += code.slice(s.end, Math.max(s.end, e.start - 1));
    endCursor++;
  }
  return stripDocregionMarkers(out);
}
