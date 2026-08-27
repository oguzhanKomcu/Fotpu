declare module '*.png';
declare module '*.jpg';
declare module '*.jpeg';
declare module '*.svg' {
  import React from 'react';
  import { SvgProps } from 'react-native-svg';
  const content: React.FC<SvgProps>;
  export default content;
}

declare module 'react-native-config' {
  export interface NativeConfig {
    ENV: 'development' | 'staging' | 'production';
    API_BASE_URL: string;
    API_TIMEOUT: string;
    FCM_SENDER_ID: string;
    DEEP_LINK_DOMAIN: string;
  }

  export const Config: NativeConfig;
  export default Config;
}
