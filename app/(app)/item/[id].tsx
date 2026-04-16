import { useCurrentUserId } from '@/features/auth/hooks/useCurrentUserId';
import CoverUploader from '@/features/media/components/CoverUploader';
import { statuses } from '@/features/media/constants';
import { useCoverManager } from '@/features/media/hooks/useCoverManager';
import {
  useDeleteMedia,
  useUpdateMediaOptimistic,
  useUserMediaEntry,
} from '@/features/media/queries';
import type { Status } from '@/features/media/types';
import AnimatedScreen from '@/shared/components/ui/AnimatedScreen';
import Rating from '@/shared/components/ui/Rating';
import { deleteCoverByUrl } from '@/shared/services/storage';
import { commonStyles } from '@/shared/styles/common';
import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { Button, Chip, Dialog, Icon, Portal, Text, TextInput, useTheme } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useDebouncedCallback } from 'use-debounce';

const ItemDetail = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data } = useUserMediaEntry(id);
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const ownerId = useCurrentUserId() ?? '';
  const update = useUpdateMediaOptimistic(ownerId);
  const del = useDeleteMedia(ownerId);
  const { uploadCover, deleteCover, isUploading } = useCoverManager({
    itemId: id,
    ownerId,
    currentCoverUrl: data?.coverUrl,
  });

  const [deleteVisible, setDeleteVisible] = useState(false);
  const [notes, setNotes] = useState(data?.notes ?? '');
  const lastSaved = useRef(data?.notes ?? '');

  useEffect(() => {
    if (data?.notes !== undefined && data.notes !== lastSaved.current) {
      setNotes(data.notes);
      lastSaved.current = data.notes;
    }
  }, [data?.notes]);

  const saveNotes = useDebouncedCallback((text: string) => {
    const trimmed = text.trim();
    if (trimmed === lastSaved.current) return;
    lastSaved.current = trimmed;
    update.mutate({ id, patch: { notes: trimmed } });
  }, 800);

  const handleNotesChange = (text: string) => {
    setNotes(text);
    saveNotes(text);
  };

  const handleNotesBlur = () => {
    saveNotes.flush();
  };

  if (!data) return null;

  const handleMarkStatus = async (status: Status) => {
    await update.mutateAsync({ id, patch: { status } });
  };

  const handleChangeRating = async (v: number) => {
    await update.mutateAsync({ id, patch: { rating: v } });
  };

  const handleClearRating = () => update.mutate({ id, patch: { rating: 0 } });

  const handleConfirmDelete = async () => {
    setDeleteVisible(false);
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
    <AnimatedScreen>
      <View style={[commonStyles.container, { backgroundColor: theme.colors.background }]}>
        <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
          <Pressable onPress={handleGoBack} hitSlop={8}>
            <Icon source="arrow-left" size={22} color={theme.colors.onBackground} />
          </Pressable>
          <View style={styles.headerTitleWrap}>
            <Text
              style={[styles.headerTitle, { color: theme.colors.onBackground }]}
              numberOfLines={1}
            >
              {data.title}
            </Text>
          </View>
          <Pressable onPress={() => setDeleteVisible(true)} hitSlop={8}>
            <Icon source="delete-outline" size={22} color={theme.colors.error} />
          </Pressable>
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent} keyboardDismissMode="on-drag">
          <CoverUploader
            value={data.coverUrl ?? null}
            loading={isUploading}
            onChange={handleCoverChange}
          />

          <View style={styles.titleSection}>
            <Text style={[styles.title, { color: theme.colors.onSurface }]}>{data.title}</Text>
            <Text style={[styles.typeLabel, { color: theme.colors.onSurfaceVariant }]}>
              {data.type.toUpperCase()}
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={[styles.sectionLabel, { color: theme.colors.onSurfaceVariant }]}>
              STATUS
            </Text>
            <View style={styles.chipRow}>
              {statuses.map((s) => (
                <Chip
                  key={s}
                  selected={data.status === s}
                  onPress={() => handleMarkStatus(s)}
                  mode={data.status === s ? 'flat' : 'outlined'}
                  style={styles.chip}
                  textStyle={styles.chipText}
                >
                  {s}
                </Chip>
              ))}
            </View>
          </View>

          <View style={styles.section}>
            <Text style={[styles.sectionLabel, { color: theme.colors.onSurfaceVariant }]}>
              RATING
            </Text>
            <View style={styles.ratingRow}>
              <Rating value={data.rating || 0} onChange={handleChangeRating} />
              {(data.rating ?? 0) > 0 ? (
                <Pressable onPress={handleClearRating}>
                  <Text style={[styles.clearText, { color: theme.colors.onSurfaceVariant }]}>
                    Clear
                  </Text>
                </Pressable>
              ) : null}
            </View>
          </View>

          <View style={styles.section}>
            <Text style={[styles.sectionLabel, { color: theme.colors.onSurfaceVariant }]}>
              NOTES
            </Text>
            <TextInput
              value={notes}
              onChangeText={handleNotesChange}
              onBlur={handleNotesBlur}
              placeholder="Add notes or thoughts"
              multiline
              maxLength={1000}
              style={styles.notesInput}
            />
          </View>
        </ScrollView>
        <Portal>
          <Dialog
            visible={deleteVisible}
            onDismiss={() => setDeleteVisible(false)}
            style={{ borderRadius: 16 }}
          >
            <Dialog.Title>Delete item</Dialog.Title>
            <Dialog.Content>
              <Text variant="bodyMedium">
                {`Are you sure you want to delete "${data.title}"? This can't be undone.`}
              </Text>
            </Dialog.Content>
            <Dialog.Actions>
              <Button onPress={() => setDeleteVisible(false)}>Cancel</Button>
              <Button textColor={theme.colors.error} onPress={handleConfirmDelete}>
                Delete
              </Button>
            </Dialog.Actions>
          </Dialog>
        </Portal>
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
  headerTitleWrap: { flex: 1 },
  headerTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 17,
    letterSpacing: -0.2,
  },
  scrollContent: { paddingHorizontal: 20, paddingTop: 4, paddingBottom: 40, gap: 24 },
  titleSection: { gap: 2 },
  title: { fontFamily: 'Inter-Bold', fontSize: 22, letterSpacing: -0.3 },
  typeLabel: {
    fontFamily: 'Inter-Medium',
    fontSize: 11,
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  section: { gap: 10 },
  sectionLabel: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 11,
    letterSpacing: 1,
  },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: { borderRadius: 10 },
  chipText: { fontFamily: 'Inter-Medium', fontSize: 13, textTransform: 'capitalize' },
  ratingRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  clearText: { fontFamily: 'Inter-Medium', fontSize: 13 },
  notesInput: { minHeight: 100, textAlignVertical: 'top' },
});

export default ItemDetail;
