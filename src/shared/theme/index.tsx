import { MD3DarkTheme, MD3LightTheme, configureFonts } from 'react-native-paper';
import type { MD3Type } from 'react-native-paper/lib/typescript/types';

const baseFont: Partial<MD3Type> = {
  fontFamily: 'Inter-Regular',
  letterSpacing: 0,
};

const fontConfig = configureFonts({
  config: {
    displayLarge: {
      ...baseFont,
      fontFamily: 'Inter-Regular',
      fontSize: 57,
      lineHeight: 64,
      letterSpacing: -0.25,
    },
    displayMedium: { ...baseFont, fontFamily: 'Inter-Regular', fontSize: 45, lineHeight: 52 },
    displaySmall: { ...baseFont, fontFamily: 'Inter-Regular', fontSize: 36, lineHeight: 44 },
    headlineLarge: { ...baseFont, fontFamily: 'Inter-Regular', fontSize: 32, lineHeight: 40 },
    headlineMedium: { ...baseFont, fontFamily: 'Inter-Regular', fontSize: 28, lineHeight: 36 },
    headlineSmall: { ...baseFont, fontFamily: 'Inter-Regular', fontSize: 24, lineHeight: 32 },
    titleLarge: { ...baseFont, fontFamily: 'Inter-SemiBold', fontSize: 22, lineHeight: 28 },
    titleMedium: {
      ...baseFont,
      fontFamily: 'Inter-SemiBold',
      fontSize: 16,
      lineHeight: 24,
      letterSpacing: 0.1,
    },
    titleSmall: {
      ...baseFont,
      fontFamily: 'Inter-Medium',
      fontSize: 14,
      lineHeight: 20,
      letterSpacing: 0.1,
    },
    bodyLarge: { ...baseFont, fontFamily: 'Inter-Regular', fontSize: 16, lineHeight: 24 },
    bodyMedium: { ...baseFont, fontFamily: 'Inter-Regular', fontSize: 14, lineHeight: 20 },
    bodySmall: { ...baseFont, fontFamily: 'Inter-Regular', fontSize: 12, lineHeight: 16 },
    labelLarge: {
      ...baseFont,
      fontFamily: 'Inter-Medium',
      fontSize: 14,
      lineHeight: 20,
      letterSpacing: 0.1,
    },
    labelMedium: {
      ...baseFont,
      fontFamily: 'Inter-Medium',
      fontSize: 12,
      lineHeight: 16,
      letterSpacing: 0.5,
    },
    labelSmall: {
      ...baseFont,
      fontFamily: 'Inter-Medium',
      fontSize: 11,
      lineHeight: 16,
      letterSpacing: 0.5,
    },
  },
});

// Light palette
const lightColors = {
  primary: '#6D5ACE',
  onPrimary: '#FFFFFF',
  primaryContainer: '#F0EEFA',
  onPrimaryContainer: '#4A3A8F',
  secondary: '#71717A',
  onSecondary: '#FFFFFF',
  secondaryContainer: '#F4F4F5',
  onSecondaryContainer: '#3F3F46',
  tertiary: '#71717A',
  onTertiary: '#FFFFFF',
  tertiaryContainer: '#F4F4F5',
  onTertiaryContainer: '#3F3F46',
  background: '#FFFFFF',
  onBackground: '#09090B',
  surface: '#FFFFFF',
  onSurface: '#09090B',
  surfaceVariant: '#F4F4F5',
  onSurfaceVariant: '#71717A',
  surfaceDisabled: 'rgba(9, 9, 11, 0.12)',
  onSurfaceDisabled: 'rgba(9, 9, 11, 0.38)',
  outline: '#D4D4D8',
  outlineVariant: '#E4E4E7',
  error: '#DC2626',
  onError: '#FFFFFF',
  errorContainer: '#FEF2F2',
  onErrorContainer: '#991B1B',
  inverseSurface: '#18181B',
  inverseOnSurface: '#FAFAFA',
  inversePrimary: '#B8AADE',
  shadow: 'rgba(0, 0, 0, 0.05)',
  scrim: 'rgba(0, 0, 0, 0.3)',
  backdrop: 'rgba(0, 0, 0, 0.4)',
  elevation: {
    level0: 'transparent',
    level1: '#FAFAFA',
    level2: '#F4F4F5',
    level3: '#EFEFEF',
    level4: '#E8E8EB',
    level5: '#E4E4E7',
  },
};

// Dark palette
const darkColors = {
  primary: '#9B8EC4',
  onPrimary: '#2D2254',
  primaryContainer: '#2D2254',
  onPrimaryContainer: '#D4CEE8',
  secondary: '#A1A1AA',
  onSecondary: '#27272A',
  secondaryContainer: '#27272A',
  onSecondaryContainer: '#D4D4D8',
  tertiary: '#A1A1AA',
  onTertiary: '#27272A',
  tertiaryContainer: '#27272A',
  onTertiaryContainer: '#D4D4D8',
  background: '#09090B',
  onBackground: '#FAFAFA',
  surface: '#18181B',
  onSurface: '#FAFAFA',
  surfaceVariant: '#27272A',
  onSurfaceVariant: '#A1A1AA',
  surfaceDisabled: 'rgba(250, 250, 250, 0.12)',
  onSurfaceDisabled: 'rgba(250, 250, 250, 0.38)',
  outline: '#3F3F46',
  outlineVariant: '#27272A',
  error: '#EF4444',
  onError: '#FFFFFF',
  errorContainer: '#450A0A',
  onErrorContainer: '#FCA5A5',
  inverseSurface: '#FAFAFA',
  inverseOnSurface: '#18181B',
  inversePrimary: '#6D5ACE',
  shadow: 'rgba(0, 0, 0, 0.4)',
  scrim: 'rgba(0, 0, 0, 0.6)',
  backdrop: 'rgba(0, 0, 0, 0.6)',
  elevation: {
    level0: 'transparent',
    level1: '#18181B',
    level2: '#1F1F23',
    level3: '#27272A',
    level4: '#2C2C30',
    level5: '#313136',
  },
};

export const lightTheme = {
  ...MD3LightTheme,
  roundness: 12,
  fonts: fontConfig,
  colors: {
    ...MD3LightTheme.colors,
    ...lightColors,
  },
};

export const darkTheme = {
  ...MD3DarkTheme,
  roundness: 12,
  fonts: fontConfig,
  colors: {
    ...MD3DarkTheme.colors,
    ...darkColors,
  },
};

export type AppTheme = typeof lightTheme;
