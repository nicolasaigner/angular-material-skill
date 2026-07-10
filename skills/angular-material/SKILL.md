---
name: angular-material
description: Use ao trabalhar com Angular Material ou CDK nos temas cobertos pela v1 desta skill — button (MatButton, FAB, icon-button), form-field (mat-form-field, labels, hints, erros), table (mat-table, ordenação, paginação), dialog (MatDialog), CDK overlay, e theming/Material 3 (tokens de cor e tipografia). Dispara em "Angular Material", "mat-button", "mat-form-field", "mat-table", "MatDialog", "CDK overlay" ou "theming do Material". Mais componentes serão adicionados em versões futuras.
---

# Angular Material

Skill que ensina a usar o **Angular Material** e o **Angular CDK** seguindo a
documentação oficial (`angular/components`), com foco em uso correto, exemplos e
acessibilidade. Conteúdo gerado e sincronizado por tag — ver atribuição em cada arquivo.

## Como usar
1. Identifique o componente/guia relevante ao pedido.
2. Abra o `references/<nome>.md` correspondente (mapa em `references/_index.md`).
3. Siga a prosa + exemplos; respeite as seções de acessibilidade.

## Referências disponíveis
Consulte `references/_index.md` para a lista completa. Fatia atual:

| Referência | O que cobre |
| --- | --- |
| [button](references/button.md) | Botões, FAB, icon-button, estados |
| [form-field](references/form-field.md) | Wrapper de campos, labels, hints, erros |
| [table](references/table.md) | mat-table, colunas, ordenação, paginação |
| [dialog](references/dialog.md) | MatDialog, abertura, dados, retorno |
| [cdk-overlay](references/cdk-overlay.md) | Overlay do CDK (base de menus/tooltips) |
| [theming](references/theming.md) | Theming, Material 3, tokens de cor/tipografia |

## Atualização
Esta skill é gerada por `tools/`. Para sincronizar com um release novo do upstream:
`npm run check-release` (avisa) → `npm run sync -- --to <tag>` (regenera o que mudou).
