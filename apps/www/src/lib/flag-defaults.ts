/** Opt-in local defaults — never imply "on" from NODE_ENV alone. */
export function resolveFlagDefaultValue(
  env: NodeJS.ProcessEnv | Record<string, string | undefined> = process.env,
): boolean {
  return env.FEATURE_APPS_DEV_DEFAULT === 'true';
}
