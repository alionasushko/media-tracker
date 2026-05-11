import PasswordStrengthMeter from '@/features/auth/components/PasswordStrengthMeter';
import { useGoogleSignIn } from '@/features/auth/hooks/useGoogleSignIn';
import { SignUpSchema, type SignUpValues } from '@/features/auth/schema';
import FormField from '@/shared/components/design/FormField';
import GoogleButton from '@/shared/components/design/GoogleButton';
import PrimaryButton from '@/shared/components/design/PrimaryButton';
import Wordmark from '@/shared/components/design/Wordmark';
import AnimatedScreen from '@/shared/components/ui/AnimatedScreen';
import { auth } from '@/shared/services/firebase';
import { useAppTheme } from '@/shared/theme';
import { showErrorToast } from '@/shared/utils/toast';
import { zodResolver } from '@hookform/resolvers/zod';
import { createUserWithEmailAndPassword, updateProfile } from '@react-native-firebase/auth';
import { router } from 'expo-router';
import { useForm } from 'react-hook-form';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const SignUp = () => {
  const t = useAppTheme();
  const insets = useSafeAreaInsets();

  const {
    control,
    watch,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<SignUpValues>({
    resolver: zodResolver(SignUpSchema),
    defaultValues: { name: '', email: '', password: '' },
  });

  const password = watch('password') ?? '';

  const { signInWithGoogle, isSigningIn, ready } = useGoogleSignIn();

  const handleSignUp = async ({ name, email, password }: SignUpValues) => {
    try {
      const userCred = await createUserWithEmailAndPassword(auth, email.trim(), password);
      await updateProfile(userCred.user, { displayName: name });
      router.replace('/');
    } catch (e) {
      showErrorToast(e);
    }
  };

  return (
    <AnimatedScreen>
      <View style={[styles.container, { backgroundColor: t.tokens.semantic.bg }]}>
        <ScrollView
          contentContainerStyle={[
            styles.scroll,
            { paddingTop: insets.top + 28, paddingBottom: insets.bottom + 32 },
          ]}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag"
        >
          <View style={styles.head}>
            <Wordmark size="lg" />
            <Text
              style={[
                styles.subtitle,
                { fontFamily: t.tokens.fonts.sansRegular, color: t.tokens.semantic.inkMute },
              ]}
            >
              A small space for big stories
            </Text>
          </View>

          <View style={styles.fields}>
            <FormField
              control={control}
              name="name"
              label="Name"
              fieldProps={{ placeholder: 'Your name' }}
            />
            <FormField
              control={control}
              name="email"
              label="Email"
              fieldProps={{
                autoCapitalize: 'none',
                keyboardType: 'email-address',
                placeholder: 'you@example.com',
              }}
            />
            <FormField
              control={control}
              name="password"
              label="Password"
              helper="8+ chars · upper · lower · number · symbol"
              fieldProps={{ secureTextEntry: true, placeholder: '••••••••' }}
            />
          </View>

          <PasswordStrengthMeter password={password} />

          <PrimaryButton
            label="Create account"
            onPress={handleSubmit(handleSignUp)}
            loading={isSubmitting}
            disabled={isSubmitting}
          />

          <View style={styles.divider}>
            <View
              style={[styles.dividerLine, { backgroundColor: t.tokens.semantic.hairlineStrong }]}
            />
            <Text
              style={[
                styles.dividerText,
                { fontFamily: t.tokens.fonts.sansRegular, color: t.tokens.semantic.inkFaint },
              ]}
            >
              or
            </Text>
            <View
              style={[styles.dividerLine, { backgroundColor: t.tokens.semantic.hairlineStrong }]}
            />
          </View>

          <GoogleButton
            onPress={signInWithGoogle}
            loading={isSigningIn}
            disabled={!ready || isSigningIn}
          />

          <View style={styles.footer}>
            <Text
              style={[
                styles.footerText,
                { fontFamily: t.tokens.fonts.sansRegular, color: t.tokens.semantic.inkMute },
              ]}
            >
              Already have one?{' '}
            </Text>
            <Pressable onPress={() => router.push('/(auth)/sign-in')}>
              <Text
                style={[
                  styles.footerLink,
                  { fontFamily: t.tokens.fonts.sansSemiBold, color: t.tokens.semantic.accent },
                ]}
              >
                Sign in
              </Text>
            </Pressable>
          </View>
        </ScrollView>
      </View>
    </AnimatedScreen>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: {
    flexGrow: 1,
    paddingHorizontal: 28,
    justifyContent: 'center',
  },
  head: {
    alignItems: 'center',
    marginBottom: 28,
  },
  subtitle: {
    marginTop: 14,
    fontSize: 14,
  },
  fields: {
    gap: 14,
    marginBottom: 14,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
  },
  dividerLine: {
    flex: 1,
    height: StyleSheet.hairlineWidth,
  },
  dividerText: {
    marginHorizontal: 14,
    fontSize: 12,
    letterSpacing: 0.4,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 24,
  },
  footerText: {
    fontSize: 13,
  },
  footerLink: {
    fontSize: 13,
  },
});

export default SignUp;
