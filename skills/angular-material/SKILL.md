---
name: angular-material
description: Use ao construir UI com Angular Material ou Angular CDK — qualquer componente mat-* (button, form-field, input, select, autocomplete, table, paginator, sort, dialog, bottom-sheet, snack-bar, menu, tabs, stepper, expansion, sidenav, toolbar, list, card, chips, datepicker, timepicker, slider, checkbox, radio, slide-toggle, tooltip, badge, progress-bar/spinner, icon, tree, etc.), theming/Material 3 e tokens de cor/tipografia, harnesses de teste e acessibilidade, além do Angular CDK (overlay, drag-drop, a11y, portal, scrolling, layout, menu, listbox, dialog, table, tree, clipboard, text-field). Dispara em "Angular Material", "mat-", "MatDialog", "CDK", "theming do Material".
---

# Angular Material

Skill que ensina a usar o **Angular Material** e o **Angular CDK** seguindo a
documentação oficial (`angular/components`), com foco em uso correto, exemplos e
acessibilidade. Conteúdo gerado e sincronizado por tag — ver atribuição em cada arquivo.

## Como usar
1. Abra `references/_index.md` — o mapa completo, agrupado em **Material**, **CDK** e **Guias**.
2. Abra o `references/<nome>.md` do componente/guia relevante (CDK usa o prefixo `cdk-`).
3. Siga a prosa + exemplos; respeite as seções de acessibilidade.

## Cobertura
Todos os componentes Material, todos os do CDK e os guias globais (theming, getting-started,
schematics, harnesses, etc.) da tag gerada. A lista viva está em `references/_index.md`.

## Atualização
Gerada por `tools/`. Para sincronizar com um release novo do upstream:
`npm run check-release` (avisa) → `npm run discover -- --to <tag>` (redescobre as fontes) →
`npm run sync -- <tag>` (regenera o que mudou) → `node tools/gen-index.mjs`.
