import { useUI } from '@/stores/ui.store';
import { darkTheme, lightTheme } from '@/theme';
import { useToastConfig } from '@/theme/toastConfig';
import { showErrorToast } from '@/utils/helpers/toast';
import { MutationCache, QueryCache, QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Slot } from 'expo-router';
import { Provider as PaperProvider } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';

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
  const theme = themePref === 'dark' ? darkTheme : lightTheme;
  const toastConfig = useToastConfig();
  const insets = useSafeAreaInsets();

  return (
    <QueryClientProvider client={queryClient}>
      <PaperProvider theme={theme}>
        <Slot />
        <Toast config={toastConfig} topOffset={insets.top + 12} />
      </PaperProvider>
    </QueryClientProvider>
  );
};

export default RootLayout;
