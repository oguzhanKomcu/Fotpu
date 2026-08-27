import { translations, defaultLanguage } from './locales';
import { TranslationKey, SupportedLanguage } from './types';

export class I18nManager {
  private currentLanguage: string = defaultLanguage;

  public setLanguage(lang: SupportedLanguage): void {
    if (translations[lang]) {
      this.currentLanguage = lang;
    } else {
      console.warn(`[i18n] Language "${lang}" is not supported. Falling back to "${defaultLanguage}".`);
      this.currentLanguage = defaultLanguage;
    }
  }

  public getLanguage(): string {
    return this.currentLanguage;
  }

  public t(key: TranslationKey, params?: Record<string, string | number>): string {
    const keys = key.split('.');
    const dict = translations[this.currentLanguage] || translations[defaultLanguage];

    let result: any = dict;
    for (const k of keys) {
      if (result && typeof result === 'object' && k in result) {
        result = result[k];
      } else {
        // Fallback to defaultLanguage
        let fallbackResult: any = translations[defaultLanguage];
        for (const fk of keys) {
          if (fallbackResult && typeof fallbackResult === 'object' && fk in fallbackResult) {
            fallbackResult = fallbackResult[fk];
          } else {
            return key; // return raw key if not found
          }
        }
        result = fallbackResult;
        break;
      }
    }

    if (typeof result !== 'string') {
      return key;
    }

    // Parametric interpolation: {{count}} or {count}
    if (params) {
      return Object.keys(params).reduce((acc, paramKey) => {
        const val = String(params[paramKey]);
        return acc
          .replace(new RegExp(`{{\\s*${paramKey}\\s*}}`, 'g'), val)
          .replace(new RegExp(`{\\s*${paramKey}\\s*}`, 'g'), val);
      }, result);
    }

    return result;
  }
}

export const i18n = new I18nManager();
