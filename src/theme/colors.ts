export const FotpuColors = {
  // Brand & Accent Colors (From Stitch Design)
  primary: '#7E47EB',       // AI & Main Violet
  primaryLight: '#A77DF1',  // Soft Accent Violet
  primaryDark: '#5B21B6',
  coral: '#FF6E61',         // Splash Coral

  // Pastels
  pastelCream: '#FFFDD0',
  pastelPeach: '#FFDAB9',
  pastelLavender: '#E6E6FA',
  pastelPink: '#FADADD',
  pastelMint: '#CFFDE1',
  pastelSky: '#DDF3FF',

  // Backgrounds
  backgroundLight: '#FCFCFC',
  backgroundLightAlt: '#F8F6F5',
  backgroundDark: '#161121',
  backgroundDarkAlt: '#1A191D',
  backgroundDarkDeep: '#23100F',

  // Cards & Surfaces
  cardLight: '#FFFFFF',
  cardDark: '#262335',
  cardOverlayLight: 'rgba(255, 255, 255, 0.85)',
  cardOverlayDark: 'rgba(22, 17, 33, 0.85)',

  // Typography & Content
  textDark: '#131118',
  textCharcoal: '#333333',
  textMuted: '#6F6388',
  textSubtle: '#888888',
  textLight: '#E3E3E3',
  textWhite: '#FFFFFF',

  // Rating & Status
  starGold: '#FBBF24',
  starActive: '#EAB308',
  likeHeart: '#EF4444',
  success: '#10B981',
  warning: '#F59E0B',
  error: '#EF4444',

  // Borders
  borderLight: '#E5E7EB',
  borderDark: '#374151',
} as const;

export type ColorKeys = keyof typeof FotpuColors;
