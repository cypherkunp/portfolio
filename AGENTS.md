# Portfolio

Next.js 16 monorepo (`apps/www`). Agent config lives in `.agents/` only.

- **UI** — `.impeccable.md`. Landing (`/`) is the visual source of truth.
- **Design system** — `@repo/ui` (`packages/ui`) owns primitives, generic components, tokens, and fonts. Add shared UI there (`pnpm ui:add <name>`), never in an app. New workspace app: `packages/ui/README.md`.
- **Code** — `.agents/rules/project-rules.mdc`
- **Copy** — Posts: `.agents/skills/blog-author/SKILL.md`. Other prose: `/asd-ste100`.
- **Tests** — `.agents/rules/tdd.mdc`
- **Domain** — `CONTEXT.md` + `docs/adr/`
- **Issues** — `docs/agents/issue-tracker.md`

<!-- BEGIN:turborepo-agent-rules -->

# This is NOT the Turborepo you know

Turborepo configuration, task behavior, and CLI commands can vary between installed versions and may differ from your training data. Resolve the `turbo` package from this file's directory or relevant workspace; in monorepos, it may not be visible from the repository root. For example, run `node -p "require.resolve('turbo/package.json')"` from a workspace that depends on `turbo`.

Read `docs/README.md` inside that installed package first, then read the relevant pages from its `docs/` directory before changing Turborepo configuration or commands. Heed deprecation notices. These bundled docs match the installed package version and are available without network access.

This block is written and re-added by `turbo` before repository-scoped commands when an AI agent is detected. In the Turborepo source repository, its template is defined in `crates/turborepo-cli/src/cli/agent_guidance.rs`. Removing the managed block while updates are enabled means a later qualifying invocation will add it again. Set `"agentGuidance": false` in the root `turbo.json` or `turbo.jsonc` to opt out; this does not remove an existing block. Keep the block committed with your work to avoid an uncommitted change on the next agent invocation.
<!-- END:turborepo-agent-rules -->
