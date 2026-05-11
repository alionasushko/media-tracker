import { useGoogleSignIn } from '@/features/auth/hooks/useGoogleSignIn';
import { SignInSchema, type SignInValues } from '@/features/auth/schema';
import FormField from '@/shared/components/design/FormField';
import GoogleButton from '@/shared/components/design/GoogleButton';
import PrimaryButton from '@/shared/components/design/PrimaryButton';
import Wordmark from '@/shared/components/design/Wordmark';
import AnimatedScreen from '@/shared/components/ui/AnimatedScreen';
import { auth } from '@/shared/services/firebase';
import { useAppTheme } from '@/shared/theme';
import { showErrorToast } from '@/shared/utils/toast';
import { zodResolver } from '@hookform/resolvers/zod';
import { signInWithEmailAndPassword } from '@react-native-firebase/auth';
import { router } from 'expo-router';
import { useForm } from 'react-hook-form';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const SignIn = () => {
  const t = useAppTheme();
  const insets = useSafeAreaInsets();

  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<SignInValues>({
    resolver: zodResolver(SignInSchema),
    defaultValues: { email: '', password: '' },
  });

  const { signInWithGoogle, isSigningIn, ready } = useGoogleSignIn();

  const handleSignIn = async ({ email, password }: SignInValues) => {
    try {
      await signInWithEmailAndPassword(auth, email.trim(), password);
      router.replace('/');
    } catch (e) {
      showErrorToast(e);
    }
  };

  return (
    <AnimatedScreen>
      <ScrollView
        style={{ backgroundColor: t.tokens.semantic.bg }}
        contentContainerStyle={[
          styles.container,
          {
            paddingTop: insets.top + 16,
            paddingBottom: insets.bottom + 24,
          },
        ]}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.center}>
          <View style={styles.head}>
            <Wordmark size="lg" />
            <Text
              style={[
                styles.subtitle,
                {
                  fontFamily: t.tokens.fonts.sansRegular,
                  color: t.tokens.semantic.inkMute,
                },
              ]}
            >
              Your stories, still here
            </Text>
          </View>

          <View style={styles.fields}>
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
              fieldProps={{
                secureTextEntry: true,
                placeholder: '••••••••',
              }}
            />
          </View>

          <PrimaryButton
            label="Sign in"
            onPress={handleSubmit(handleSignIn)}
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
                {
                  fontFamily: t.tokens.fonts.sansRegular,
                  color: t.tokens.semantic.inkFaint,
                },
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
              style={{
                fontFamily: t.tokens.fonts.sansRegular,
                fontSize: 13,
                color: t.tokens.semantic.inkMute,
              }}
            >
              New here?{' '}
            </Text>
            <Pressable onPress={() => router.push('/(auth)/sign-up')}>
              <Text
                style={{
                  fontFamily: t.tokens.fonts.sansSemiBold,
                  fontSize: 13,
                  color: t.tokens.semantic.accent,
                }}
              >
                Create an account
              </Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </AnimatedScreen>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    paddingHorizontal: 28,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
  },
  head: {
    alignItems: 'center',
    marginBottom: 36,
  },
  subtitle: {
    marginTop: 14,
    fontSize: 14,
  },
  fields: {
    gap: 14,
    marginBottom: 24,
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
    marginTop: 28,
  },
});

export default SignIn;
