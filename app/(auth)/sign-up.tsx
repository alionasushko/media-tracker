import AnimatedScreen from '@/shared/components/ui/AnimatedScreen';
import AppButton from '@/shared/components/ui/AppButton';
import { commonStyles } from '@/shared/styles/common';
import { showErrorToast } from '@/shared/utils/toast';
import FormTextInput from '@/shared/components/form/FormTextInput';
import Logo from '@/shared/components/ui/Logo';
import { zodResolver } from '@hookform/resolvers/zod';
import { useGoogleSignIn } from '@/features/auth/hooks/useGoogleSignIn';
import { SignUpSchema, type SignUpValues } from '@/features/auth/schema';
import { auth } from '@/shared/services/firebase';
import { router } from 'expo-router';
import { createUserWithEmailAndPassword, updateProfile } from '@react-native-firebase/auth';
import { useForm } from 'react-hook-form';
import { Keyboard, Pressable, StyleSheet, TouchableWithoutFeedback, View } from 'react-native';
import { Divider, Text, useTheme } from 'react-native-paper';

const SignUp = () => {
  const theme = useTheme();

  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<SignUpValues>({
    resolver: zodResolver(SignUpSchema),
    defaultValues: { name: '', email: '', password: '' },
  });

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
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <View style={[commonStyles.authContainer, { backgroundColor: theme.colors.background }]}>
          <View style={commonStyles.authTitleWrapper}>
            <Logo variant="wordmark" size="lg" showIcon />
            <Text
              variant="bodyMedium"
              style={[commonStyles.authTitle, { color: theme.colors.onSurfaceVariant }]}
            >
              Create your account
            </Text>
          </View>

          <View style={styles.formGroup}>
            <FormTextInput control={control} name="name" label="Name" />
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
            onPress={handleSubmit(handleSignUp)}
          >
            Create Account
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
              Already have an account?
            </Text>
            <Pressable onPress={() => router.push('/(auth)/sign-in')}>
              <Text style={[styles.footerLink, { color: theme.colors.primary }]}>Sign in</Text>
            </Pressable>
          </View>
        </View>
      </TouchableWithoutFeedback>
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

export default SignUp;
