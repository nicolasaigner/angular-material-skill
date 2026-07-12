# Scheduling the release notifier

`tools/check-release.mjs` compares the latest `angular/components` release with the
tag recorded in `manifest.json`. It **doesn't commit anything** — it just warns. It exits with
code `10` when behind and `0` when up to date, so a scheduler can react.

## Windows (Task Scheduler)

Run daily from the repo directory:

```powershell
$action  = New-ScheduledTaskAction -Execute "node" -Argument "tools\check-release.mjs" -WorkingDirectory "<repo-path>"
$trigger = New-ScheduledTaskTrigger -Daily -At 9am
Register-ScheduledTask -TaskName "angular-material-skill-check" -Action $action -Trigger $trigger -Description "Warns when a new angular/components release is out"
```

Exit `10` = behind (the scheduler can fire a notification). On seeing the warning:

```powershell
npm run sync -- <tag>     # regenerates only the refs that changed
git diff                   # review
git commit -am "sync: angular/components <tag>"
```

## LXC/homelab (cron)

An alternative that keeps the PC out of the loop: a daily cron job calling `check-release.mjs`
and, on exit `10`, sending a notification (file/webhook/notify).

## ⚠️ Limitation: GitHub API rate limit

`check-release.mjs` queries the GitHub **REST API**
(`api.github.com/repos/angular/components/releases/latest`). Unauthenticated, the API
has a limit of 60 req/hour per IP and **can return HTTP 403** on shared networks
or under rate-limiting — which is what happened in the initial development environment.

Mitigations (in order of robustness):

1. **Token:** exporting `GITHUB_TOKEN` raises the limit to 5000 req/hour — `check-release.mjs`
   already reads the env (via `buildApiHeaders`) and sends the
   `Authorization: Bearer` header automatically when the variable is set.
2. **`git ls-remote --tags`:** discover the latest tag over the git protocol, without the REST API:
   ```bash
   git ls-remote --tags --refs https://github.com/angular/components.git \
     | awk -F/ '{print $NF}' | grep -E '^[0-9]+\.[0-9]+\.[0-9]+$' \
     | sort -t. -k1,1n -k2,2n -k3,3n | tail -1
   ```
   Then: `npm run sync -- <tag>`.
