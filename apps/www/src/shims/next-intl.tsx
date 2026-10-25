import {
  createContext,
  useContext,
  type ReactNode,
} from 'react';

import en from '../../messages/en.json';

const MessagesContext = createContext<unknown>(en);

export function NextIntlClientProvider({
  messages = en,
  children,
}: {
  locale?: string;
  messages?: unknown;
  children: ReactNode;
}) {
  return <MessagesContext.Provider value={messages}>{children}</MessagesContext.Provider>;
}

function lookup(messages: unknown, path: string): unknown {
  return path.split('.').reduce<unknown>((acc, key) => {
    if (acc && typeof acc === 'object' && key in acc) {
      return (acc as Record<string, unknown>)[key];
    }
    return undefined;
  }, messages);
}

function interpolate(message: string, values?: Record<string, unknown>) {
  if (!values) return message;
  return message.replace(/\{(\w+)\}/g, (match, key) => {
    const value = values[key];
    if (value === undefined || typeof value === 'function') return match;
    return String(value);
  });
}

function renderRich(template: string, tags: Record<string, (chunks: string) => ReactNode>) {
  const parts: ReactNode[] = [];
  const pattern = /<(\w+)>(.*?)<\/\1>/g;
  let last = 0;
  let match: RegExpExecArray | null;
  let index = 0;

  while ((match = pattern.exec(template))) {
    if (match.index > last) parts.push(template.slice(last, match.index));
    const render = tags[match[1]];
    const chunks = match[2];
    parts.push(
      <span key={index}>{render ? render(chunks) : chunks}</span>,
    );
    index += 1;
    last = match.index + match[0].length;
  }

  if (last < template.length) parts.push(template.slice(last));
  return parts;
}

function createTranslator(messages: unknown, namespace?: string) {
  function translate(key: string, values?: Record<string, unknown>) {
    const full = namespace ? `${namespace}.${key}` : key;
    const value = lookup(messages, full);
    if (typeof value !== 'string') return full;
    return interpolate(value, values);
  }

  translate.raw = (key: string) => lookup(messages, namespace ? `${namespace}.${key}` : key);
  translate.rich = (key: string, tags: Record<string, (chunks: string) => ReactNode>) => {
    const full = namespace ? `${namespace}.${key}` : key;
    const value = lookup(messages, full);
    if (typeof value !== 'string') return value;
    return renderRich(value, tags);
  };

  return translate;
}

export function getTranslator(namespace?: string, messages: unknown = en) {
  return createTranslator(messages, namespace);
}

export function useTranslations(namespace?: string) {
  const messages = useContext(MessagesContext);
  return createTranslator(messages, namespace);
}
