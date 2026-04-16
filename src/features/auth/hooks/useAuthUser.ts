import { auth } from '@/shared/services/firebase';
import { onAuthStateChanged, type FirebaseAuthTypes } from '@react-native-firebase/auth';
import { useEffect, useState } from 'react';

export const useAuthUser = () => {
  const [user, setUser] = useState<FirebaseAuthTypes.User | null>(null);
  const [initializing, setInitializing] = useState(true);

  useEffect(() => {
    const sub = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setInitializing(false);
    });
    return () => sub();
  }, []);

  return { user, initializing };
};
