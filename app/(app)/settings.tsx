import AnimatedScreen from '@/shared/components/ui/AnimatedScreen';
import { auth } from '@/shared/services/firebase';
import { commonStyles } from '@/shared/styles/common';
import { useUI, type ThemePref } from '@/stores/ui.store';
import { signOut } from '@react-native-firebase/auth';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { router } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { Divider, Icon, RadioButton, Text, useTheme } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const Settings = () => {
  const ownerName = auth.currentUser?.displayName;
  const ownerEmail = auth.currentUser?.email;
  const { theme, setTheme } = useUI();
  const paperTheme = useTheme();
  const insets = useSafeAreaInsets();

  const handleSignOut = async () => {
    try {
      await GoogleSignin.signOut();
    } catch {}
    await signOut(auth);
    router.replace('/(auth)/sign-in');
  };
  const handleGoBack = () => router.back();
  const handleChangeTheme = (v: string) => setTheme(v as ThemePref);

  return (
    <AnimatedScreen>
      <View style={[commonStyles.container, { backgroundColor: paperTheme.colors.background }]}>
        <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
          <Pressable onPress={handleGoBack} hitSlop={8}>
            <Icon source="arrow-left" size={22} color={paperTheme.colors.onBackground} />
          </Pressable>
          <Text style={[styles.headerTitle, { color: paperTheme.colors.onBackground }]}>
            Settings
          </Text>
          <View style={styles.headerSpacer} />
        </View>

        <ScrollView contentContainerStyle={styles.content}>
          <Text style={[styles.sectionLabel, { color: paperTheme.colors.onSurfaceVariant }]}>
            APPEARANCE
          </Text>
          <RadioButton.Group value={theme} onValueChange={handleChangeTheme}>
            <RadioButton.Item label="System" value="system" labelStyle={styles.radioLabel} />
            <RadioButton.Item label="Light" value="light" labelStyle={styles.radioLabel} />
            <RadioButton.Item label="Dark" value="dark" labelStyle={styles.radioLabel} />
          </RadioButton.Group>

          <Divider
            style={[styles.divider, { backgroundColor: paperTheme.colors.outlineVariant }]}
          />

          <Text style={[styles.sectionLabel, { color: paperTheme.colors.onSurfaceVariant }]}>
            ACCOUNT
          </Text>
          <View style={styles.accountInfo}>
            <Text style={[styles.accountName, { color: paperTheme.colors.onSurface }]}>
              {ownerName}
            </Text>
            {ownerEmail ? (
              <Text style={[styles.accountEmail, { color: paperTheme.colors.onSurfaceVariant }]}>
                {ownerEmail}
              </Text>
            ) : null}
          </View>

          <Pressable onPress={handleSignOut} style={styles.signOutBtn}>
            <Icon source="logout" size={18} color={paperTheme.colors.error} />
            <Text style={[styles.signOutText, { color: paperTheme.colors.error }]}>Sign out</Text>
          </Pressable>
        </ScrollView>
      </View>
    </AnimatedScreen>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 12,
    gap: 16,
  },
  headerTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 28,
    letterSpacing: -0.5,
    flex: 1,
  },
  headerSpacer: { width: 22 },
  content: { paddingHorizontal: 20, paddingTop: 8 },
  sectionLabel: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 11,
    letterSpacing: 1,
    marginBottom: 8,
    marginTop: 24,
  },
  radioLabel: { fontFamily: 'Inter-Regular', fontSize: 15 },
  divider: { marginTop: 24 },
  accountInfo: { gap: 2, marginBottom: 16 },
  accountName: { fontFamily: 'Inter-SemiBold', fontSize: 16 },
  accountEmail: { fontFamily: 'Inter-Regular', fontSize: 14 },
  signOutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 12,
  },
  signOutText: { fontFamily: 'Inter-Medium', fontSize: 15 },
});

export default Settings;
