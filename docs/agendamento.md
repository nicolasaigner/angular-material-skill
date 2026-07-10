# Agendar o notificador de release

O `tools/check-release.mjs` compara a última release do `angular/components` com a
tag registrada no `manifest.json`. Ele **não commita nada** — só avisa. Sai com
código `10` quando está atrasado e `0` quando está em dia, para um agendador reagir.

## Windows (Task Scheduler)

Rodar diariamente no diretório do repo:

```powershell
$action  = New-ScheduledTaskAction -Execute "node" -Argument "tools\check-release.mjs" -WorkingDirectory "C:\Users\Nicolas\[redacted]\PROJETOS\angular-material-skill"
$trigger = New-ScheduledTaskTrigger -Daily -At 9am
Register-ScheduledTask -TaskName "angular-material-skill-check" -Action $action -Trigger $trigger -Description "Avisa se saiu release novo do angular/components"
```

Exit `10` = atrasado (o agendador pode disparar notificação). Ao ver o aviso:

```powershell
npm run sync -- <tag>     # regenera só os refs que mudaram
git diff                   # revise
git commit -am "sync: angular/components <tag>"
```

## LXC/homelab (cron)

Alternativa que mantém o PC de fora do loop: cron diário chamando `check-release.mjs`
e, no exit `10`, mandar aviso (arquivo/webhook/notify).

## ⚠️ Limitação: rate-limit da API do GitHub

`check-release.mjs` consulta a **REST API** do GitHub
(`api.github.com/repos/angular/components/releases/latest`). Sem autenticação, a API
tem limite de 60 req/hora por IP e **pode devolver HTTP 403** em redes compartilhadas
ou sob rate-limit — foi o que ocorreu no ambiente de desenvolvimento inicial.

Mitigações (por ordem de robustez):

1. **Token:** exportar `GITHUB_TOKEN` e enviar no header `Authorization: Bearer` eleva
   o limite para 5000 req/hora. (Melhoria de backlog: fazer o `httpApiGet` ler o env.)
2. **`git ls-remote --tags`:** descobrir a última tag pelo protocolo git, sem a REST API:
   ```bash
   git ls-remote --tags --refs https://github.com/angular/components.git \
     | awk -F/ '{print $NF}' | grep -E '^[0-9]+\.[0-9]+\.[0-9]+$' \
     | sort -t. -k1,1n -k2,2n -k3,3n | tail -1
   ```
   Depois: `npm run sync -- <tag>`.

## Publicação

O repositório é publicado no GitHub público (`nicolasaigner/angular-material-skill`,
MIT) e espelhado no [redacted] privado. Ver `README.md` para instalação pelo consumidor.
