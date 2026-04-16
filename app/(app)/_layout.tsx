import { useAuthUser } from '@/features/auth/hooks/useAuthUser';
import { useUI } from '@/stores/ui.store';
import { darkTheme, lightTheme } from '@/shared/theme';
import { Redirect, Stack } from 'expo-router';
import { useColorScheme } from 'react-native';

const AppLayout = () => {
  const { user, initializing } = useAuthUser();
  const themePref = useUI((s) => s.theme);
  const systemScheme = useColorScheme();
  const resolvedMode = themePref === 'system' ? (systemScheme ?? 'light') : themePref;
  const theme = resolvedMode === 'dark' ? darkTheme : lightTheme;

  if (initializing) return null;
  if (!user) return <Redirect href="/(auth)/sign-in" />;
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: 'fade_from_bottom',
        animationDuration: 200,
        contentStyle: { backgroundColor: theme.colors.background },
      }}
    />
  );
};

export default AppLayout;
