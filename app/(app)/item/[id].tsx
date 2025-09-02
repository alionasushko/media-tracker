import FormTextInput from '@/components/form/FormTextInput';
import AppButton from '@/components/ui/AppButton';
import Rating from '@/components/ui/Rating';
import { commonStyles } from '@/styles/common';
import { AddItemSchema } from '@/utils/constants/add-media';
import { statuses } from '@/utils/constants/library';
import { zodResolver } from '@hookform/resolvers/zod';
import { useDeleteItem, useUpdateItemOptimistic, useUserItem } from '@queries/media.queries';
import { auth } from '@services/firebase';
import { router, useLocalSearchParams } from 'expo-router';
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
    await del.mutateAsync(id);
    router.back();
  };
  const handleGoBack = () => router.back();

  return (
    <View style={[commonStyles.container, { backgroundColor: theme.colors.background }]}>
      <Appbar.Header>
        <Appbar.BackAction onPress={handleGoBack} />
        <Appbar.Content title={data.title} />
        <Appbar.Action icon="delete" onPress={handleRemove} />
      </Appbar.Header>

      <ScrollView style={styles.scrollView}>
        <Card>
          {data.coverUrl ? <Card.Cover source={{ uri: data.coverUrl }} /> : null}
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
