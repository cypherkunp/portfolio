# Portfolio Project

A modern portfolio website built as a monorepo using Next.js 16, React 19, and TypeScript.

## Project Structure

```
portfolio/
├── apps/www/          # Next.js 16 web application (main site)
├── packages/ui/       # Shared React component library (shadcn/ui based)
├── packages/utils/    # Utility functions and logging
└── tools/unlighthouse/ # Performance monitoring
```

## Tech Stack

- **Framework**: Next.js 16 with App Router
- **UI**: React 19, Tailwind CSS 4, Radix UI, shadcn/ui
- **Content**: MDX with Fumadocs
- **Build**: Turborepo + PNPM workspaces
- **Language**: TypeScript

## Commands

### Development

```bash
pnpm dev              # Start dev server on port 3333
pnpm build            # Build all packages and apps
pnpm start            # Start production server
pnpm clean            # Clean all build artifacts
```

### Code Quality

```bash
pnpm lint             # Run ESLint
pnpm lint:fix         # Run ESLint with auto-fix
pnpm format:write     # Format code with Prettier
pnpm format:check     # Check code formatting
```

### UI Components

```bash
pnpm ui:add <component>  # Add shadcn/ui component to packages/ui
```

### Performance

```bash
pnpm --filter www analyze-build    # Analyze bundle size
pnpm --filter www unlighthouse-ci  # Run Lighthouse tests
```

## Key Configuration

- **Node**: >= 24.0.0 (check `.nvmrc`)
- **Package Manager**: PNPM 9.1.1
- **Dev Port**: 3333

## Environment Variables

| Variable              | Description                                      |
| --------------------- | ------------------------------------------------ |
| `NEXT_PUBLIC_APP_URL` | Application URL (default: http://localhost:3000) |
| `GITHUB_ACCESS_TOKEN` | GitHub API access token                          |

## Code Style

- ESLint v9 flat config (`eslint.config.mjs`)
- Prettier with Tailwind plugin
- Conventional Commits (enforced by commitlint)
- Pre-commit hooks via Husky

## App Structure (apps/www/src/)

```
src/
├── app/           # Next.js App Router pages
├── components/    # App-specific components
├── config/        # Configuration files
├── content/       # MDX content
├── hooks/         # Custom React hooks
├── i18n/          # Internationalization
├── lib/           # Utility functions
└── styles/        # Global styles
```
