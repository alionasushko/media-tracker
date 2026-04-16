import { useUI } from '@/stores/ui.store';
import { darkTheme, lightTheme } from '@/shared/theme';
import { Stack } from 'expo-router';
import { useColorScheme } from 'react-native';

const AuthLayout = () => {
  const themePref = useUI((s) => s.theme);
  const systemScheme = useColorScheme();
  const resolvedMode = themePref === 'system' ? (systemScheme ?? 'light') : themePref;
  const theme = resolvedMode === 'dark' ? darkTheme : lightTheme;

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: 'fade',
        animationDuration: 200,
        contentStyle: { backgroundColor: theme.colors.background },
      }}
    />
  );
};

export default AuthLayout;
