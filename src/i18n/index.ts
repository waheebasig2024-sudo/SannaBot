import { Platform } from 'react-native';
import en from './locales/en';
import de from './locales/de';
import ar from './locales/ar';

export type Translations = typeof en;
export type TranslationKey = keyof Translations;

type LocaleMap = Record<string, Translations>;

const LOCALES: LocaleMap = {
  en,
  de,
  ar,
};

let activeTranslations: Translations = en;
let activeLocale = 'en';

function resolveSystemLocale(): string {
  try {
    const locale = Intl.DateTimeFormat().resolvedOptions().locale;
    return locale.replace('_', '-');
  } catch {
    return 'en-US';
  }
}

function resolveTranslations(lang: string): { translations: Translations; resolvedLocale: string } {
  if (LOCALES[lang]) {
    return { translations: LOCALES[lang], resolvedLocale: lang };
  }
  const prefix = lang.split('-')[0].toLowerCase();
  if (LOCALES[prefix]) {
    return { translations: LOCALES[prefix], resolvedLocale: prefix };
  }
  return { translations: en, resolvedLocale: 'en' };
}

export function setLocale(lang: 'system' | string): void {
  const resolved = lang === 'system' ? resolveSystemLocale() : lang;
  const { translations, resolvedLocale } = resolveTranslations(resolved);
  activeTranslations = translations;
  activeLocale = resolvedLocale;
}

export function getLocale(): string {
  return activeLocale;
}

export function getLocaleBCP47(): string {
  const map: Record<string, string> = {
    de: 'de-AT',
    en: 'en-US',
    ar: 'ar-SA',
  };
  return map[activeLocale] ?? activeLocale;
}

export function t(key: TranslationKey): string {
  const val = activeTranslations[key];
  if (val !== undefined) return val;
  return en[key] ?? key;
}
