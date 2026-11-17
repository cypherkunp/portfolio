import { decryptOverrides, reportValue, type FlagDefinitionType } from 'flags';

interface FlagDecideParams {
  key: string;
  defaultValue?: unknown;
  headers: Headers;
  cookies: { get(name: string): string | undefined };
}

interface FlagDefinition {
  key: string;
  description?: string;
  defaultValue?: unknown;
  options?: unknown;
  adapter?: unknown;
  origin?: unknown;
}

function readCookie(header: string | null, name: string) {
  if (!header) return undefined;
  const match = header
    .split(';')
    .map(part => part.trim())
    .find(part => part.startsWith(`${name}=`));
  if (!match) return undefined;
  return decodeURIComponent(match.slice(name.length + 1));
}

export type KeyedFlagDefinitionType = { key: string } & FlagDefinitionType;

export function flag<Value>(definition: FlagDefinition) {
  const read = async () => {
    const key = definition.key;
    const fallback = definition.defaultValue as Value;

    try {
      const { getRequest } = await import('@tanstack/react-start/server');
      const raw = readCookie(getRequest().headers.get('cookie'), 'vercel-flag-overrides');
      if (raw && process.env.FLAGS_SECRET) {
        const overrides = await decryptOverrides(raw);
        if (overrides && Object.prototype.hasOwnProperty.call(overrides, key)) {
          const value = overrides[key] as Value;
          reportValue(key, value);
          return value;
        }
      }
    } catch {
      // No Start request, or the overrides cookie is not for this process.
    }

    const adapter = definition.adapter as
      | { decide?: (params: FlagDecideParams) => Promise<unknown> | unknown }
      | undefined;

    if (adapter?.decide) {
      try {
        const value = await adapter.decide({
          key,
          defaultValue: definition.defaultValue,
          headers: new Headers(),
          cookies: { get: () => undefined },
        });
        if (value !== undefined) {
          reportValue(key, value);
          return value as Value;
        }
      } catch {
        // Unlinked local dev has no FLAGS datafile. Use the declared default.
      }
    }

    reportValue(key, fallback);
    return fallback;
  };

  return Object.assign(read, definition);
}
