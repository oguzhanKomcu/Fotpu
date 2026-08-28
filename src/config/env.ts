import { Platform } from 'react-native';

// Safe environment configuration that doesn't throw if native module is absent
let NativeConfig: Record<string, string> = {};
try {
  const RNC = require('react-native-config');
  NativeConfig = RNC?.default || RNC || {};
} catch (e) {
  NativeConfig = {};
}

export const ENV = {
  API_BASE_URL:
    NativeConfig.API_BASE_URL ||
    (__DEV__ ? 'http://127.0.0.1:5041' : 'https://api.fotpu.app'),
  API_TIMEOUT: Number(NativeConfig.API_TIMEOUT) || 20000,
  APP_NAME: NativeConfig.APP_NAME || 'Fotpu',
};

export default ENV;
