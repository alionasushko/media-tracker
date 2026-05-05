import { MD3DarkTheme, MD3LightTheme, configureFonts, useTheme } from 'react-native-paper';
import type { MD3Type } from 'react-native-paper/lib/typescript/types';
import {
  buildTokens,
  darkPalette,
  fonts as fontTokens,
  lightPalette,
  type AppTokens,
} from './tokens';

const baseFont: Partial<MD3Type> = {
  fontFamily: fontTokens.sansRegular,
  letterSpacing: 0,
};

const fontConfig = configureFonts({
  config: {
    displayLarge: {
      ...baseFont,
      fontFamily: fontTokens.sansMedium,
      fontSize: 57,
      lineHeight: 64,
      letterSpacing: -0.5,
    },
    displayMedium: {
      ...baseFont,
      fontFamily: fontTokens.sansMedium,
      fontSize: 45,
      lineHeight: 52,
      letterSpacing: -0.4,
    },
    displaySmall: {
      ...baseFont,
      fontFamily: fontTokens.sansMedium,
      fontSize: 36,
      lineHeight: 42,
      letterSpacing: -0.3,
    },
    headlineLarge: {
      ...baseFont,
      fontFamily: fontTokens.sansSemiBold,
      fontSize: 32,
      lineHeight: 40,
      letterSpacing: -0.3,
    },
    headlineMedium: {
      ...baseFont,
      fontFamily: fontTokens.sansSemiBold,
      fontSize: 28,
      lineHeight: 34,
      letterSpacing: -0.2,
    },
    headlineSmall: {
      ...baseFont,
      fontFamily: fontTokens.sansSemiBold,
      fontSize: 24,
      lineHeight: 30,
      letterSpacing: -0.2,
    },
    titleLarge: { ...baseFont, fontFamily: fontTokens.sansSemiBold, fontSize: 22, lineHeight: 28 },
    titleMedium: {
      ...baseFont,
      fontFamily: fontTokens.sansSemiBold,
      fontSize: 16,
      lineHeight: 24,
      letterSpacing: 0.1,
    },
    titleSmall: {
      ...baseFont,
      fontFamily: fontTokens.sansMedium,
      fontSize: 14,
      lineHeight: 20,
      letterSpacing: 0.1,
    },
    bodyLarge: { ...baseFont, fontFamily: fontTokens.sansRegular, fontSize: 16, lineHeight: 24 },
    bodyMedium: { ...baseFont, fontFamily: fontTokens.sansRegular, fontSize: 14, lineHeight: 20 },
    bodySmall: { ...baseFont, fontFamily: fontTokens.sansRegular, fontSize: 12, lineHeight: 16 },
    labelLarge: {
      ...baseFont,
      fontFamily: fontTokens.sansMedium,
      fontSize: 14,
      lineHeight: 20,
      letterSpacing: 0.1,
    },
    labelMedium: {
      ...baseFont,
      fontFamily: fontTokens.sansMedium,
      fontSize: 12,
      lineHeight: 16,
      letterSpacing: 0.5,
    },
    labelSmall: {
      ...baseFont,
      fontFamily: fontTokens.sansMedium,
      fontSize: 11,
      lineHeight: 16,
      letterSpacing: 0.5,
    },
  },
});

const lightColors = {
  primary: lightPalette.accent,
  onPrimary: lightPalette.accentInk,
  primaryContainer: lightPalette.accentSoft,
  onPrimaryContainer: '#3D2D9C',
  secondary: '#71717A',
  onSecondary: '#FFFFFF',
  secondaryContainer: lightPalette.surface3,
  onSecondaryContainer: '#3F3F46',
  tertiary: '#71717A',
  onTertiary: '#FFFFFF',
  tertiaryContainer: lightPalette.surface3,
  onTertiaryContainer: '#3F3F46',
  background: lightPalette.bg,
  onBackground: lightPalette.ink,
  surface: lightPalette.surface1,
  onSurface: lightPalette.ink,
  surfaceVariant: lightPalette.surface3,
  onSurfaceVariant: lightPalette.inkMute,
  surfaceDisabled: 'rgba(22, 22, 22, 0.12)',
  onSurfaceDisabled: 'rgba(22, 22, 22, 0.38)',
  outline: lightPalette.hairlineStrong,
  outlineVariant: lightPalette.hairline,
  error: lightPalette.statusDropped,
  onError: '#FFFFFF',
  errorContainer: '#FEF2F2',
  onErrorContainer: '#7A2A1A',
  inverseSurface: '#1A1815',
  inverseOnSurface: '#F4EFE7',
  inversePrimary: darkPalette.accent,
  shadow: 'rgba(0, 0, 0, 0.05)',
  scrim: 'rgba(0, 0, 0, 0.3)',
  backdrop: 'rgba(0, 0, 0, 0.4)',
  elevation: {
    level0: 'transparent',
    level1: lightPalette.surface1,
    level2: lightPalette.surface2,
    level3: lightPalette.surface3,
    level4: '#E8E8E5',
    level5: '#E2E2DF',
  },
};

const darkColors = {
  primary: darkPalette.accent,
  onPrimary: darkPalette.accentInk,
  primaryContainer: darkPalette.accentSoft,
  onPrimaryContainer: '#D4CEE8',
  secondary: '#A1A1AA',
  onSecondary: '#27272A',
  secondaryContainer: darkPalette.surface2,
  onSecondaryContainer: darkPalette.inkMute,
  tertiary: '#A1A1AA',
  onTertiary: '#27272A',
  tertiaryContainer: darkPalette.surface2,
  onTertiaryContainer: darkPalette.inkMute,
  background: darkPalette.bg,
  onBackground: darkPalette.ink,
  surface: darkPalette.surface1,
  onSurface: darkPalette.ink,
  surfaceVariant: darkPalette.surface2,
  onSurfaceVariant: darkPalette.inkMute,
  surfaceDisabled: 'rgba(244, 239, 231, 0.12)',
  onSurfaceDisabled: 'rgba(244, 239, 231, 0.38)',
  outline: darkPalette.hairlineStrong,
  outlineVariant: darkPalette.hairline,
  error: darkPalette.statusDropped,
  onError: '#FFFFFF',
  errorContainer: '#3A1B14',
  onErrorContainer: '#F2C2B4',
  inverseSurface: darkPalette.ink,
  inverseOnSurface: darkPalette.bg,
  inversePrimary: lightPalette.accent,
  shadow: 'rgba(0, 0, 0, 0.4)',
  scrim: 'rgba(0, 0, 0, 0.6)',
  backdrop: 'rgba(0, 0, 0, 0.6)',
  elevation: {
    level0: 'transparent',
    level1: darkPalette.surface1,
    level2: darkPalette.surface2,
    level3: darkPalette.surface3,
    level4: '#2F2B27',
    level5: '#34302C',
  },
};

export const lightTheme = {
  ...MD3LightTheme,
  roundness: 14,
  fonts: fontConfig,
  colors: {
    ...MD3LightTheme.colors,
    ...lightColors,
  },
  tokens: buildTokens('light'),
};

export const darkTheme = {
  ...MD3DarkTheme,
  roundness: 14,
  fonts: fontConfig,
  colors: {
    ...MD3DarkTheme.colors,
    ...darkColors,
  },
  tokens: buildTokens('dark'),
};

export type AppTheme = typeof lightTheme;

export const useAppTheme = () => useTheme<AppTheme>();

export type { AppTokens };
export { fontTokens };
