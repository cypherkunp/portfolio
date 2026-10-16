export const NEXT_PUBLIC_APP_URL = process.env.NEXT_PUBLIC_APP_URL;

export function absoluteUrl(path?: string) {
  return `${NEXT_PUBLIC_APP_URL}${path}`;
}
