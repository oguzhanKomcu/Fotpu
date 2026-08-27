import { create } from 'zustand';
import { mmkvStorage, MMKVKeys } from '@/services/storage/mmkv';
import { i18n } from '@/localization/i18n';
import { supportedLanguages, defaultLanguage } from '@/localization/locales';
import { SupportedLanguage, TranslationKey, LanguageInfo } from '@/localization/types';

interface LanguageState {
  currentLanguage: SupportedLanguage;
  supportedLanguages: LanguageInfo[];
  setLanguage: (lang: SupportedLanguage) => void;
  t: (key: TranslationKey, params?: Record<string, string | number>) => string;
}

const initialLang =
  mmkvStorage.getItem<string>(MMKVKeys.LANGUAGE_CODE || 'app_language_code') || defaultLanguage;
i18n.setLanguage(initialLang);

export const useLanguageStore = create<LanguageState>((set, get) => ({
  currentLanguage: initialLang,
  supportedLanguages: supportedLanguages,

  setLanguage: (lang: SupportedLanguage) => {
    i18n.setLanguage(lang);
    mmkvStorage.setItem(MMKVKeys.LANGUAGE_CODE || 'app_language_code', lang);
    set({ currentLanguage: lang });
  },

  t: (key: TranslationKey, params?: Record<string, string | number>) => {
    // Reading currentLanguage from state ensures reactivity in components
    const _ = get().currentLanguage;
    return i18n.t(key, params);
  },
}));

/**
 * Universal useTranslation hook for components
 */
export const useTranslation = () => {
  const currentLanguage = useLanguageStore((state) => state.currentLanguage);
  const setLanguage = useLanguageStore((state) => state.setLanguage);
  const supported = useLanguageStore((state) => state.supportedLanguages);

  const t = (key: TranslationKey, params?: Record<string, string | number>) => {
    return i18n.t(key, params);
  };

  return {
    t,
    currentLanguage,
    setLanguage,
    supportedLanguages: supported,
  };
};
