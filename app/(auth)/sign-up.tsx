import AppButton from '@/components/ui/AppButton';
import { commonStyles } from '@/styles/common';
import { showErrorToast } from '@/utils/helpers/toast';
import FormTextInput from '@components/form/FormTextInput';
import Logo from '@components/ui/Logo';
import { zodResolver } from '@hookform/resolvers/zod';
import { auth } from '@services/firebase';
import { router } from 'expo-router';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { useForm } from 'react-hook-form';
import { View } from 'react-native';
import { Card, Text, useTheme } from 'react-native-paper';
import { z } from 'zod';

const schema = z.object({
  name: z.string().min(2, 'Name is required'),
  email: z
    .string()
    .trim()
    .pipe(z.email({ message: 'Enter a valid email' })),
  password: z
    .string()
    .min(8, 'At least 8 characters')
    .max(72, 'Too long (max 72)')
    .refine((v) => /[a-z]/.test(v), 'Add a lowercase letter')
    .refine((v) => /[A-Z]/.test(v), 'Add an uppercase letter')
    .refine((v) => /\d/.test(v), 'Add a number')
    .refine((v) => /[!"#$%&'()*+,-./:;<=>?@[\\\]^_`{|}~]/.test(v), 'Add a symbol'),
});

type FormValues = z.infer<typeof schema>;

const SignUp = () => {
  const theme = useTheme();

  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { name: '', email: '', password: '' },
  });

  const handleSignUp = async ({ name, email, password }: FormValues) => {
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
