# angular-material-skill

An **Agent Skill** that teaches an AI coding agent to use **Angular Material** and the
**Angular CDK** the way the official docs prescribe — correct APIs, real examples, and
accessibility guidance — instead of guessing or hallucinating component usage.

The skill's content is **generated deterministically** from the official
[`angular/components`](https://github.com/angular/components) repository and kept in sync
with upstream releases. Nothing is hand-written or AI-invented: every reference is distilled
from the upstream Markdown for a specific version tag, with attribution in each file.

It follows the [Agent Skills](https://agentskills.io) open standard (a `SKILL.md` plus
supporting reference files), so it works with Claude Code and any other tool that adopts the
standard.

## What's inside

```
skills/angular-material/     ← the skill (this is what you install)
  SKILL.md                   ← frontmatter (name + description) + how-to-use
  references/
    _index.md                ← the map: grouped into Material / CDK / Guides
    <component>.md            ← one distilled reference per component/guide
tools/                       ← the deterministic generation/sync pipeline (for maintainers)
```

**Coverage:** the full slice of `angular/components` at the generated tag — **68 references**
(36 Material components + 22 CDK modules + 10 global guides). The living list is in
[`skills/angular-material/references/_index.md`](skills/angular-material/references/_index.md).
Current tag: **21.0.2** (compatible with the Angular Material 21.x line).

## Install (Claude Code)

A skill is just a folder (`SKILL.md` + `references/`). Drop it into a skills directory:

**Per project** — the skill applies only inside that repo:

```bash
git clone https://github.com/nicolasaigner/angular-material-skill
mkdir -p your-project/.claude/skills
cp -r angular-material-skill/skills/angular-material your-project/.claude/skills/
```

**Per user** — the skill applies across all your projects:

```bash
cp -r angular-material-skill/skills/angular-material ~/.claude/skills/
```

That's it. The agent loads the skill **automatically** when it detects Angular Material / CDK
work (the `description` frontmatter drives the trigger), or you can invoke it explicitly with
`/angular-material`.

> Other agents that adopt the Agent Skills standard use the same folder; consult your tool's
> docs for its skills directory.

## How the agent uses it

1. Opens `references/_index.md` — the map, grouped into **Material**, **CDK**, and **Guides**.
2. Opens the `references/<name>.md` for the relevant component or guide (CDK entries use the
   `cdk-` prefix, e.g. `cdk-overlay.md`).
3. Follows the prose + inlined examples and respects the accessibility sections.

Because each reference is loaded on demand, the skill adds almost no context cost until the
agent actually needs a given component.

## Keeping it in sync with upstream

**Automatic:** the GitHub Actions workflow
[`.github/workflows/sync-upstream.yml`](.github/workflows/sync-upstream.yml) runs weekly,
detects a new `angular/components` release, regenerates the affected references, and **opens a
Pull Request** with the diff ready for review. It uses the runner's built-in `GITHUB_TOKEN` —
no extra secret required.

**Manual** (for maintainers, from a clone):

```bash
npm run check-release            # warns if a newer upstream release exists (exit 10 = behind)
npm run discover -- --to <tag>   # re-discovers upstream sources → sources.generated.json
npm run sync -- <tag>            # regenerates only the references whose content changed
node tools/gen-index.mjs         # regenerates the grouped _index.md
git diff                         # review (the JSON diff surfaces new/removed components)
git commit -am "sync: angular/components <tag>"
```

## Maintainer setup

- Node 22 (see `.nvmrc`) via [fnm](https://github.com/Schniz/fnm) or nvm; npm.
- No runtime dependencies — the pipeline uses only Node's standard library.
- `npm test` runs the suite (`node --test`); the pipeline is deterministic and its network
  access is injected, so tests run offline.
- Scheduling the release notifier locally: see [`docs/scheduling.md`](docs/scheduling.md).

## License & attribution

MIT (see [`LICENSE`](LICENSE)). The reference content is derived from
[`angular/components`](https://github.com/angular/components) (also MIT) — see
[`NOTICE`](NOTICE) and the attribution header in each generated reference.
