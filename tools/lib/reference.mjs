// tools/lib/reference.mjs
function titleCase(name) {
  return name.split('-').map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
}

export function officialUrl(name, category) {
  return category === 'guide'
    ? `https://material.angular.dev/guide/${name}`
    : `https://material.angular.dev/components/${name}/overview`;
}

export function referenceHeader({ name, category, tag }) {
  const url = officialUrl(name, category);
  return [
    `<!-- GENERATED por angular-material-skill a partir de angular/components@${tag}. NÃO editar à mão. -->`,
    '',
    `# ${titleCase(name)}`,
    '',
    `> Fonte: [documentação oficial](${url}) — derivado de ` +
      `[\`angular/components\`](https://github.com/angular/components) (${tag}), licença MIT. Ver NOTICE.`,
    '',
    '',
  ].join('\n');
}
