import FormTextInput from '@/components/form/FormTextInput';
import AppButton from '@/components/ui/AppButton';
import Rating from '@/components/ui/Rating';
import { commonStyles } from '@/styles/common';
import { AddItemSchema } from '@/utils/constants/add-media';
import { statuses } from '@/utils/constants/library';
import { showErrorToast } from '@/utils/helpers/toast';
import CoverUploader from '@components/media/CoverUploader';
import { zodResolver } from '@hookform/resolvers/zod';
import { useDeleteItem, useUpdateItemOptimistic, useUserItem } from '@queries/media.queries';
import { auth } from '@services/firebase';
import { deleteCoverByUrl, uploadCoverForItem } from '@services/storage';
import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Appbar, Card, Chip, TextInput, useTheme } from 'react-native-paper';
import { z } from 'zod';

type FormValues = Pick<z.infer<typeof AddItemSchema>, 'notes'>;

const ItemDetail = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data } = useUserItem(id);
  const theme = useTheme();
  const ownerId = auth.currentUser?.uid!;
  const update = useUpdateItemOptimistic(ownerId);
  const del = useDeleteItem(ownerId);
  const [isUploadingCover, setIsUploadingCover] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { isSubmitting, isValid },
  } = useForm<FormValues>({
    resolver: zodResolver(AddItemSchema.pick({ notes: true })),
    values: { notes: data?.notes ?? '' },
    mode: 'onChange',
  });

  if (!data) return null;

  const handleSaveNotes = async ({ notes }: FormValues) => {
    await update.mutateAsync({ id, patch: { notes: notes.trim() } });
  };

  const handleMarkStatus = async (status: 'plan' | 'progress' | 'done' | 'dropped') => {
    await update.mutateAsync({ id, patch: { status } });
  };
  const handleChangeRating = async (v: number) => {
    await update.mutateAsync({ id, patch: { rating: v } });
  };
  const handleClearRating = () => update.mutate({ id, patch: { rating: 0 } });

  const handleRemove = async () => {
    try {
      if (data?.coverUrl) await deleteCoverByUrl(data.coverUrl);
    } catch (e) {
      console.error(e);
    }
    await del.mutateAsync(id);
    router.back();
  };
  const handleGoBack = () => router.back();

  const handleDeleteCover = async () => {
    setIsUploadingCover(true);
    try {
      if (!data?.coverUrl) return;
      try {
        try {
          await deleteCoverByUrl(data.coverUrl);
        } catch (e) {
          console.error(e);
        }
        await update.mutateAsync({ id, patch: { coverUrl: null } });
      } catch (e) {
        showErrorToast(e, 'Failed to delete cover');
      }
    } finally {
      setIsUploadingCover(false);
    }
  };

  const handleUploadCover = async (uri: string) => {
    setIsUploadingCover(true);
    try {
      try {
        const newUrl = await uploadCoverForItem(ownerId, id, uri);
        await update.mutateAsync({ id, patch: { coverUrl: newUrl } });
        if (data?.coverUrl) {
          try {
            await deleteCoverByUrl(data.coverUrl);
          } catch (e) {
            console.error(e);
          }
        }
      } catch (e) {
        showErrorToast(e, 'Failed to change cover');
      }
    } finally {
      setIsUploadingCover(false);
    }
  };

  const handleCoverChange = (uri: string | null) => {
    if (uri === null) handleDeleteCover();
    else handleUploadCover(uri);
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
            loading={isUploadingCover}
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
