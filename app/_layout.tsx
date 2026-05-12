import { useUI } from '@/stores/ui.store';
import { darkTheme, lightTheme } from '@/shared/theme';
import OfflineBanner from '@/shared/components/ui/OfflineBanner';
import { useOnlineStatus } from '@/shared/hooks/useOnlineStatus';
import { useToastConfig } from '@/shared/hooks/useToastConfig';
import '@/shared/services/google-signin';
import { showErrorToast } from '@/shared/utils/toast';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import * as SystemUI from 'expo-system-ui';
import { MutationCache, QueryCache, QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Slot } from 'expo-router';
import { useEffect } from 'react';
import { useColorScheme, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { KeyboardProvider } from 'react-native-keyboard-controller';
import { Provider as PaperProvider } from 'react-native-paper';
import { SafeAreaInsetsContext, useSafeAreaInsets } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';

SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient({
  queryCache: new QueryCache({
    onError: (error: Error) => showErrorToast(error),
  }),
  mutationCache: new MutationCache({
    onError: (error: Error) => showErrorToast(error),
  }),
  defaultOptions: { queries: { retry: 1, staleTime: 30_000 } },
});

const RootLayout = () => {
  const themePref = useUI((s) => s.theme);
  const systemScheme = useColorScheme();
  const toastConfig = useToastConfig();
  const insets = useSafeAreaInsets();
  const isOnline = useOnlineStatus();
  const slotInsets = isOnline ? insets : { ...insets, top: 0 };

  const resolvedMode = themePref === 'system' ? (systemScheme ?? 'light') : themePref;
  const theme = resolvedMode === 'dark' ? darkTheme : lightTheme;

  const [fontsLoaded] = useFonts({
    'InstrumentSans-Regular': require('../assets/fonts/InstrumentSans-Regular.ttf'),
    'InstrumentSans-Medium': require('../assets/fonts/InstrumentSans-Medium.ttf'),
    'InstrumentSans-SemiBold': require('../assets/fonts/InstrumentSans-SemiBold.ttf'),
    'InstrumentSans-Bold': require('../assets/fonts/InstrumentSans-Bold.ttf'),
    'JetBrainsMono-Regular': require('../assets/fonts/JetBrainsMono-Regular.ttf'),
    'JetBrainsMono-Medium': require('../assets/fonts/JetBrainsMono-Medium.ttf'),
    'JetBrainsMono-SemiBold': require('../assets/fonts/JetBrainsMono-SemiBold.ttf'),
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
            <View style={{ flex: 1 }}>
              {!isOnline ? <OfflineBanner /> : null}
              <SafeAreaInsetsContext.Provider value={slotInsets}>
                <View style={{ flex: 1 }}>
                  <Slot />
                </View>
              </SafeAreaInsetsContext.Provider>
            </View>
            <Toast config={toastConfig} topOffset={insets.top + 12} />
          </PaperProvider>
        </KeyboardProvider>
      </QueryClientProvider>
    </GestureHandlerRootView>
  );
};

export default RootLayout;
