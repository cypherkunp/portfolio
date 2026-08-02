# Portfolio Project

A modern portfolio website built as a monorepo using Next.js 16, React 19, and TypeScript.

## Project Structure

```
portfolio/
├── .agents/           # Skills, MCP servers, plugins, rules, plans (source of truth)
├── apps/www/          # Next.js 16 web application (main site)
├── packages/ui/       # Shared React component library (shadcn/ui based)
├── packages/utils/    # Utility functions and logging
└── tools/unlighthouse/ # Performance monitoring
```

## Agent config

Put skills, rules, MCP servers, plugins, and plans in **`.agents/`**. See [`.agents/README.md`](.agents/README.md).

Do not recreate `.cursor/` for agent config. Canonical rule copies also live in [`.agents/rules/`](.agents/rules/).

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
- **Package Manager**: PNPM 10.31.0
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

## Project rules

You are an expert in TypeScript, Node.js, Next.js App Router, React, Shadcn UI, Radix UI and Tailwind.

### Code style and structure

- Write concise, technical TypeScript code with accurate examples.
- Use functional and declarative programming patterns; avoid classes.
- Prefer iteration and modularization over code duplication.
- Use descriptive variable names with auxiliary verbs (e.g., isLoading, hasError).
- Structure files: exported component, subcomponents, helpers, static content, types.

### Naming conventions

- Use lowercase with dashes for directories (e.g., components/auth-wizard).
- Favor named exports for components.

### TypeScript usage

- Use TypeScript for all code; prefer interfaces over types.
- Avoid enums; use maps instead.
- Use functional components with TypeScript interfaces.

### Syntax and formatting

- Use the "function" keyword for pure functions.
- Avoid unnecessary curly braces in conditionals; use concise syntax for simple statements.
- Use declarative JSX.

### UI and styling

- Use Shadcn UI, Radix, and Tailwind for components and styling.
- Implement responsive design with Tailwind CSS; use a mobile-first approach.

### Performance optimization

- Minimize 'use client', 'useEffect', and 'setState'; favor React Server Components (RSC).
- Wrap client components in Suspense with fallback.
- Use dynamic loading for non-critical components.
- Optimize images: use WebP format, include size data, implement lazy loading.

### Key conventions

- Use 'nuqs' for URL search parameter state management.
- Optimize Web Vitals (LCP, CLS, FID).
- Limit 'use client':
  - Favor server components and Next.js SSR.
  - Use only for Web API access in small components.
  - Avoid for data fetching or state management.

Follow Next.js docs for Data Fetching, Rendering, and Routing.

## Writing

Apply especially for markdown, MDX, blog posts, and user-facing copy.

### Voice and tone

- Write like humans speak. Avoid corporate jargon and marketing fluff.
- Be confident and direct. Avoid softening phrases like "I think," "maybe," or "could."
- Use active voice instead of passive voice.
- Use positive phrasing: say what something is rather than what it is not.
- Say "you" more than "we" when addressing external audiences.
- Use contractions like "I'll," "won't," and "can't" for a warmer tone.

### Specificity and evidence

- Be specific with facts and data instead of vague superlatives.
- Back up claims with concrete examples or metrics.
- Highlight customers and community members over company achievements.
- Use realistic, product-based examples instead of 'foo/bar/baz' in code.
- Make content concrete, visual, and falsifiable.

### Title creation

- Make a promise in the title so readers know exactly what they'll get if they click.
- Tap into controversial points your audience holds and back them up with data (use wisely, avoid clickbait).
- Share something uniquely helpful that makes readers better at meaningful aspects of their lives.
- Avoid vague titles like "My Thoughts On XYZ." Titles should be opinions or shareable facts.
- Write placeholder titles first, complete the content, then spend time iterating on titles at the end.

### Banned words

- 'a bit' → remove
- 'a little' → remove
- 'actually/actual' → remove
- 'agile' → remove
- 'arguably' → remove
- 'assistance' / "help" (prefer concrete verbs)
- 'attempt' / "try"
- 'battle tested' → remove
- 'best practices' → "proven approaches"
- 'blazing fast' / 'lightning fast' → "build X faster"
- 'business logic' → remove
- 'cognitive load' → remove
- 'commence' → "start"
- 'delve' → "go into"
- 'disrupt/disruptive' → remove
- 'facilitate' → "help" or "ease"
- 'game-changing' → specific benefit
- 'great' → remove or be specific
- 'implement' → "do"
- 'individual' → "man" or "woman"
- 'initial' → "first"
- 'innovative' → remove
- 'just' → remove
- 'leverage' → "use"
- 'mission-critical' → "important"
- 'modern/modernized' → remove
- 'numerous' → "many"
- 'out of the box' → remove
- 'performant' → "fast and reliable"
- 'pretty/quite/rather/really/very' → remove
- 'referred to as' → "called"
- 'remainder' → "rest"
- 'robust' → "strong"
- 'seamless/seamlessly' → "automatic"
- 'sufficient' → "enough"
- 'that' → often removable, context dependent
- 'thing' → be specific
- 'utilize' → "use"
- 'webinar' → "online event"

### Avoid LLM patterns

- Replace em dashes with semicolons, commas, or sentence breaks.
- Avoid starting responses with "Great question" or "Let me help you."
- Don't use phrases like "Let's dive into..."
- Skip cliché intros like "In today's fast-paced digital world" or "In the ever-evolving landscape of."
- Avoid phrases like "it's not just [x], it's [y]."
- Avoid self-referential disclaimers like "As an AI" or "I'm here to help you with."
- Don't use high-school essay closers: "In conclusion," "Overall," or "To summarize."
- Avoid numbered lists in cases where bullets work better.
- Don't end with "Hope this helps!" or similar closers.
- Avoid overusing transition words like "Furthermore," "Additionally," or "Moreover."
- Replace "In conclusion" with direct statements.
- Avoid hedge words: "might," "perhaps," "potentially" unless uncertainty is real.
- Don't stack hedging phrases: "may potentially," "it's important to note that."
- Don't create perfectly symmetrical paragraphs or lists that start with "Firstly... Secondly...."
- Avoid title-case headings; prefer sentence casing.
- Remove Unicode artifacts when copy-pasting: smart quotes, em dashes, non-breaking spaces.
- Use `*` instead of `***`.
- Delete empty citation placeholders like "[1]" with no actual source.

### Punctuation and formatting

- Use Oxford commas consistently.
- Use exclamation points sparingly.
- Sentences can start with "But" and "And", but don't overuse.
- Use periods instead of commas when possible for clarity.
