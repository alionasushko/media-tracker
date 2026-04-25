import { useCurrentUserId } from '@/features/auth/hooks/useCurrentUserId';
import CoverUploader from '@/features/media/components/CoverUploader';
import { statusButtons, typeButtons } from '@/features/media/constants';
import { useCreateMedia, useUpdateMedia } from '@/features/media/queries';
import { AddMediaSchema } from '@/features/media/schema';
import FormSegmentedButtons from '@/shared/components/form/FormSegmentedButtons';
import FormTextInput from '@/shared/components/form/FormTextInput';
import AnimatedScreen from '@/shared/components/ui/AnimatedScreen';
import ConfirmDialog from '@/shared/components/ui/ConfirmDialog';
import { uploadCoverForMedia } from '@/shared/services/storage';
import { commonStyles } from '@/shared/styles/common';
import { showErrorToast } from '@/shared/utils/toast';
import { zodResolver } from '@hookform/resolvers/zod';
import { usePreventRemove, type NavigationAction } from '@react-navigation/native';
import { router, useNavigation } from 'expo-router';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { ActivityIndicator, Pressable, StyleSheet, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';
import { Icon, Text, useTheme } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { z } from 'zod';

type FormValues = z.infer<typeof AddMediaSchema>;

const AddItem = () => {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const ownerId = useCurrentUserId();
  const create = useCreateMedia();
  const update = useUpdateMedia(ownerId ?? '');
  const navigation = useNavigation();
  const [coverUri, setCoverUri] = useState<string | null>(null);
  const [exitAllowed, setExitAllowed] = useState(false);
  const [pendingExitAction, setPendingExitAction] = useState<NavigationAction | null>(null);

  const {
    control,
    handleSubmit,
    formState: { isSubmitting, isValid, isDirty },
  } = useForm<FormValues>({
    resolver: zodResolver(AddMediaSchema),
    defaultValues: { title: '', notes: '', type: 'movie', status: 'plan' },
    mode: 'onBlur',
  });

  const hasUnsavedChanges = (isDirty || coverUri !== null) && !exitAllowed;

  usePreventRemove(hasUnsavedChanges, ({ data }) => {
    setPendingExitAction(data.action);
  });

  const handleConfirmDiscard = () => {
    const action = pendingExitAction;
    setPendingExitAction(null);
    if (action) navigation.dispatch(action);
  };

  useEffect(() => {
    if (!exitAllowed) return;
    router.back();
    router.replace('/(app)');
  }, [exitAllowed]);

  const onSubmit = async ({ title, notes, type, status }: FormValues) => {
    if (!ownerId) return;
    const created = await create.mutateAsync({
      ownerId,
      title: title.trim(),
      notes: notes.trim(),
      type,
      status,
    });

    if (coverUri && created?.id) {
      try {
        const url = await uploadCoverForMedia(ownerId, created.id, coverUri);
        await update.mutateAsync({ id: created.id, patch: { coverUrl: url } });
      } catch (e) {
        showErrorToast(e, 'Cover upload failed');
      }
    }

    setExitAllowed(true);
  };

  const handleGoBack = () => router.back();
  const canSave = isValid && !isSubmitting;

  return (
    <AnimatedScreen>
      <View style={[commonStyles.container, { backgroundColor: theme.colors.background }]}>
        <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
          <Pressable onPress={handleGoBack} hitSlop={8}>
            <Icon source="arrow-left" size={22} color={theme.colors.onBackground} />
          </Pressable>
          <Text style={[styles.headerTitle, { color: theme.colors.onBackground }]}>Add Media</Text>
          <Pressable
            onPress={handleSubmit(onSubmit)}
            disabled={!canSave}
            hitSlop={8}
            style={!canSave && styles.saveDisabled}
          >
            {isSubmitting ? (
              <ActivityIndicator size="small" color={theme.colors.primary} />
            ) : (
              <Icon source="content-save" size={24} color={theme.colors.primary} />
            )}
          </Pressable>
        </View>

        <KeyboardAwareScrollView
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={styles.scrollContent}
          bottomOffset={20}
        >
          <View style={styles.section}>
            <Text style={[styles.sectionLabel, { color: theme.colors.onSurfaceVariant }]}>
              COVER
            </Text>
            <CoverUploader value={coverUri} onChange={setCoverUri} />
          </View>

          <View style={styles.section}>
            <Text style={[styles.sectionLabel, { color: theme.colors.onSurfaceVariant }]}>
              DETAILS
            </Text>
            <View style={styles.fieldGroup}>
              <FormTextInput
                control={control}
                name="title"
                label="Title"
                textInputProps={{
                  placeholder: 'Enter title',
                  returnKeyType: 'next',
                }}
              />
              <FormTextInput
                control={control}
                name="notes"
                label="Notes"
                textInputProps={{
                  placeholder: 'Add notes or thoughts\u2026',
                  returnKeyType: 'default',
                  multiline: true,
                  numberOfLines: 4,
                  style: styles.notesInput,
                }}
              />
            </View>
          </View>

          <View style={styles.section}>
            <Text style={[styles.sectionLabel, { color: theme.colors.onSurfaceVariant }]}>
              TYPE
            </Text>
            <FormSegmentedButtons control={control} name="type" buttons={typeButtons} />
          </View>

          <View style={styles.section}>
            <Text style={[styles.sectionLabel, { color: theme.colors.onSurfaceVariant }]}>
              STATUS
            </Text>
            <FormSegmentedButtons control={control} name="status" buttons={statusButtons} />
          </View>
        </KeyboardAwareScrollView>
        <ConfirmDialog
          visible={pendingExitAction !== null}
          onDismiss={() => setPendingExitAction(null)}
          onConfirm={handleConfirmDiscard}
          title="Discard changes?"
          message="You have unsaved changes. Are you sure you want to discard them?"
          confirmLabel="Discard"
          cancelLabel="Keep editing"
          destructive
        />
      </View>
    </AnimatedScreen>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 12,
    gap: 16,
  },
  headerTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 28,
    letterSpacing: -0.5,
    flex: 1,
  },
  saveDisabled: { opacity: 0.4 },
  scrollContent: { paddingHorizontal: 20, paddingTop: 8, paddingBottom: 40 },
  section: { marginBottom: 32 },
  sectionLabel: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 11,
    letterSpacing: 1,
    marginBottom: 12,
  },
  fieldGroup: { gap: 12 },
  notesInput: { minHeight: 100, textAlignVertical: 'top' },
});

export default AddItem;
