import AppButton from '@/components/ui/AppButton';
import { Link, useRouter } from 'expo-router';
import { StyleSheet, View } from 'react-native';
import { Icon, Text } from 'react-native-paper';

const NotFound = () => {
  const router = useRouter();
  const handleGoBack = () => router.back();

  return (
    <View style={styles.container}>
      <Icon source="compass-off" size={64} />
      <Text variant="headlineMedium">404 — Not found</Text>
      <Text variant="bodyMedium" style={styles.description}>
        We couldn't find that screen. It may have been moved or deleted.
      </Text>
      <View style={styles.btnContainer}>
        <AppButton mode="outlined" onPress={handleGoBack}>
          Go Back
        </AppButton>
        <Link href="/" asChild>
          <AppButton mode="contained">Go Home</AppButton>
        </Link>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 16, gap: 12 },
  description: { textAlign: 'center' },
  btnContainer: { flexDirection: 'row', gap: 8, marginTop: 12 },
});

export default NotFound;
