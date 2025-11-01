export const NEXT_PUBLIC_APP_URL = process.env.NEXT_PUBLIC_APP_URL;

//SERVER SIDE ENV VARIABLES
export const GITHUB_ACCESS_TOKEN = process.env.GITHUB_ACCESS_TOKEN;

export function absoluteUrl(path?: string) {
  return `${NEXT_PUBLIC_APP_URL}${path}`;
}
