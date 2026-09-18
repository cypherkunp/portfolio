# Portfolio

Personal site: landing page, MDX blog, music player, photo gallery, print-friendly CV, and a package dependency analyzer. Deployed on Vercel.

## Architecture

Turborepo monorepo with PNPM workspaces:

| Path | Role |
| --- | --- |
| `apps/www` | Next.js 16 App Router app (main site) |
| `packages/ui` | Shared UI (shadcn/Radix, Tailwind) |
| `packages/utils` | Shared utilities |
| `tools/unlighthouse` | Lighthouse CI config |

The app favors React Server Components, `next-intl` for copy, and a small client surface where the browser APIs need it.

## Stack

Next.js 16, React 19, TypeScript, Tailwind CSS 4, ESLint 9 (flat config), Prettier, Husky, Commitlint.

## Features

- **Content**: MDX posts under `apps/www/src/content/posts`, dynamic `[slug]` routes.
- **Sections**: About, music, photos; optional homepage apps block behind `FEATURE_APPS_SUPPORT`.
- **UX**: Dark-first theming, responsive layout, Vercel Analytics and Speed Insights.
- **Analyzer** (`/analyzer`): upload a `package.json`, pull metadata from the npm registry, compare versions.
- **Tooling**: Webpack bundle analyzer (`analyze-build`), Unlighthouse target for `www`.

## Development

Requires Node ≥24 and `pnpm@10.31.0` (see `packageManager` in root `package.json`).

```bash
pnpm install
pnpm dev    # www on http://localhost:3333
pnpm build
pnpm lint
```

Shared UI: `pnpm ui:add <component>` adds to `packages/ui`.

## Environment

- `FEATURE_APPS_SUPPORT=true`: shows the homepage apps section (see `apps/www/src/flags.ts`).
