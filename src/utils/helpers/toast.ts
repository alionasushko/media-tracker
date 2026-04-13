import Toast from 'react-native-toast-message';

const isFirebaseError = (e: unknown): e is Error & { code: string } =>
  e instanceof Error && typeof (e as { code?: unknown }).code === 'string';

export const getErrorMessage = (error: unknown) => {
  let message = 'Something went wrong. Please try again.';

  if (isFirebaseError(error)) {
    switch (error.code) {
      // Firebase Auth errors
      case 'auth/invalid-credential':
      case 'auth/wrong-password':
        message = 'The email or password you entered is incorrect.';
        break;
      case 'auth/account-exists-with-different-credential':
        message =
          'An account with the same email exists using a different sign-in method. Sign in with that method first, then link Google in settings.';
        break;
      case 'auth/user-not-found':
        message = 'No account found with this email.';
        break;
      case 'auth/invalid-email':
        message = 'Please enter a valid email address.';
        break;
      case 'auth/email-already-in-use':
        message = 'An account with this email already exists.';
        break;
      case 'auth/too-many-requests':
        message = 'Too many attempts. Please try again later.';
        break;
      case 'auth/network-request-failed':
        message = 'Network error. Check your internet connection.';
        break;
      case 'auth/operation-not-allowed':
        message = 'This sign-in method is not enabled in Firebase.';
        break;
      case 'auth/unauthorized-domain':
        message = 'This domain is not authorized for OAuth. Add it in Firebase Auth settings.';
        break;

      // Firestore/Storage errors
      case 'permission-denied':
        message = 'You do not have permission to perform this action.';
        break;
      case 'unavailable':
        message = 'Service temporarily unavailable. Please try again later.';
        break;

      default:
        message = error.message;
    }
  } else if (error instanceof Error) {
    message = error.message;
  }

  return message;
};

export const showErrorToast = (error: unknown, title = 'Error ❌') => {
  const message = getErrorMessage(error);
  Toast.show({ type: 'error', text1: title, text2: message });
};
