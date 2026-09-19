# Next.js 16 Migration Guide

## Changes Made

This document outlines all the changes made to migrate your portfolio from Next.js 15.2.3 to Next.js 16.

### 1. **Dependencies Updated**

#### Root `package.json`:

- `next`: `15.2.3` → `^16.0.0`
- `eslint-config-next`: `^15.2.3` → `^16.0.0`
- Added `@eslint/eslintrc`: `^2.0.0` (required for flat config)

#### App `apps/portfolio/package.json`:

- React & React-DOM: Already at `^19.0.0` (compatible)
- `babel-plugin-react-compiler`: Optional - for React Compiler optimizations

### 2. **Build Configuration Changes**

#### `apps/portfolio/next.config.js`:

```javascript
// New features enabled for v16:
cacheComponents: true,      // Replaces experimental.dynamicIO
reactCompiler: true,         // Enables React Compiler (auto-memoization)
turbopack: {},              // Turbopack is now default, moved out of experimental
```

**What these do:**

- `cacheComponents`: Enables automatic component caching for better performance
- `reactCompiler`: Automatically optimizes component re-renders
- `turbopack`: Now the default bundler (removed `--turbopack` flag from dev script)

### 3. **Lint Command Migration**

#### `apps/portfolio/package.json` scripts:

```diff
- "dev": "next dev --port 3333 --turbopack"
+ "dev": "next dev --port 3333"

- "lint": "next lint"
- "lint:fix": "next lint --fix"
+ "lint": "eslint ."
+ "lint:fix": "eslint --fix ."
```

**Why:** `next lint` command removed in v16. Use ESLint CLI directly.

### 4. **ESLint Configuration**

Created new `apps/portfolio/eslint.config.mjs` file:

- Uses flat config format (ESLint 9+)
- Extends Next.js recommended config
- Includes TypeScript support
- Proper ignores for build artifacts

```bash
npx eslint .                # Run linter
npx eslint --fix .          # Auto-fix issues
```

### 5. **Middleware → Proxy Migration**

#### `apps/portfolio/src/middleware.ts`:

```diff
- export function middleware(request: NextRequest) {
+ export function proxy(request: NextRequest) {
    // Your logic here
  }
```

**Note:** File can remain named `middleware.ts`. The function export changed from `middleware` to `proxy`.

### 6. **Breaking Changes Checked**

✅ No `next/legacy/image` usage (already using modern `next/image`)
✅ No deprecated `serverRuntimeConfig` or `publicRuntimeConfig`
✅ No `headers()` or `cookies()` sync calls (already async-ready)
✅ Image config uses `remotePatterns` (not deprecated `domains`)

### 7. **Optional: React Compiler**

To enable React Compiler auto-memoization:

```bash
npm install babel-plugin-react-compiler@latest
```

Already configured in `next.config.js`:

```javascript
reactCompiler: true,
```

## Testing the Migration

```bash
# Install dependencies
pnpm install

# Test development build
pnpm dev

# Test production build
pnpm build

# Run linter
pnpm lint

# Fix lint errors
pnpm lint:fix
```

## Key Improvements in v16

1. **Turbopack by default** - No need for `--turbopack` flag
2. **React Compiler** - Automatic component optimization
3. **Cache Components** - Improved PPR (Partial Pre-Rendering)
4. **ESLint Flat Config** - Direct ESLint usage instead of `next lint`
5. **Proxy function** - New routing model replacing middleware

## Documentation References

- [Next.js 16 Upgrade Guide](https://nextjs.org/docs/upgrading/version-16)
- [Turbopack Configuration](https://turbo.build/pack/docs)
- [React Compiler](https://react.dev/compiler)
- [ESLint Flat Config](https://eslint.org/docs/latest/use/configure/configuration-files-new)

## Common Issues & Solutions

### Issue: "next lint" command not found

**Solution:** Use `eslint .` or `pnpm lint` instead (already updated)

### Issue: Turbopack errors during build

**Solution:** Run `pnpm build --webpack` to opt-out temporarily and debug

### Issue: ESLint config errors

**Solution:** Ensure `eslint.config.mjs` is in the root of `apps/portfolio/`

## Rollback Instructions

If needed, revert to v15:

```bash
pnpm add -w next@15.2.3 eslint-config-next@15.2.3
# Change middleware export back to middleware()
```
