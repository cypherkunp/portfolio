# @repo/ui

The design system for every workspace app: shadcn/Aceternity primitives, generic components, layout shell, hooks, tokens, and fonts. Consumed as source; there is no build step.

## Imports

Subpath imports only. There is no barrel.

```ts
import { Button } from '@repo/ui/components/button';
import { Section } from '@repo/ui/components/layout/section';
import { useIsMobile } from '@repo/ui/hooks/use-mobile';
import { geistMono } from '@repo/ui/lib/fonts';
import { cn } from '@repo/ui/lib/utils';
```

Inside the package, never use `@/`: it resolves against the consuming app. Use relative imports, or `@repo/ui/...` self-imports (what `pnpm ui:add` writes).

## New workspace app

1. Add the dependency: `"@repo/ui": "workspace:*"`.
2. In `next.config.ts`, set `transpilePackages: ['@repo/ui']`.
3. In the app stylesheet, import the design system first. Add app-only rules after it:

   ```css
   @import '@repo/ui/styles.css';
   ```

4. In the root layout, apply the font and canvas, and wrap in the theme provider:

   ```tsx
   import { ThemeProvider } from '@repo/ui/components/theme-provider';
   import { geistMono } from '@repo/ui/lib/fonts';

   <html className={`${geistMono.className} antialiased`} suppressHydrationWarning>
     <body className="bg-app-dots">
       <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
         {children}
       </ThemeProvider>
     </body>
   </html>;
   ```

5. Copy `apps/www/components.json` so the shadcn CLI resolves `ui` and `utils` to this package.

Route view transitions need `experimental.viewTransition` in `next.config.ts` for `RouteViewTransition`.

## Add a primitive

```sh
pnpm ui:add <component>
```

## Test

```sh
pnpm --filter @repo/ui test
```
