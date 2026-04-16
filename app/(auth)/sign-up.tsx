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
import { View } from 'react-native';
import { Card, Text, useTheme } from 'react-native-paper';

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
    <View style={[commonStyles.authContainer, { backgroundColor: theme.colors.background }]}>
      <Card>
        <Card.Content>
          <View style={commonStyles.authTitleWrapper}>
            <Logo variant="wordmark" size="lg" showIcon />
            <Text variant="bodyMedium" style={commonStyles.authTitle}>
              Create your account
            </Text>
          </View>
          <FormTextInput control={control} name="name" label="Name" />
          <FormTextInput
            control={control}
            name="email"
            label="Email"
            textInputProps={{
              autoCapitalize: 'none',
              keyboardType: 'email-address',
              style: commonStyles.authFormComponentMargin,
            }}
          />
          <FormTextInput
            control={control}
            name="password"
            label="Password"
            textInputProps={{ secureTextEntry: true, style: commonStyles.authFormComponentMargin }}
          />
          <AppButton
            mode="contained"
            style={commonStyles.authBtnMargin}
            loading={isSubmitting}
            disabled={isSubmitting}
            onPress={handleSubmit(handleSignUp)}
          >
            Create Account
          </AppButton>
          <AppButton
            icon="google"
            mode="outlined"
            style={commonStyles.authFormComponentMargin}
            loading={isSigningIn}
            disabled={!ready || isSigningIn}
            onPress={signInWithGoogle}
          >
            Continue with Google
          </AppButton>
          <AppButton
            onPress={() => router.push('/(auth)/sign-in')}
            style={commonStyles.authFormComponentMargin}
          >
            Already have an account?
          </AppButton>
        </Card.Content>
      </Card>
    </View>
  );
};

export default SignUp;
