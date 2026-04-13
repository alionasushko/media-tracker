import { auth } from '@services/firebase';
import { showErrorToast } from '@/utils/helpers/toast';
import { GoogleAuthProvider, signInWithCredential } from '@react-native-firebase/auth';
import {
  GoogleSignin,
  statusCodes,
  isErrorWithCode,
} from '@react-native-google-signin/google-signin';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';

GoogleSignin.configure({
  webClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID,
});

export const useGoogleSignIn = () => {
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [hasPlayServices, setHasPlayServices] = useState(false);

  useEffect(() => {
    GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true })
      .then(() => setHasPlayServices(true))
      .catch(() => setHasPlayServices(false));
  }, []);

  const signInWithGoogle = async () => {
    try {
      setIsSigningIn(true);
      await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
      const response = await GoogleSignin.signIn();

      if (response.type !== 'success') {
        return;
      }

      const idToken = response.data.idToken;
      if (!idToken) {
        throw new Error('Google sign-in did not return an ID token');
      }

      const credential = GoogleAuthProvider.credential(idToken);
      await signInWithCredential(auth, credential);
      router.replace('/');
    } catch (e) {
      if (isErrorWithCode(e) && e.code === statusCodes.SIGN_IN_CANCELLED) {
        return;
      }
      showErrorToast(e);
    } finally {
      setIsSigningIn(false);
    }
  };

  return { signInWithGoogle, isSigningIn, ready: hasPlayServices };
};
