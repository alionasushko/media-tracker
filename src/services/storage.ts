import { storage } from '@services/firebase';
import { ImageManipulator, SaveFormat } from 'expo-image-manipulator';
import * as ImagePicker from 'expo-image-picker';
import { deleteObject, getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { Image } from 'react-native';

export const pickImageFromLibrary = async () => {
  const res = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: 'images',
  });
  if (res.canceled) return null;
  return res.assets[0].uri;
};

const getImageSize = (uri: string) =>
  new Promise<{ width: number; height: number }>((resolve) => {
    Image.getSize(
      uri,
      (width, height) => resolve({ width, height }),
      () => resolve({ width: 0, height: 0 }),
    );
  });

const processCoverImage = async (
  uri: string,
  maxDimension = 1280,
  quality = 0.7,
): Promise<{ uri: string; contentType?: string; ext?: string }> => {
  try {
    const { width, height } = await getImageSize(uri);

    const ctx = ImageManipulator.manipulate(uri);

    if (width && height) {
      if (width >= height && width > maxDimension) {
        ctx.resize({ width: maxDimension });
      } else if (height > width && height > maxDimension) {
        ctx.resize({ height: maxDimension });
      }
    }

    const rendered = await ctx.renderAsync();
    const saved = await rendered.saveAsync({ format: SaveFormat.JPEG, compress: quality });
    ctx.release();
    rendered.release();
    return { uri: saved.uri, contentType: 'image/jpeg', ext: 'jpg' };
  } catch {
    return { uri };
  }
};

export const uploadCoverForItem = async (ownerId: string, itemId: string, uri: string) => {
  const processed = await processCoverImage(uri);
  const response = await fetch(processed.uri);
  const blob = await response.blob();

  const ct = processed.contentType || (blob as any).type || 'image/jpeg';
  const ext = 'jpg';

  const version = Date.now();
  const path = `covers/${ownerId}/${itemId}_${version}.${ext}`;
  const objectRef = ref(storage, path);
  await uploadBytes(objectRef, blob, { contentType: ct });

  return path;
};

export const deleteCoverByUrl = async (url: string) => {
  const objectRef = ref(storage, url);
  await deleteObject(objectRef);
};

export const getSignedDownloadUrl = async (pathOrUrl: string) => {
  const objectRef = ref(storage, pathOrUrl);
  return await getDownloadURL(objectRef);
};
