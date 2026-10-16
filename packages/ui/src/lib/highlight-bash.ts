import { codeToHtml } from 'shiki';

function escapeHtml(text: string): string {
  return text.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');
}

/** Bash highlight for server-rendered terminals. Falls back to escaped text. */
export async function highlightBash(command: string): Promise<string> {
  const trimmed = command.trim();
  try {
    const html = await codeToHtml(trimmed, {
      lang: 'bash',
      theme: 'github-dark',
    });
    const match = html.match(/<pre[^>]*><code[^>]*>([\s\S]*?)<\/code><\/pre>/);
    return match?.[1] ?? escapeHtml(trimmed);
  } catch {
    return escapeHtml(trimmed);
  }
}
