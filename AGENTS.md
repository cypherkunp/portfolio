# Portfolio

Next.js 16 monorepo (`apps/www`). Agent config lives in `.agents/` only.

- **UI** — `.impeccable.md`. Landing (`/`) is the visual source of truth.
- **Design system** — `@repo/ui` (`packages/ui`) owns primitives, generic components, tokens, and fonts. Add shared UI there (`pnpm ui:add <name>`), never in an app. New workspace app: `packages/ui/README.md`.
- **Code** — `.agents/rules/project-rules.mdc`
- **Copy** — `.agents/rules/writing.mdc`
- **Tests** — `.agents/rules/tdd.mdc`
- **Domain** — `CONTEXT.md` + `docs/adr/`
- **Issues** — `docs/agents/issue-tracker.md`
