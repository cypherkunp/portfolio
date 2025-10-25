# Using @repo/ui Design System

## Overview

The UI components are now centralized in `packages/ui` as a shared design system that can be used across all projects in the Turbo monorepo.

## Import Components

### Method 1: Direct Component Imports (Recommended)

Import components directly from the UI package:

```typescript
import { Button } from '@repo/ui/components/button'
import { Card, CardHeader, CardTitle, CardContent } from '@repo/ui/components/card'
import { Input } from '@repo/ui/components/input'
```

### Method 2: Named Exports

You can also import multiple components at once:

```typescript
import { Button, Card, Input, Dialog } from '@repo/ui'
// Note: Some components with naming conflicts may need direct imports
```

### Method 3: Star Import from Specific Paths

For cleaner imports, you can import from component folders:

```typescript
// Button with variants
import { Button, buttonVariants } from '@repo/ui/components/button'

// Form components
import { Form, FormField, FormItem, FormLabel, FormControl } from '@repo/ui/components/form'
```

## Add Styles

Import the UI package styles in your app's main CSS file or layout:

```typescript
// app/layout.tsx or globals.css
import '@repo/ui/styles.css'
```

This will include all the CSS variables and Tailwind utilities needed for the components.

## Example: Using in Next.js App

### 1. Update `apps/portfolio/tailwind.config.ts`

Make sure your Tailwind config includes the UI package:

```typescript
import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/**/*.{ts,tsx,mdx}",
    // Add this line to include UI package components
    "../../packages/ui/src/**/*.{ts,tsx}",
  ],
  // ... rest of config
};
```

### 2. Import Styles in your app

```typescript
// apps/portfolio/src/styles/globals.css
@tailwind base;
@tailwind components;
@tailwind utilities;

/* Import UI package styles */
@import '@repo/ui/styles.css';
```

### 3. Use Components in your app

```typescript
// apps/portfolio/src/app/page.tsx
import { Button } from '@repo/ui/components/button'
import { Card, CardHeader, CardTitle, CardContent } from '@repo/ui/components/card'
import { Input } from '@repo/ui/components/input'

export default function HomePage() {
  return (
    <main>
      <Card>
        <CardHeader>
          <CardTitle>Welcome</CardTitle>
        </CardHeader>
        <CardContent>
          <Input placeholder="Enter your name" />
          <Button>Submit</Button>
        </CardContent>
      </Card>
    </main>
  )
}
```

## Adding New Components

To add a new component to the design system:

### Option 1: Use shadcn CLI

```bash
cd packages/ui
pnpm ui:add button
```

### Option 2: Manual addition

1. Add the component file to `packages/ui/src/components/`
2. Export it in `packages/ui/src/index.ts`
3. Update any component dependencies to use relative imports (e.g., `./button` instead of `@/components/ui/button`)

## Important Notes

1. **Next.js Components**: Some components like `card-hover-effect` and `link-preview` use Next.js specific features (e.g., `next/link`, `next/image`). These will only work in Next.js apps.

2. **Shared Dependencies**: The UI package includes all its dependencies. Peer dependencies like React are shared.

3. **Hooks**: Some components reference hooks (e.g., `use-mobile`, `use-toast`). Make sure to include these hooks in your app or create wrapper components.

4. **Styling Conflicts**: If you have existing components in your app with the same names, use direct imports to avoid conflicts.

## Package Structure

```
packages/ui/
├── src/
│   ├── components/      # All UI components
│   ├── lib/            # Utilities (cn function)
│   ├── styles/         # Global styles and CSS variables
│   └── index.ts        # Main export file
├── components.json     # shadcn configuration
├── tailwind.config.ts  # Tailwind config for the package
└── package.json        # Package configuration
```

## Component Import Reference

### Core Components

- `@repo/ui/components/button` - Button with variants
- `@repo/ui/components/card` - Card container
- `@repo/ui/components/input` - Text input
- `@repo/ui/components/textarea` - Text area
- `@repo/ui/components/select` - Dropdown select
- `@repo/ui/components/checkbox` - Checkbox
- `@repo/ui/components/radio-group` - Radio buttons
- `@repo/ui/components/switch` - Toggle switch

### Overlays

- `@repo/ui/components/dialog` - Modal dialog
- `@repo/ui/components/sheet` - Side sheet
- `@repo/ui/components/drawer` - Bottom drawer
- `@repo/ui/components/popover` - Popover
- `@repo/ui/components/tooltip` - Tooltip
- `@repo/ui/components/alert-dialog` - Confirmation dialog

### Navigation

- `@repo/ui/components/dropdown-menu` - Dropdown menu
- `@repo/ui/components/navigation-menu` - Nav menu
- `@repo/ui/components/menubar` - Menu bar
- `@repo/ui/components/sidebar` - Sidebar
- `@repo/ui/components/tabs` - Tabs

### Feedback

- `@repo/ui/components/toast` - Toast notifications
- `@repo/ui/components/toaster` - Toast container
- `@repo/ui/components/alert` - Alert message
- `@repo/ui/components/progress` - Progress bar
- `@repo/ui/components/skeleton` - Loading skeleton

### Data Display

- `@repo/ui/components/table` - Table
- `@repo/ui/components/carousel` - Carousel
- `@repo/ui/components/chart` - Charts (using recharts)
- `@repo/ui/components/avatar` - Avatar
- `@repo/ui/components/badge` - Badge
- `@repo/ui/components/calendar` - Date picker

### Form Components

- `@repo/ui/components/form` - Form wrapper
- `@repo/ui/components/field` - Form field
- `@repo/ui/components/input-group` - Input with buttons
- `@repo/ui/components/command` - Command palette

### Utilities

- `@repo/ui/lib/utils` - Utility functions (cn for class merging)
- `@repo/ui/components/collapsible` - Collapsible content
- `@repo/ui/components/separator` - Divider
- `@repo/ui/components/scroll-area` - Scrollable container
- `@repo/ui/components/resizable` - Resizable panels

## Troubleshooting

### Import Errors

If you get "Cannot find module" errors, make sure:

1. `@repo/ui` is listed in your app's `package.json` dependencies
2. You've run `pnpm install` after adding the dependency
3. The component export exists in `packages/ui/src/index.ts`

### Styling Issues

If components look unstyled:

1. Check that `@repo/ui/styles.css` is imported
2. Verify Tailwind config includes the UI package paths
3. Make sure CSS variables are loaded

### Type Errors

If you get TypeScript errors:

1. Rebuild the UI package: `cd packages/ui && pnpm install`
2. Clear Next.js cache: `rm -rf .next`
3. Restart your dev server
