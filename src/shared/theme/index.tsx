import { MD3DarkTheme, MD3LightTheme } from 'react-native-paper';

// TODO: add custom styles
export const lightTheme = {
  ...MD3LightTheme,
};

export const darkTheme = {
  ...MD3DarkTheme,
};

export type AppTheme = typeof lightTheme;
