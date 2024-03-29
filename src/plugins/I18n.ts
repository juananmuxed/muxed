import { App, Ref } from 'vue';
import { createI18n } from 'vue-i18n';

import type { Locale } from 'vue-i18n';

import es from '../locales/es/es';
import { LOCAL_STORAGE } from 'src/constants/Keys';

type MessagesType = typeof es;

export const i18n = createI18n({
  legacy: false,
  locale: '',
  fallbackLocale: 'en',
  messages: {},
});

const localesMap = Object.fromEntries(
  Object.entries(import.meta.glob('../locales/**/*.ts'))
    .map(([path, loadLocale]) => [path.match(/([\w-]*)\.ts$/)?.[1], loadLocale]),
) as Record<Locale, ()=> Promise<{ default: MessagesType }>>;

const locales: Record<string, string> = {
  // Add locales here & clone folder en in locales & flag image
  es: 'Español',
  en: 'English',
};

export const availableLocales = Object.keys(localesMap).map((locale) => ({
  value: locale,
  label: locales[locale] ?? locale,
}));

const loadedLanguages: string[] = [];

function setI18nLanguage(lang: Locale) {
  (i18n.global.locale as Ref).value = lang;
  localStorage.setItem(LOCAL_STORAGE.LANG, lang);
  if (typeof document !== 'undefined') { document.querySelector('html')?.setAttribute('lang', lang); }
  return lang;
}

export async function loadLanguageAsync(lang: string): Promise<Locale> {
  if (i18n.global.locale.value === lang) {
    return setI18nLanguage(lang);
  }

  if (loadedLanguages.includes(lang)) {
    return setI18nLanguage(lang);
  }

  const messages = await localesMap[lang]();
  i18n.global.setLocaleMessage(lang, messages.default as MessagesType);
  loadedLanguages.push(lang);
  return setI18nLanguage(lang);
}

export const installI18n = (app: App) => {
  app.use(i18n);
};

const { t } = i18n.global;

export { t };
