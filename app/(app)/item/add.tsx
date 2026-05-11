import { useCurrentUserId } from '@/features/auth/hooks/useCurrentUserId';
import AddCoverRow from '@/features/media/components/AddCoverRow';
import AddItemHeader from '@/features/media/components/AddItemHeader';
import AddStatusSegmented from '@/features/media/components/AddStatusSegmented';
import AddTypeGrid from '@/features/media/components/AddTypeGrid';
import { MEDIA_TYPE, STATUS } from '@/features/media/constants';
import { useCreateMedia, useUpdateMedia } from '@/features/media/queries';
import { AddMediaSchema } from '@/features/media/schema';
import FormField from '@/shared/components/design/FormField';
import { Display, Eyebrow } from '@/shared/components/design/text';
import AnimatedScreen from '@/shared/components/ui/AnimatedScreen';
import ConfirmDialog from '@/shared/components/ui/ConfirmDialog';
import {
  captureImageFromCamera,
  pickImageFromLibrary,
  uploadCoverForMedia,
} from '@/shared/services/storage';
import { useAppTheme } from '@/shared/theme';
import { showErrorToast } from '@/shared/utils/toast';
import { zodResolver } from '@hookform/resolvers/zod';
import { usePreventRemove, type NavigationAction } from '@react-navigation/native';
import { router, useNavigation } from 'expo-router';
import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { StyleSheet, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { z } from 'zod';

type FormValues = z.infer<typeof AddMediaSchema>;

const AddItem = () => {
  const t = useAppTheme();
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
    watch,
    handleSubmit,
    formState: { isSubmitting, isValid, isDirty },
  } = useForm<FormValues>({
    resolver: zodResolver(AddMediaSchema),
    defaultValues: { title: '', notes: '', type: MEDIA_TYPE.MOVIE, status: STATUS.PLAN },
    mode: 'onBlur',
  });

  const currentTitle = watch('title');
  const currentType = watch('type');

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
    router.replace('/(app)/(tabs)/library');
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

  const handleTakePhoto = async () => {
    const uri = await captureImageFromCamera();
    if (uri) setCoverUri(uri);
  };

  const handlePickImage = async () => {
    const uri = await pickImageFromLibrary();
    if (uri) setCoverUri(uri);
  };

  const canSave = isValid && !isSubmitting;

  return (
    <AnimatedScreen>
      <View style={[styles.container, { backgroundColor: t.tokens.semantic.bg }]}>
        <AddItemHeader
          onBack={() => router.back()}
          onSave={handleSubmit(onSubmit)}
          canSave={canSave}
          isSubmitting={isSubmitting}
        />

        <KeyboardAwareScrollView
          contentContainerStyle={[styles.scroll, { paddingBottom: insets.bottom + 60 }]}
          keyboardShouldPersistTaps="handled"
          bottomOffset={20}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.title}>
            <Eyebrow>New entry</Eyebrow>
            <Display size={30} style={styles.titleText}>
              Add to your{' '}
              <Display
                size={30}
                style={[styles.italic, { color: t.tokens.semantic.accent }]}
              >
                shelf
              </Display>
              .
            </Display>
          </View>

          <View style={styles.section}>
            <Eyebrow style={styles.sectionEyebrow}>Type</Eyebrow>
            <Controller
              control={control}
              name="type"
              render={({ field: { value, onChange } }) => (
                <AddTypeGrid value={value} onChange={onChange} />
              )}
            />
          </View>

          <View style={styles.section}>
            <Eyebrow style={styles.sectionEyebrow}>Cover</Eyebrow>
            <AddCoverRow
              coverUri={coverUri}
              title={currentTitle}
              type={currentType}
              onPickImage={handlePickImage}
              onTakePhoto={handleTakePhoto}
              onRemove={() => setCoverUri(null)}
            />
          </View>

          <View style={styles.section}>
            <Eyebrow style={styles.sectionEyebrow}>Details</Eyebrow>
            <View style={styles.fields}>
              <FormField
                control={control}
                name="title"
                label="Title"
                fieldProps={{ placeholder: 'What are you tracking?' }}
              />
              <FormField
                control={control}
                name="notes"
                label="Notes"
                fieldProps={{
                  placeholder: 'Any thoughts or context...',
                  multiline: true,
                }}
              />
            </View>
          </View>

          <View style={styles.section}>
            <Eyebrow style={styles.sectionEyebrow}>Status</Eyebrow>
            <Controller
              control={control}
              name="status"
              render={({ field: { value, onChange } }) => (
                <AddStatusSegmented value={value} onChange={onChange} />
              )}
            />
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
  container: { flex: 1 },
  scroll: {
    paddingHorizontal: 24,
    paddingTop: 12,
  },
  title: {
    paddingBottom: 24,
  },
  titleText: {
    marginTop: 6,
  },
  italic: {
    fontStyle: 'italic',
  },
  section: {
    marginBottom: 28,
  },
  sectionEyebrow: {
    marginBottom: 12,
  },
  fields: {
    gap: 12,
  },
});

export default AddItem;
