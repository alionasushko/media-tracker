import { useUI } from '@/stores/ui.store';
import { darkTheme, lightTheme } from '@/shared/theme';
import { useToastConfig } from '@/shared/hooks/useToastConfig';
import { showErrorToast } from '@/shared/utils/toast';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import * as SystemUI from 'expo-system-ui';
import { MutationCache, QueryCache, QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Slot } from 'expo-router';
import { useEffect } from 'react';
import { useColorScheme } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { KeyboardProvider } from 'react-native-keyboard-controller';
import { Provider as PaperProvider } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';

SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient({
  queryCache: new QueryCache({
    onError: (error: Error) => showErrorToast(error),
  }),
  mutationCache: new MutationCache({
    onError: (error: Error) => showErrorToast(error),
  }),
  defaultOptions: { queries: { retry: 1 } },
});

const RootLayout = () => {
  const themePref = useUI((s) => s.theme);
  const systemScheme = useColorScheme();
  const toastConfig = useToastConfig();
  const insets = useSafeAreaInsets();

  const resolvedMode = themePref === 'system' ? (systemScheme ?? 'light') : themePref;
  const theme = resolvedMode === 'dark' ? darkTheme : lightTheme;

  const [fontsLoaded] = useFonts({
    'Inter-Regular': require('../assets/fonts/Inter-Regular.ttf'),
    'Inter-Medium': require('../assets/fonts/Inter-Medium.ttf'),
    'Inter-SemiBold': require('../assets/fonts/Inter-SemiBold.ttf'),
    'Inter-Bold': require('../assets/fonts/Inter-Bold.ttf'),
  });

  useEffect(() => {
    SystemUI.setBackgroundColorAsync(theme.colors.background);
  }, [theme.colors.background]);

  useEffect(() => {
    if (fontsLoaded) SplashScreen.hideAsync();
  }, [fontsLoaded]);

  if (!fontsLoaded) return null;

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <QueryClientProvider client={queryClient}>
        <KeyboardProvider>
          <PaperProvider theme={theme}>
            <StatusBar style={resolvedMode === 'dark' ? 'light' : 'dark'} />
            <Slot />
            <Toast config={toastConfig} topOffset={insets.top + 12} />
          </PaperProvider>
        </KeyboardProvider>
      </QueryClientProvider>
    </GestureHandlerRootView>
  );
};

export default RootLayout;
