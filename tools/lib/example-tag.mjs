// Shared source pattern for the `<!-- example(name) -->` doc tags.
// Tolerates the 3-dash `<!--- example(x) --->` variant some upstream docs use.
// Each consumer compiles its OWN RegExp('g') so no stateful lastIndex is shared
// across .replace/.matchAll call sites.
export const EXAMPLE_TAG_PATTERN = '<!--[-\\s]*example\\(([^)]+)\\)[-\\s]*-->';

// Parses the payload captured by EXAMPLE_TAG_PATTERN's group 1 (the text between
// the tag's outer parens). Upstream `angular/components` docs use 3 shapes:
//   1. plain name          -> example(badge-overview)
//   2. JSON with "file"    -> example({"example": "x", "file": "x-example.html"})
//   3. JSON with "region"  -> example({"example": "x", "file": "...", "region": "y"})
// Tolerant: malformed JSON (or a plain name containing whitespace/newlines) falls
// back to a single-line collapsed name, never throws.
export function parseExampleTag(payload) {
  const trimmed = payload.trim();
  if (trimmed.startsWith('{')) {
    try {
      const obj = JSON.parse(trimmed);
      return { example: obj.example, file: obj.file, region: obj.region };
    } catch {
      // falls through to the plain-name fallback below
    }
  }
  return { example: trimmed.replace(/\s+/g, ' ').trim() };
}
