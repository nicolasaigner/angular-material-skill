# CLAUDE.md — angular-material-skill

Projeto público (MIT): skill de Angular Material gerada a partir de `angular/components`.

## [redacted]
Planejamento e memória centralizados em `~/[redacted]/[redacted]/[redacted]/`:
- Spec v1: `[redacted]/angular-material-skill.md`
- Plano v1 (entregue): `[redacted]/angular-material-skill-implementation.md`
- Spec v2: `docs/superpowers/specs/2026-07-11-angular-material-skill-v2-design.md`
- Plano v2 (a executar): `[redacted]/angular-material-skill-v2-implementation.md`

## ▶ [redacted] — v2 aprovado, pronto para implementar
O v1 (6 references) está entregue e publicado. O **v2** expande para cobertura completa
(~68 refs: 36 Material + 22 CDK + 10 guias), com descoberta automática de fontes e
auto-atualização por PR (GitHub Actions). Design e plano já escritos e aprovados (2026-07-11).

**Quando o [redacted] "vamos" (ou pedir para começar a implementação): execute o plano
`[redacted]/angular-material-skill-v2-implementation.md` via a skill
`superpowers:subagent-driven-development`, task por task (7 tasks, TDD).** Não refazer o
brainstorming — as 5 decisões já estão travadas no topo do spec v2. Tag de trabalho: `21.0.2`.

## Convenções
- Node 22 via fnm (`.nvmrc`), npm, ESM `.mjs`, zero deps de runtime.
- `npm test` = `node --test`. Pipeline determinístico, rede injetável nos testes.
- Publicação: GitHub público (origem) + [redacted] (mirror).
