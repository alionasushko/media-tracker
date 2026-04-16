import AnimatedScreen from '@/shared/components/ui/AnimatedScreen';
import AppButton from '@/shared/components/ui/AppButton';
import { commonStyles } from '@/shared/styles/common';
import { showErrorToast } from '@/shared/utils/toast';
import FormTextInput from '@/shared/components/form/FormTextInput';
import Logo from '@/shared/components/ui/Logo';
import { zodResolver } from '@hookform/resolvers/zod';
import { useGoogleSignIn } from '@/features/auth/hooks/useGoogleSignIn';
import { SignInSchema, type SignInValues } from '@/features/auth/schema';
import { auth } from '@/shared/services/firebase';
import { router } from 'expo-router';
import { signInWithEmailAndPassword } from '@react-native-firebase/auth';
import { useForm } from 'react-hook-form';
import { Pressable, StyleSheet, View } from 'react-native';
import { Divider, Text, useTheme } from 'react-native-paper';

const SignIn = () => {
  const theme = useTheme();

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
      <View style={[commonStyles.authContainer, { backgroundColor: theme.colors.background }]}>
        <View style={commonStyles.authTitleWrapper}>
          <Logo variant="wordmark" size="lg" showIcon />
          <Text
            variant="bodyMedium"
            style={[commonStyles.authTitle, { color: theme.colors.onSurfaceVariant }]}
          >
            Sign in to your account
          </Text>
        </View>

        <View style={styles.formGroup}>
          <FormTextInput
            control={control}
            name="email"
            label="Email"
            textInputProps={{ autoCapitalize: 'none', keyboardType: 'email-address' }}
          />
          <FormTextInput
            control={control}
            name="password"
            label="Password"
            textInputProps={{ secureTextEntry: true }}
          />
        </View>

        <AppButton
          mode="contained"
          style={styles.primaryBtn}
          loading={isSubmitting}
          disabled={isSubmitting}
          onPress={handleSubmit(handleSignIn)}
        >
          Sign In
        </AppButton>

        <View style={styles.dividerRow}>
          <Divider style={[styles.divider, { backgroundColor: theme.colors.outlineVariant }]} />
          <Text style={[styles.dividerText, { color: theme.colors.onSurfaceVariant }]}>or</Text>
          <Divider style={[styles.divider, { backgroundColor: theme.colors.outlineVariant }]} />
        </View>

        <AppButton
          icon="google"
          mode="outlined"
          loading={isSigningIn}
          disabled={!ready || isSigningIn}
          onPress={signInWithGoogle}
        >
          Continue with Google
        </AppButton>

        <View style={styles.footerRow}>
          <Text style={[styles.footerText, { color: theme.colors.onSurfaceVariant }]}>
            Don't have an account?
          </Text>
          <Pressable onPress={() => router.push('/(auth)/sign-up')}>
            <Text style={[styles.footerLink, { color: theme.colors.primary }]}>
              Create one
            </Text>
          </Pressable>
        </View>
      </View>
    </AnimatedScreen>
  );
};

const styles = StyleSheet.create({
  formGroup: { gap: 12, marginBottom: 24 },
  primaryBtn: { marginBottom: 20 },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    marginBottom: 20,
  },
  divider: { flex: 1, height: 1 },
  dividerText: { fontFamily: 'Inter-Regular', fontSize: 13 },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 4,
    marginTop: 32,
  },
  footerText: { fontFamily: 'Inter-Regular', fontSize: 14 },
  footerLink: { fontFamily: 'Inter-SemiBold', fontSize: 14 },
});

export default SignIn;
