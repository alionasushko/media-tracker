import { connectAuthEmulator, getAuth } from '@react-native-firebase/auth';
import { connectFirestoreEmulator, getFirestore } from '@react-native-firebase/firestore';
import { connectStorageEmulator, getStorage } from '@react-native-firebase/storage';
import { Platform } from 'react-native';

const EMULATOR_HOST = Platform.OS === 'android' ? '10.0.2.2' : 'localhost';
const USE_EMULATOR = __DEV__ && process.env.EXPO_PUBLIC_USE_EMULATOR === 'true';

export const auth = getAuth();
export const db = getFirestore();
export const storage = getStorage();

if (USE_EMULATOR) {
  connectAuthEmulator(auth, `http://${EMULATOR_HOST}:9099`);
  connectFirestoreEmulator(db, EMULATOR_HOST, 8080);
  connectStorageEmulator(storage, EMULATOR_HOST, 9199);
}
