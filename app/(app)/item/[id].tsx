import { useCurrentUserId } from '@/features/auth/hooks/useCurrentUserId';
import DetailActivity from '@/features/media/components/DetailActivity';
import DetailHeader from '@/features/media/components/DetailHeader';
import DetailHero from '@/features/media/components/DetailHero';
import DetailMoreSheet from '@/features/media/components/DetailMoreSheet';
import DetailNotes from '@/features/media/components/DetailNotes';
import DetailRating from '@/features/media/components/DetailRating';
import DetailStatusFab from '@/features/media/components/DetailStatusFab';
import DetailTags from '@/features/media/components/DetailTags';
import DetailTitleBlock from '@/features/media/components/DetailTitleBlock';
import DoneFlash from '@/features/media/components/DoneFlash';
import { STATUS } from '@/features/media/constants';
import { useCoverManager } from '@/features/media/hooks/useCoverManager';
import { useDeleteMedia, useUpdateMedia, useUserMediaEntry } from '@/features/media/queries';
import type { Status } from '@/features/media/types';
import AnimatedScreen from '@/shared/components/ui/AnimatedScreen';
import ConfirmDialog from '@/shared/components/ui/ConfirmDialog';
import { captureImageFromCamera, pickImageFromLibrary } from '@/shared/services/storage';
import { commonStyles } from '@/shared/styles/common';
import { useAppTheme } from '@/shared/theme';
import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { View } from 'react-native';
import Animated, { useAnimatedScrollHandler, useSharedValue } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const DONE_FLASH_MS = 1200;

const ItemDetail = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data } = useUserMediaEntry(id);
  const t = useAppTheme();
  const insets = useSafeAreaInsets();
  const ownerId = useCurrentUserId() ?? '';
  const update = useUpdateMedia(ownerId);
  const del = useDeleteMedia(ownerId);
  const { uploadCover, deleteCover, isUploading } = useCoverManager({
    itemId: id,
    ownerId,
    currentCoverUrl: data?.coverUrl,
  });

  const [deleteVisible, setDeleteVisible] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const [doneFlash, setDoneFlash] = useState(false);

  const scrollY = useSharedValue(0);
  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (e) => {
      scrollY.value = e.contentOffset.y;
    },
  });

  if (!data) return null;

  const handleMarkStatus = (status: Status) => {
    if (status === STATUS.DONE) {
      setDoneFlash(true);
      setTimeout(() => setDoneFlash(false), DONE_FLASH_MS);
    }
    update.mutate({ id, patch: { status } });
  };

  const handleChangeRating = (v: number) => update.mutate({ id, patch: { rating: v } });
  const handleClearRating = () => update.mutate({ id, patch: { rating: 0 } });
  const handleSaveNotes = (notes: string) => update.mutate({ id, patch: { notes } });

  const handleConfirmDelete = () => {
    setDeleteVisible(false);
    del.mutate({ id, coverUrl: data.coverUrl }, { onSuccess: () => router.back() });
  };

  const handleReplaceCover = async () => {
    const uri = await pickImageFromLibrary();
    if (uri) uploadCover(uri);
  };

  const handleTakeCoverPhoto = async () => {
    const uri = await captureImageFromCamera();
    if (uri) uploadCover(uri);
  };

  const handleRemoveCover = () => deleteCover();

  return (
    <AnimatedScreen>
      <View style={[commonStyles.container, { backgroundColor: t.tokens.semantic.bg }]}>
        <DetailHeader
          title={data.title}
          scrollY={scrollY}
          onBack={() => router.back()}
          onMore={() => setMoreOpen(true)}
        />

        <Animated.ScrollView
          onScroll={scrollHandler}
          scrollEventThrottle={16}
          contentContainerStyle={{ paddingBottom: insets.bottom + 140 }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <DetailHero
            coverUrl={data.coverUrl}
            title={data.title}
            type={data.type}
            scrollY={scrollY}
            isUploading={isUploading}
          />
          <DetailTitleBlock title={data.title} type={data.type} status={data.status} />
          <DetailRating
            rating={data.rating ?? 0}
            onChange={handleChangeRating}
            onClear={handleClearRating}
          />
          <DetailNotes serverNotes={data.notes ?? ''} onSave={handleSaveNotes} />
          <DetailTags tags={data.tags ?? []} />
          <DetailActivity
            status={data.status}
            createdAt={data.createdAt}
            updatedAt={data.updatedAt}
          />
        </Animated.ScrollView>

        <DetailStatusFab current={data.status} onChange={handleMarkStatus} />

        <DoneFlash visible={doneFlash} />

        <DetailMoreSheet
          visible={moreOpen}
          hasCover={!!data.coverUrl}
          onClose={() => setMoreOpen(false)}
          onReplaceCover={handleReplaceCover}
          onTakePhoto={handleTakeCoverPhoto}
          onRemoveCover={handleRemoveCover}
          onDelete={() => setDeleteVisible(true)}
        />

        <ConfirmDialog
          visible={deleteVisible}
          onDismiss={() => setDeleteVisible(false)}
          onConfirm={handleConfirmDelete}
          title="Delete item"
          message={`Are you sure you want to delete "${data.title}"? This can't be undone.`}
          confirmLabel="Delete"
          destructive
        />
      </View>
    </AnimatedScreen>
  );
};

export default ItemDetail;
