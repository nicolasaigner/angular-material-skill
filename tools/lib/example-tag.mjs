// Shared source pattern for the `<!-- example(name) -->` doc tags.
// Tolerates the 3-dash `<!--- example(x) --->` variant some upstream docs use.
// Each consumer compiles its OWN RegExp('g') so no stateful lastIndex is shared
// across .replace/.matchAll call sites.
export const EXAMPLE_TAG_PATTERN = '<!--[-\\s]*example\\(([^)]+)\\)[-\\s]*-->';
