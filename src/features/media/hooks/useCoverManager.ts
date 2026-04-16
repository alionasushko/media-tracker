import { useUpdateItemOptimistic } from '@/features/media/queries';
import { deleteCoverByUrl, uploadCoverForItem } from '@/shared/services/storage';
import { showErrorToast } from '@/shared/utils/toast';
import { useState } from 'react';

interface Args {
  itemId: string;
  ownerId: string;
  currentCoverUrl: string | null | undefined;
}

export const useCoverManager = ({ itemId, ownerId, currentCoverUrl }: Args) => {
  const update = useUpdateItemOptimistic(ownerId);
  const [isUploading, setIsUploading] = useState(false);

  const removeRemoteCover = async (url: string) => {
    try {
      await deleteCoverByUrl(url);
    } catch (e) {
      console.error('[useCoverManager] failed to delete remote cover:', e);
    }
  };

  const uploadCover = async (uri: string) => {
    setIsUploading(true);
    try {
      const newUrl = await uploadCoverForItem(ownerId, itemId, uri);
      await update.mutateAsync({ id: itemId, patch: { coverUrl: newUrl } });
      if (currentCoverUrl) await removeRemoteCover(currentCoverUrl);
    } catch (e) {
      showErrorToast(e, 'Failed to change cover');
    } finally {
      setIsUploading(false);
    }
  };

  const deleteCover = async () => {
    if (!currentCoverUrl) return;
    setIsUploading(true);
    try {
      await removeRemoteCover(currentCoverUrl);
      await update.mutateAsync({ id: itemId, patch: { coverUrl: null } });
    } catch (e) {
      showErrorToast(e, 'Failed to delete cover');
    } finally {
      setIsUploading(false);
    }
  };

  return { uploadCover, deleteCover, isUploading };
};
