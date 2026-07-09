export const UPSTREAM_REPO = 'angular/components';

export const SOURCES = [
  { name: 'button',      category: 'component', prosePath: 'src/material/button/button.md',        examplesDir: 'src/components-examples/material/button' },
  { name: 'form-field',  category: 'component', prosePath: 'src/material/form-field/form-field.md', examplesDir: 'src/components-examples/material/form-field' },
  { name: 'table',       category: 'component', prosePath: 'src/material/table/table.md',           examplesDir: 'src/components-examples/material/table' },
  { name: 'dialog',      category: 'component', prosePath: 'src/material/dialog/dialog.md',         examplesDir: 'src/components-examples/material/dialog' },
  { name: 'cdk-overlay', category: 'component', prosePath: 'src/cdk/overlay/overlay.md',            examplesDir: 'src/components-examples/cdk/overlay' },
  { name: 'theming',     category: 'guide',     prosePath: 'guides/theming.md' },
];

export function getSource(name) {
  const found = SOURCES.find((s) => s.name === name);
  if (!found) throw new Error(`Source desconhecido: ${name}`);
  return found;
}
