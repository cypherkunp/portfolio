/**
 * Allow browser POSTs from our own origin. In development, allow anything so
 * local tooling keeps working. Missing Origin/Referer is denied in production.
 */
export function isAllowedRequestOrigin(request: Request): boolean {
  if (process.env.NODE_ENV === 'development') return true;

  const appUrl = process.env.NEXT_PUBLIC_APP_URL;
  if (!appUrl) return false;

  let allowedOrigin: string;
  try {
    allowedOrigin = new URL(appUrl).origin;
  } catch {
    return false;
  }

  const origin = request.headers.get('origin');
  if (origin) return origin === allowedOrigin;

  const referer = request.headers.get('referer');
  if (referer) {
    try {
      return new URL(referer).origin === allowedOrigin;
    } catch {
      return false;
    }
  }

  return false;
}
