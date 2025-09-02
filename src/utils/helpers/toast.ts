import { FirebaseError } from 'firebase/app';
import Toast from 'react-native-toast-message';

export const getErrorMessage = (error: unknown) => {
  let message = 'Something went wrong. Please try again.';

  if (error instanceof FirebaseError) {
    switch (error.code) {
      // Firebase Auth errors
      case 'auth/invalid-credential':
      case 'auth/wrong-password':
        message = 'The email or password you entered is incorrect.';
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
