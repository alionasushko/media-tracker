import { useCurrentUserId } from '@/features/auth/hooks/useCurrentUserId';
import ActivityHeatmap from '@/features/media/components/ActivityHeatmap';
import RotatingGreeting from '@/features/media/components/RotatingGreeting';
import UpNextShelf from '@/features/media/components/UpNextShelf';
import { STATUS } from '@/features/media/constants';
import { useMediaStats } from '@/features/media/hooks/useMediaStats';
import { useAllUserMedia } from '@/features/media/queries';
import EmptyHint from '@/shared/components/design/EmptyHint';
import SectionHeader from '@/shared/components/design/SectionHeader';
import { Display, Eyebrow } from '@/shared/components/design/text';
import AnimatedScreen from '@/shared/components/ui/AnimatedScreen';
import { useAppTheme } from '@/shared/theme';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useMemo } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const IN_ROTATION_LIMIT = 4;
const UP_NEXT_LIMIT = 8;

const HomeScreen = () => {
  const t = useAppTheme();
  const insets = useSafeAreaInsets();
  const ownerId = useCurrentUserId() ?? '';
  const { data: items = [] } = useAllUserMedia(ownerId);
  const stats = useMediaStats(ownerId);

  const inProgress = useMemo(
    () => items.filter((m) => m.status === STATUS.PROGRESS).slice(0, IN_ROTATION_LIMIT),
    [items],
  );
  const planned = useMemo(
    () => items.filter((m) => m.status === STATUS.PLAN).slice(0, UP_NEXT_LIMIT),
    [items],
  );

  const handleOpen = (id: string) => router.push({ pathname: '/(app)/item/[id]', params: { id } });

  return (
    <AnimatedScreen>
      <View style={[styles.container, { backgroundColor: t.tokens.semantic.bg }]}>
        <ScrollView
          contentContainerStyle={[
            styles.scroll,
            { paddingTop: insets.top + 28, paddingBottom: insets.bottom + 130 },
          ]}
          showsVerticalScrollIndicator={false}
        >
          <RotatingGreeting
            inProgress={inProgress.length}
            planned={planned.length}
            streak={stats.streak}
          />

          <SectionHeader eyebrow="Currently · in progress" title="In rotation" />
          {inProgress.length === 0 ? (
            <EmptyHint text="Nothing in rotation. Move something to In progress to see it here." />
          ) : (
            <UpNextShelf items={inProgress} onOpen={handleOpen} />
          )}

          <View style={styles.section}>
            <SectionHeader eyebrow={`Up next · ${planned.length} queued`} title="Waiting" />
            {planned.length === 0 ? (
              <EmptyHint text="Nothing planned yet. Add what you'd like to consume." />
            ) : (
              <UpNextShelf items={planned} onOpen={handleOpen} />
            )}
          </View>

          <View style={styles.section}>
            <View style={styles.heatmapHeader}>
              <View style={styles.heatmapHeaderText}>
                <Eyebrow>Last 12 weeks</Eyebrow>
                <Display size={28} style={styles.heatmapTitle}>
                  Activity
                </Display>
              </View>
              {stats.streak > 0 ? (
                <View style={styles.streakChip}>
                  <MaterialCommunityIcons name="fire" size={14} color={t.tokens.semantic.accent} />
                  <Text
                    style={[
                      styles.streakLabel,
                      { fontFamily: t.tokens.fonts.sansSemiBold, color: t.tokens.semantic.accent },
                    ]}
                  >
                    {stats.streak}-day streak
                  </Text>
                </View>
              ) : null}
            </View>
            <View style={styles.heatmapWrap}>
              <ActivityHeatmap
                data={stats.heatmap}
                start={stats.heatmapStart}
                end={stats.heatmapEnd}
              />
            </View>
          </View>
        </ScrollView>
      </View>
    </AnimatedScreen>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: {},
  section: {
    marginTop: 36,
  },
  heatmapHeader: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 24,
  },
  heatmapHeaderText: {
    flex: 1,
  },
  heatmapTitle: {
    marginTop: 6,
  },
  streakChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    height: 28,
    borderRadius: 14,
  },
  streakLabel: {
    fontSize: 12,
    marginLeft: 5,
  },
  heatmapWrap: {
    paddingHorizontal: 24,
    marginTop: 14,
  },
});

export default HomeScreen;
