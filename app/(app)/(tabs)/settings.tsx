import AccountCard from '@/features/settings/components/AccountCard';
import AppearancePicker from '@/features/settings/components/AppearancePicker';
import GlassButton from '@/shared/components/design/GlassButton';
import { Display, Eyebrow, Mono } from '@/shared/components/design/text';
import AnimatedScreen from '@/shared/components/ui/AnimatedScreen';
import { auth } from '@/shared/services/firebase';
import { useAppTheme } from '@/shared/theme';
import { useUI } from '@/stores/ui.store';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { signOut } from '@react-native-firebase/auth';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { router } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const Settings = () => {
  const t = useAppTheme();
  const insets = useSafeAreaInsets();
  const { theme, setTheme } = useUI();

  const ownerName = auth.currentUser?.displayName ?? 'Anonymous';
  const ownerEmail = auth.currentUser?.email ?? '';

  const handleSignOut = async () => {
    await GoogleSignin.signOut();
    await signOut(auth);
    router.replace('/(auth)/sign-in');
  };

  return (
    <AnimatedScreen>
      <View style={[styles.container, { backgroundColor: t.tokens.semantic.bg }]}>
        <View style={[styles.headerRow, { paddingTop: insets.top + 8 }]}>
          <GlassButton onPress={() => router.back()} accessibilityLabel="Back">
            <MaterialCommunityIcons
              name="chevron-left"
              size={20}
              color={t.tokens.semantic.ink}
            />
          </GlassButton>
        </View>

        <ScrollView
          contentContainerStyle={[styles.scroll, { paddingBottom: insets.bottom + 80 }]}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.titleBlock}>
            <Eyebrow>Account</Eyebrow>
            <Display size={32} style={styles.title}>
              Settings
            </Display>
          </View>

          <AccountCard name={ownerName} email={ownerEmail} />

          <View style={styles.section}>
            <AppearancePicker value={theme} onChange={setTheme} />
          </View>

          <Pressable
            onPress={handleSignOut}
            style={[styles.signOut, { borderColor: t.tokens.semantic.hairlineStrong }]}
          >
            <MaterialCommunityIcons
              name="logout"
              size={16}
              color={t.tokens.semantic.statusDropped}
            />
            <Text
              style={[
                styles.signOutLabel,
                {
                  fontFamily: t.tokens.fonts.sansSemiBold,
                  color: t.tokens.semantic.statusDropped,
                },
              ]}
            >
              Sign out
            </Text>
          </Pressable>

          <Mono style={[styles.version, { color: t.tokens.semantic.inkFaint }]}>
            MEDIATRACKER · v0.1.0
          </Mono>
        </ScrollView>
      </View>
    </AnimatedScreen>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  headerRow: {
    paddingHorizontal: 16,
    paddingBottom: 4,
  },
  scroll: {
    paddingHorizontal: 24,
  },
  titleBlock: {
    paddingTop: 16,
    paddingBottom: 24,
  },
  title: {
    marginTop: 6,
  },
  section: {
    marginTop: 28,
  },
  signOut: {
    height: 52,
    borderRadius: 14,
    borderWidth: StyleSheet.hairlineWidth,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 28,
    backgroundColor: 'transparent',
  },
  signOutLabel: {
    fontSize: 14,
    marginLeft: 8,
    letterSpacing: 0.2,
  },
  version: {
    fontSize: 10,
    letterSpacing: 1,
    textAlign: 'center',
    marginTop: 32,
  },
});

export default Settings;
