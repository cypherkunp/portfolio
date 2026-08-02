import { lookup } from 'node:dns/promises';
import { isIP } from 'node:net';

export class UnsafeUrlError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'UnsafeUrlError';
  }
}

const BLOCKED_HOSTNAMES = new Set([
  'localhost',
  'metadata.google.internal',
  'metadata.goog',
  'kubernetes.default',
  'kubernetes.default.svc',
]);

function normalizeHostname(hostname: string): string {
  return hostname.replace(/^\[|\]$/g, '').toLowerCase();
}

/** IPv4 literals in private, loopback, link-local, CGNAT, or reserved ranges. */
export function isPrivateIpv4(ip: string): boolean {
  const parts = ip.split('.').map(part => Number(part));
  if (parts.length !== 4 || parts.some(n => !Number.isInteger(n) || n < 0 || n > 255)) {
    return false;
  }

  const [a, b] = parts;
  if (a === 0 || a === 10 || a === 127) return true;
  if (a === 169 && b === 254) return true;
  if (a === 172 && b >= 16 && b <= 31) return true;
  if (a === 192 && b === 168) return true;
  if (a === 100 && b >= 64 && b <= 127) return true; // CGNAT
  if (a === 192 && b === 0 && (parts[2] === 0 || parts[2] === 2)) return true;
  if (a === 198 && (b === 18 || b === 19)) return true; // benchmarking
  if (a >= 224) return true; // multicast / reserved
  return false;
}

/** IPv6 literals that must not be fetched server-side. */
export function isPrivateIpv6(ip: string): boolean {
  const normalized = ip.toLowerCase();
  if (normalized === '::' || normalized === '::1') return true;
  if (normalized.startsWith('fc') || normalized.startsWith('fd')) return true; // ULA
  if (normalized.startsWith('fe80:')) return true; // link-local
  if (normalized.startsWith('ff')) return true; // multicast

  // IPv4-mapped / IPv4-compatible
  const v4Mapped = normalized.match(/^(?::0*:)?ffff:(.+)$/i) ?? normalized.match(/^::ffff:(.+)$/i);
  if (v4Mapped?.[1]) {
    const mapped = v4Mapped[1].includes('.')
      ? v4Mapped[1]
      : (() => {
          const hex = v4Mapped[1].split(':');
          if (hex.length !== 2) return null;
          const hi = parseInt(hex[0], 16);
          const lo = parseInt(hex[1], 16);
          if (Number.isNaN(hi) || Number.isNaN(lo)) return null;
          return `${(hi >> 8) & 255}.${hi & 255}.${(lo >> 8) & 255}.${lo & 255}`;
        })();
    if (mapped && isPrivateIpv4(mapped)) return true;
  }

  return false;
}

export function isPrivateIp(ip: string): boolean {
  const version = isIP(ip);
  if (version === 4) return isPrivateIpv4(ip);
  if (version === 6) return isPrivateIpv6(ip);
  return false;
}

function assertHostnameAllowed(hostname: string): void {
  const host = normalizeHostname(hostname);

  if (!host) throw new UnsafeUrlError('Missing hostname.');
  if (BLOCKED_HOSTNAMES.has(host)) throw new UnsafeUrlError('Blocked hostname.');
  if (host.endsWith('.localhost') || host.endsWith('.local') || host.endsWith('.internal')) {
    throw new UnsafeUrlError('Blocked hostname suffix.');
  }

  const ipVersion = isIP(host);
  if (ipVersion && isPrivateIp(host)) {
    throw new UnsafeUrlError('Private or reserved IP address.');
  }
}

/** Sync checks: scheme, credentials, obvious private hosts/IPs. */
export function assertPublicHttpUrl(urlString: string): URL {
  let url: URL;
  try {
    url = new URL(urlString);
  } catch {
    throw new UnsafeUrlError('Invalid URL.');
  }

  if (url.protocol !== 'http:' && url.protocol !== 'https:') {
    throw new UnsafeUrlError('Only http(s) URLs are allowed.');
  }
  if (url.username || url.password) {
    throw new UnsafeUrlError('URLs with credentials are not allowed.');
  }

  assertHostnameAllowed(url.hostname);
  return url;
}

/** Resolve DNS and reject if any answer is private/reserved. */
export async function assertSafeFetchUrl(urlString: string): Promise<URL> {
  const url = assertPublicHttpUrl(urlString);
  const host = normalizeHostname(url.hostname);

  if (isIP(host)) return url;

  let addresses: Array<{ address: string }>;
  try {
    addresses = await lookup(host, { all: true, verbatim: true });
  } catch {
    throw new UnsafeUrlError('Could not resolve hostname.');
  }

  if (addresses.length === 0) {
    throw new UnsafeUrlError('Could not resolve hostname.');
  }

  for (const { address } of addresses) {
    if (isPrivateIp(address)) {
      throw new UnsafeUrlError('Hostname resolves to a private or reserved IP.');
    }
  }

  return url;
}
