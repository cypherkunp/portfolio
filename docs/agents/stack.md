# Stack

The public site is a TanStack Start app in `apps/www`. Vite builds it and serves it.

## Links, images, routes

An in-app path uses `AppLink` from `@repo/ui/lib/app-link`.
An image uses `@/components/image`.
Photo bytes are `GET /image`.
Routes live in `apps/www/src/routes`.

## Dependencies

`next-intl` imports resolve to `apps/www/src/shims`.
The `next-intl` npm package is not installed.
`next-themes` is the theme package. It stays.
`pnpm-workspace.yaml` sets the `next` override to `-`.
A `next` package in `node_modules` is a failed install.

## Checks

These checks failed open during the Next.js cutover. Keep them.

- ESLint `no-restricted-imports` rejects `next`, `next/*`, and `flags/next`.
- CI job `check` in `.github/workflows/test.yaml` runs lint, `tsc`, and `vite build` for `apps/www`.
- That job fails when `pnpm why next` prints a package.
- `@repo/ui` tests resolve every public file through `packages/ui/package.json` exports.
- Playwright requests `GET /connect` and `GET /contacts`. Each response is HTTP 308 to `https://devvrat.uk` and carries the security headers.
- A test that renders `AppLink` uses `renderWithRouter` from `apps/www/src/test/render-with-router.tsx`. The helper awaits `router.load()`.

## Skills

This repo has no Next.js skill.
React performance notes live in `.agents/skills/vercel-react-best-practices`.
Apply the React rules there.
Links and images follow this file.
