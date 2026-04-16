import AppButton from '@/shared/components/ui/AppButton';
import { Link, useRouter } from 'expo-router';
import { StyleSheet, View } from 'react-native';
import { Icon, Text, useTheme } from 'react-native-paper';

const NotFound = () => {
  const router = useRouter();
  const theme = useTheme();
  const handleGoBack = () => router.back();

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Icon source="compass-off" size={56} color={theme.colors.outline} />
      <Text style={[styles.heading, { color: theme.colors.onSurface }]}>
        Page not found
      </Text>
      <Text style={[styles.description, { color: theme.colors.onSurfaceVariant }]}>
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
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    gap: 12,
  },
  heading: {
    fontFamily: 'Inter-Bold',
    fontSize: 22,
    letterSpacing: -0.3,
    marginTop: 8,
  },
  description: {
    fontFamily: 'Inter-Regular',
    fontSize: 15,
    textAlign: 'center',
    lineHeight: 22,
  },
  btnContainer: { flexDirection: 'row', gap: 12, marginTop: 20 },
});

export default NotFound;
