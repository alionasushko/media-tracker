import AppButton from '@/components/ui/AppButton';
import { commonStyles } from '@/styles/common';
import { AddItemSchema, statusButtons, typeButtons } from '@/utils/constants/add-media';
import FormTextInput from '@components/form/FormTextInput';
import CoverUploader from '@components/media/CoverUploader';
import { zodResolver } from '@hookform/resolvers/zod';
import { useCreateItem, useUpdateItem } from '@queries/media.queries';
import { auth } from '@services/firebase';
import { router } from 'expo-router';
import { Controller, useForm } from 'react-hook-form';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, View } from 'react-native';
import { Appbar, SegmentedButtons, Text, useTheme } from 'react-native-paper';
import { z } from 'zod';
import { uploadCoverForItem } from '@services/storage';
import { useState } from 'react';
import { showErrorToast } from '@/utils/helpers/toast';

type FormValues = z.infer<typeof AddItemSchema>;

const AddItem = () => {
  const theme = useTheme();
  const ownerId = auth.currentUser?.uid!;
  const create = useCreateItem();
  const update = useUpdateItem(ownerId);
  const [coverUri, setCoverUri] = useState<string | null>(null);

  const {
    control,
    handleSubmit,
    formState: { isSubmitting, isValid },
  } = useForm<FormValues>({
    resolver: zodResolver(AddItemSchema),
    defaultValues: { title: '', notes: '', type: 'movie', status: 'plan' },
    mode: 'onChange',
  });

  const onSubmit = async ({ title, notes, type, status }: FormValues) => {
    const created = await create.mutateAsync({
      ownerId,
      title: title.trim(),
      notes: notes.trim(),
      type,
      status,
    });

    if (coverUri && created?.id) {
      try {
        const url = await uploadCoverForItem(ownerId, created.id, coverUri);
        await update.mutateAsync({ id: created.id, patch: { coverUrl: url } });
      } catch (e) {
        showErrorToast(e, 'Cover upload failed');
      }
    }

    router.back();
    router.replace('/(app)');
  };

  const handleGoBack = () => router.back();

  const canSave = isValid && !isSubmitting;

  return (
    <View style={[commonStyles.container, { backgroundColor: theme.colors.background }]}>
      <Appbar.Header>
        <Appbar.BackAction onPress={handleGoBack} />
        <Appbar.Content title="Add Media" />
      </Appbar.Header>

      <KeyboardAvoidingView
        style={commonStyles.container}
        behavior={Platform.select({ ios: 'padding', android: undefined })}
      >
        <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={styles.scrollView}>
          <View style={styles.gap24}>
            <CoverUploader value={coverUri} onChange={setCoverUri} />
            <View style={styles.gap12}>
              <Text variant="titleMedium">Details</Text>
              <FormTextInput
                control={control}
                name="title"
                label="Title"
                textInputProps={{
                  placeholder: 'Enter the movie, book, series, or game title',
                  returnKeyType: 'next',
                }}
              />
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
                }}
              />
            </View>
            <View style={styles.gap12}>
              <Text variant="titleMedium">Type</Text>
              <Controller
                control={control}
                name="type"
                render={({ field: { value, onChange } }) => (
                  <SegmentedButtons
                    value={value}
                    onValueChange={(v) => onChange(v as FormValues['type'])}
                    buttons={typeButtons}
                    density="regular"
                  />
                )}
              />
            </View>
            <View style={styles.gap12}>
              <Text variant="titleMedium">Status</Text>
              <Controller
                control={control}
                name="status"
                render={({ field: { value, onChange } }) => (
                  <SegmentedButtons
                    value={value}
                    onValueChange={(v) => onChange(v as FormValues['status'])}
                    buttons={statusButtons}
                    density="regular"
                  />
                )}
              />
            </View>
            <AppButton
              mode="contained"
              icon={isSubmitting ? undefined : 'content-save'}
              onPress={handleSubmit(onSubmit)}
              disabled={!canSave}
              loading={isSubmitting}
            >
              {isSubmitting ? 'Saving…' : 'Save'}
            </AppButton>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  scrollView: { padding: 16, gap: 16 },
  gap24: { gap: 24 },
  gap12: { gap: 12 },
  notesInput: { minHeight: 100, textAlignVertical: 'top' },
});

export default AddItem;
