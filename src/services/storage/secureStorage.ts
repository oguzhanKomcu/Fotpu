import * as Keychain from 'react-native-keychain';
import { AuthTokens } from '@/types/auth';

const KEYCHAIN_SERVICE = 'com.fotpu.auth.tokens';

export const secureStorage = {
  saveTokens: async (tokens: AuthTokens): Promise<boolean> => {
    try {
      const payload = JSON.stringify(tokens);
      await Keychain.setGenericPassword('auth_tokens', payload, {
        service: KEYCHAIN_SERVICE,
        accessible: Keychain.ACCESSIBLE.AFTER_FIRST_UNLOCK,
        securityLevel: Keychain.SECURITY_LEVEL.SECURE_SOFTWARE,
      });
      return true;
    } catch (error) {
      console.error('[SecureStorage] Error saving tokens to Keychain:', error);
      return false;
    }
  },

  getTokens: async (): Promise<AuthTokens | null> => {
    try {
      const credentials = await Keychain.getGenericPassword({
        service: KEYCHAIN_SERVICE,
      });
      if (credentials && credentials.password) {
        return JSON.parse(credentials.password) as AuthTokens;
      }
      return null;
    } catch (error) {
      console.error('[SecureStorage] Error retrieving tokens from Keychain:', error);
      return null;
    }
  },

  clearTokens: async (): Promise<boolean> => {
    try {
      await Keychain.resetGenericPassword({
        service: KEYCHAIN_SERVICE,
      });
      return true;
    } catch (error) {
      console.error('[SecureStorage] Error clearing tokens from Keychain:', error);
      return false;
    }
  },
};
