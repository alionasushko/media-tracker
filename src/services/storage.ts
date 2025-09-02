import { storage } from '@services/firebase';
import * as ImagePicker from 'expo-image-picker';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';

export const pickImageFromLibrary = async () => {
  /**
   * TODO: change deprecated field
   */
  const res = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    quality: 0.8,
  });
  if (res.canceled) return null;
  return res.assets[0].uri;
};

export const uploadCoverForItem = async (ownerId: string, itemId: string, uri: string) => {
  const response = await fetch(uri);
  const blob = await response.blob();
  const objectRef = ref(storage, `covers/${ownerId}/${itemId}.jpg`);
  await uploadBytes(objectRef, blob, { contentType: 'image/jpeg' });
  return await getDownloadURL(objectRef);
};
