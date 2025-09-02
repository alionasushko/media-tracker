import AppButton from '@/components/ui/AppButton';
import { commonStyles } from '@/styles/common';
import { AddItemSchema, statusButtons, typeButtons } from '@/utils/constants/add-media';
import FormTextInput from '@components/form/FormTextInput';
import { zodResolver } from '@hookform/resolvers/zod';
import { useCreateItem } from '@queries/media.queries';
import { auth } from '@services/firebase';
import { router } from 'expo-router';
import { Controller, useForm } from 'react-hook-form';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, View } from 'react-native';
import { Appbar, SegmentedButtons, Text, useTheme } from 'react-native-paper';
import { z } from 'zod';

type FormValues = z.infer<typeof AddItemSchema>;

const AddItem = () => {
  const theme = useTheme();
  const create = useCreateItem();

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
    await create.mutateAsync({
      ownerId: auth.currentUser?.uid!,
      title: title.trim(),
      notes: notes.trim(),
      type,
      status,
    });
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
