import { useAuthUser } from '@hooks/useAuthUser';
import { Redirect, Stack } from 'expo-router';

const AppLayout = () => {
  const { user, initializing } = useAuthUser();
  if (initializing) return null;
  if (!user) return <Redirect href="/(auth)/sign-in" />;
  return <Stack screenOptions={{ headerShown: false }} />;
};

export default AppLayout;
