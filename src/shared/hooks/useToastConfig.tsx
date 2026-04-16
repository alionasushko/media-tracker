import { useTheme } from 'react-native-paper';
import { BaseToast, ErrorToast, ToastConfig } from 'react-native-toast-message';

export const useToastConfig = (): ToastConfig => {
  const theme = useTheme();

  const commonStyle = {
    borderLeftWidth: 3,
    borderRadius: theme.roundness,
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.outlineVariant,
    borderWidth: 1,
  };

  const text1Style = {
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
    color: theme.colors.onSurface,
  };

  const text2Style = {
    fontFamily: 'Inter-Regular',
    fontSize: 13,
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
