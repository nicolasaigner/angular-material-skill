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

    # Claude Code (usuário)
    cp -r skills/angular-material ~/.claude/skills/

Ou clone o repo e crie um symlink. Depois, o agente passa a disparar a skill
`angular-material` automaticamente ao trabalhar com Angular Material/CDK.

## Manter atualizado

    npm run check-release            # avisa se saiu release novo (exit 10 = atrasado)
    npm run sync -- <tag>            # regenera só os refs que mudaram
    git diff                          # revise
    git commit -am "sync: angular/components <tag>"

O `manifest.json` fixa a tag gerada. Nada é commitado automaticamente.
