import { tr } from './tr';
import { en } from './en';
import { LanguageInfo, TranslationSchema } from '../types';

export const supportedLanguages: LanguageInfo[] = [
  { code: 'tr', name: 'Turkish', nativeName: 'Türkçe', flag: '🇹🇷' },
  { code: 'en', name: 'English', nativeName: 'English', flag: '🇺🇸' },
  // Easy plug-in point for future languages:
  // { code: 'de', name: 'German', nativeName: 'Deutsch', flag: '🇩🇪' },
  // { code: 'fr', name: 'French', nativeName: 'Français', flag: '🇫🇷' },
  // { code: 'es', name: 'Spanish', nativeName: 'Español', flag: '🇪🇸' },
];

export const translations: Record<string, TranslationSchema> = {
  tr,
  en,
};

export const defaultLanguage = 'tr';
