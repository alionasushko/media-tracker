import { useTheme } from 'react-native-paper';
import { BaseToast, ErrorToast, ToastConfig } from 'react-native-toast-message';

export const useToastConfig = (): ToastConfig => {
  const theme = useTheme();

  const commonStyle = {
    borderLeftWidth: 0,
    borderRadius: theme.roundness,
    backgroundColor: theme.colors.elevation.level2,
  };

  const text1Style = {
    fontSize: theme.fonts.labelLarge.fontSize,
    fontWeight: '600',
    color: theme.colors.onSurface,
  };

  const text2Style = {
    fontSize: theme.fonts.bodyMedium.fontSize,
    color: theme.colors.onSurfaceVariant,
  };

  const config: ToastConfig = {
    success: (props: any) => (
      <BaseToast
        {...props}
        style={{ ...commonStyle, borderLeftColor: theme.colors.primary }}
        contentContainerStyle={{ paddingHorizontal: 16 }}
        text1Style={text1Style}
        text2Style={text2Style}
      />
    ),
    error: (props: any) => (
      <ErrorToast
        {...props}
        style={{ ...commonStyle, borderLeftColor: theme.colors.error }}
        contentContainerStyle={{ paddingHorizontal: 16 }}
        text1Style={text1Style}
        text2Style={text2Style}
      />
    ),
  };

  return config;
};
