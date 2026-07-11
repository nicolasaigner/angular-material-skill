# angular-material-skill

Skill de IA para **Angular Material**, gerada e mantida em sincronia com o
repositório oficial [`angular/components`](https://github.com/angular/components).

- `skills/angular-material/` — a skill (SKILL.md + references/).
- `tools/` — pipeline determinístico de geração/sync.

## Status
Em construção (v1: pipeline + fatia vertical). Instruções de instalação: ver Task 9.

## Licença
MIT. Documentação derivada de `angular/components` (MIT) — ver `NOTICE`.

## Instalação (Claude Code)

Copie a pasta da skill para o diretório de skills do seu agente:

```bash
# Claude Code (usuário)
cp -r skills/angular-material ~/.claude/skills/
```

Ou clone o repo e crie um symlink. Depois, o agente passa a disparar a skill
`angular-material` automaticamente ao trabalhar com Angular Material/CDK.

## Manter atualizado

Manual:

    npm run check-release              # avisa se saiu release novo (exit 10 = atrasado)
    npm run discover -- --to <tag>     # redescobre as fontes do upstream → sources.generated.json
    npm run sync -- <tag>              # regenera só os refs que mudaram
    node tools/gen-index.mjs           # regenera o _index.md agrupado
    git diff                            # revise (inclui componentes novos/órfãos no JSON)
    git commit -am "sync: angular/components <tag>"

Automático: o workflow `.github/workflows/sync-upstream.yml` roda semanalmente,
detecta release novo e **abre um Pull Request** com o diff pronto para revisão.
Defina `GITHUB_TOKEN` (o Actions injeta o nativo) — nenhum segredo extra é necessário.
