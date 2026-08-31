# `.agents` (source of truth)

Use **`.agents/`** for all project agent config. There is no `.cursor/` directory in this repo.

| Kind | Path | Notes |
| --- | --- | --- |
| Skills | `.agents/skills/<name>/SKILL.md` | Cursor loads `.agents/skills/` natively |
| Rules | `.agents/rules/` | Canonical rule files |
| Always-on rules | `AGENTS.md` (repo root only) | What Cursor injects every session. Never put `AGENTS.md` inside a skill. |
| MCP servers | `.agents/mcp.json` | Source of truth |
| Plugins | `.agents/plugins.json` | Enabled marketplace plugins |
| Plans | `.agents/plans/` | Plan artifacts |

## Compat shim

- `.mcp.json` → `.agents/mcp.json` (Claude Code / root MCP convention)

Edit `.agents` files. Leave the symlink alone.

## Adding new stuff

1. **Skill**: `.agents/skills/<skill-name>/SKILL.md`
2. **Rule**: add under `.agents/rules/` with `alwaysApply: false`, then mirror into root `AGENTS.md` if it should always apply. Cursor always-injects every `AGENTS.md` it finds, including ones nested under skills.
3. **MCP**: add under `mcpServers` in `.agents/mcp.json`
4. **Plugin**: update `.agents/plugins.json`

Do not recreate `.cursor/` for skills, rules, MCP, plugins, or plans.
