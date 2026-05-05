import { GoogleSignin } from '@react-native-google-signin/google-signin';

const webClientId = process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID;
if (!webClientId) {
  console.warn(
    '[google-signin] EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID is not set; Google sign-in will fail.',
  );
}

GoogleSignin.configure({ webClientId });
