import AppButton from '@/components/ui/AppButton';
import { commonStyles } from '@/styles/common';
import { showErrorToast } from '@/utils/helpers/toast';
import FormTextInput from '@components/form/FormTextInput';
import Logo from '@components/ui/Logo';
import { zodResolver } from '@hookform/resolvers/zod';
import { useGoogleSignIn } from '@hooks/useGoogleSignIn';
import { auth } from '@services/firebase';
import { router } from 'expo-router';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useForm } from 'react-hook-form';
import { View } from 'react-native';
import { Card, Text, useTheme } from 'react-native-paper';
import { z } from 'zod';

const schema = z.object({
  email: z
    .string()
    .trim()
    .pipe(z.email({ message: 'Enter a valid email' })),
  password: z.string(),
});

type FormValues = z.infer<typeof schema>;

const SignIn = () => {
  const theme = useTheme();

  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { email: '', password: '' },
  });

  const { promptAsync, request } = useGoogleSignIn();

  const handleSignIn = async ({ email, password }: FormValues) => {
    try {
      await signInWithEmailAndPassword(auth, email.trim(), password);
      router.replace('/');
    } catch (e) {
      showErrorToast(e);
    }
  };

  // const handleSignInWithGoogle = async () => {
  //   await promptAsync();
  // };

  return (
    <View style={[commonStyles.authContainer, { backgroundColor: theme.colors.background }]}>
      <Card>
        <Card.Content>
          <View style={commonStyles.authTitleWrapper}>
            <Logo variant="wordmark" size="lg" showIcon />
            <Text variant="bodyMedium" style={commonStyles.authTitle}>
              Sign in to your account
            </Text>
          </View>
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
            textInputProps={{ secureTextEntry: true, style: commonStyles.authFormComponentMargin }}
          />
          <AppButton
            mode="contained"
            style={commonStyles.authBtnMargin}
            loading={isSubmitting}
            disabled={isSubmitting}
            onPress={handleSubmit(handleSignIn)}
          >
            Sign In
          </AppButton>
          {/**
           * TODO: add Google auth
           */}
          {/* <AppButton
            icon="google"
            mode="outlined"
            style={commonStyles.authFormComponentMargin}
            disabled={!request}
            onPress={handleSignInWithGoogle}
          >
            Continue with Google
          </AppButton> */}
          <AppButton
            onPress={() => router.push('/(auth)/sign-up')}
            style={commonStyles.authFormComponentMargin}
          >
            Create an account
          </AppButton>
        </Card.Content>
      </Card>
    </View>
  );
};

export default SignIn;
