import en from '../../messages/en.json';

import { getTranslator } from './next-intl';

export async function getLocale() {
  return 'en';
}

export async function getMessages() {
  return en;
}

export async function getTranslations(namespace?: string) {
  return getTranslator(namespace, en);
}
