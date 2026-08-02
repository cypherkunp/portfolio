import { z } from 'zod';

/** Interactive analyzer payloads stay well under this. */
export const MAX_PACKAGES = 200;

// Names allowed by npm: scoped or unscoped, limited charset.
const VALID_NAME = /^(?:@[a-z0-9][\w.-]*\/)?[a-z0-9][\w.-]*$/i;

export function isValidPackageName(name: string): boolean {
  return typeof name === 'string' && name.length > 0 && name.length <= 214 && VALID_NAME.test(name);
}

export const PackageInputSchema = z.object({
  name: z
    .string()
    .min(1)
    .max(214)
    .refine(isValidPackageName, { message: 'invalid npm package name' }),
  version: z.string().max(64).default(''),
});

export const NpmBodySchema = z.object({
  packages: z.array(PackageInputSchema).min(1).max(MAX_PACKAGES),
});

export type NpmBody = z.infer<typeof NpmBodySchema>;

/** Dedupe by name; keep the first configured version seen. */
export function dedupePackagesByName(
  packages: Array<{ name: string; version: string }>,
): Map<string, string> {
  const versionByName = new Map<string, string>();
  for (const pkg of packages) {
    if (!versionByName.has(pkg.name)) versionByName.set(pkg.name, pkg.version);
  }
  return versionByName;
}
