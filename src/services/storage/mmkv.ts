import { MMKV } from 'react-native-mmkv';

export const appStorage = new MMKV({
  id: 'fotpu-app-storage',
  encryptionKey: 'fotpu-client-local-secret-key-2026',
});

export const MMKVKeys = {
  USER_DATA: 'user_data',
  THEME_MODE: 'theme_mode',
  CACHED_FEED: 'cached_feed',
  CACHED_MY_OUTFITS: 'cached_my_outfits',
  OFFLINE_SYNC_QUEUE: 'offline_sync_queue',
  LAST_SYNC_TIMESTAMP: 'last_sync_timestamp',
  LANGUAGE_CODE: 'app_language_code',
} as const;

export const mmkvStorage = {
  setItem: <T>(key: string, value: T): void => {
    try {
      const serialized = JSON.stringify(value);
      appStorage.set(key, serialized);
    } catch (error) {
      console.error(`[MMKV] setItem error for key "${key}":`, error);
    }
  },

  getItem: <T>(key: string): T | null => {
    try {
      const data = appStorage.getString(key);
      return data ? (JSON.parse(data) as T) : null;
    } catch (error) {
      console.error(`[MMKV] getItem error for key "${key}":`, error);
      return null;
    }
  },

  removeItem: (key: string): void => {
    appStorage.delete(key);
  },

  clearAll: (): void => {
    appStorage.clearAll();
  },
};
