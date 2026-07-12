// tools/lib/upstream.mjs
// Single source of truth for the upstream repo name. Lives OUTSIDE sources.mjs
// so discover doesn't depend on the generated JSON (which it produces itself).
export const UPSTREAM_REPO = 'angular/components';
