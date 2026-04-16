import FormTextInput from '@/shared/components/form/FormTextInput';
import AppButton from '@/shared/components/ui/AppButton';
import Rating from '@/shared/components/ui/Rating';
import { commonStyles } from '@/shared/styles/common';
import { AddMediaSchema } from '@/features/media/schema';
import { statuses } from '@/features/media/constants';
import CoverUploader from '@/features/media/components/CoverUploader';
import { zodResolver } from '@hookform/resolvers/zod';
import { useCoverManager } from '@/features/media/hooks/useCoverManager';
import { useCurrentUserId } from '@/features/auth/hooks/useCurrentUserId';
import { useDeleteMedia, useUpdateMediaOptimistic, useUserMediaEntry } from '@/features/media/queries';
import { deleteCoverByUrl } from '@/shared/services/storage';
import { router, useLocalSearchParams } from 'expo-router';
import { useForm } from 'react-hook-form';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Appbar, Card, Chip, TextInput, useTheme } from 'react-native-paper';
import { z } from 'zod';
import type { Status } from '@/features/media/types';

type FormValues = Pick<z.infer<typeof AddMediaSchema>, 'notes'>;

const ItemDetail = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data } = useUserMediaEntry(id);
  const theme = useTheme();
  const ownerId = useCurrentUserId() ?? '';
  const update = useUpdateMediaOptimistic(ownerId);
  const del = useDeleteMedia(ownerId);
  const { uploadCover, deleteCover, isUploading } = useCoverManager({
    itemId: id,
    ownerId,
    currentCoverUrl: data?.coverUrl,
  });

  const {
    control,
    handleSubmit,
    formState: { isSubmitting, isValid },
  } = useForm<FormValues>({
    resolver: zodResolver(AddMediaSchema.pick({ notes: true })),
    values: { notes: data?.notes ?? '' },
    mode: 'onBlur',
  });

  if (!data) return null;

  const handleSaveNotes = async ({ notes }: FormValues) => {
    await update.mutateAsync({ id, patch: { notes: notes.trim() } });
  };

  const handleMarkStatus = async (status: Status) => {
    await update.mutateAsync({ id, patch: { status } });
  };
  const handleChangeRating = async (v: number) => {
    await update.mutateAsync({ id, patch: { rating: v } });
  };
  const handleClearRating = () => update.mutate({ id, patch: { rating: 0 } });

  const handleRemove = async () => {
    if (data.coverUrl) {
      try {
        await deleteCoverByUrl(data.coverUrl);
      } catch (e) {
        console.error('[ItemDetail] failed to delete cover on remove:', e);
      }
    }
    await del.mutateAsync(id);
    router.back();
  };
  const handleGoBack = () => router.back();

  const handleCoverChange = (uri: string | null) => {
    if (uri === null) deleteCover();
    else uploadCover(uri);
  };

  return (
    <View style={[commonStyles.container, { backgroundColor: theme.colors.background }]}>
      <Appbar.Header>
        <Appbar.BackAction onPress={handleGoBack} />
        <Appbar.Content title={data.title} />
        <Appbar.Action icon="delete" onPress={handleRemove} />
      </Appbar.Header>

      <ScrollView style={styles.scrollView}>
        <Card>
          <CoverUploader
            value={data.coverUrl ?? null}
            loading={isUploading}
            onChange={handleCoverChange}
          />
          <Card.Title title={data.title} subtitle={data.type.toUpperCase()} />
          <Card.Content>
            <View style={styles.statusChipContainer}>
              {statuses.map((s) => (
                <Chip key={s} selected={data.status === s} onPress={() => handleMarkStatus(s)}>
                  {s}
                </Chip>
              ))}
            </View>
            <View style={styles.typeChipContainer}>
              <Rating value={data.rating || 0} onChange={handleChangeRating} />
              <AppButton onPress={handleClearRating}>Clear</AppButton>
            </View>
          </Card.Content>
        </Card>
        <FormTextInput
          control={control}
          name="notes"
          label="Notes"
          textInputProps={{
            placeholder: 'Add some notes, thoughts, or details about this item…',
            returnKeyType: 'default',
            multiline: true,
            numberOfLines: 4,
            style: styles.notesInput,
            right: (
              <TextInput.Icon
                icon="content-save"
                onPress={handleSubmit(handleSaveNotes)}
                disabled={!isValid || isSubmitting}
              />
            ),
          }}
        />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  scrollView: { padding: 12 },
  statusChipContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 8 },
  typeChipContainer: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  notesInput: { minHeight: 100, textAlignVertical: 'top', marginTop: 24 },
});

export default ItemDetail;
