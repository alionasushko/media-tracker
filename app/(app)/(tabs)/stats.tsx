import { useCurrentUserId } from '@/features/auth/hooks/useCurrentUserId';
import StatsFunnel from '@/features/media/components/StatsFunnel';
import StatsHeroCard from '@/features/media/components/StatsHeroCard';
import StatsMonthlyBars from '@/features/media/components/StatsMonthlyBars';
import StatsRatingHistogram from '@/features/media/components/StatsRatingHistogram';
import StatsStreakCard from '@/features/media/components/StatsStreakCard';
import StatsTagCloud from '@/features/media/components/StatsTagCloud';
import StatsTypeDonut from '@/features/media/components/StatsTypeDonut';
import { useMediaStats } from '@/features/media/hooks/useMediaStats';
import SectionHeader from '@/shared/components/design/SectionHeader';
import { Display, Eyebrow } from '@/shared/components/design/text';
import AnimatedScreen from '@/shared/components/ui/AnimatedScreen';
import { useAppTheme } from '@/shared/theme';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const StatsScreen = () => {
  const t = useAppTheme();
  const insets = useSafeAreaInsets();
  const ownerId = useCurrentUserId() ?? '';
  const stats = useMediaStats(ownerId);
  const year = new Date().getFullYear();

  const startedOrLater =
    stats.byStatus.progress + stats.byStatus.done + stats.byStatus.dropped;
  const everPlanned =
    stats.byStatus.plan +
    stats.byStatus.progress +
    stats.byStatus.done +
    stats.byStatus.dropped;

  return (
    <AnimatedScreen>
      <View style={[styles.container, { backgroundColor: t.tokens.semantic.bg }]}>
        <ScrollView
          contentContainerStyle={[
            styles.scroll,
            { paddingTop: insets.top + 24, paddingBottom: insets.bottom + 130 },
          ]}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.titleBlock}>
            <Eyebrow>{`${year} · in motion`}</Eyebrow>
            <Display size={32} style={styles.title}>
              The year so far
            </Display>
          </View>

          <StatsHeroCard
            total={stats.total}
            finished={stats.byStatus.done}
            planned={stats.byStatus.plan}
            streakDays={stats.streak}
            loaded={stats.loaded}
          />

          <Section eyebrow="Monthly · activity" title="The rhythm">
            <StatsMonthlyBars data={stats.monthly} labels={stats.monthLabels} />
          </Section>

          <Section eyebrow="By medium" title="What you consume">
            <StatsTypeDonut byType={stats.byType} />
          </Section>

          <Section eyebrow="Plan → progress → done" title="Conversion">
            <StatsFunnel
              planned={everPlanned}
              started={startedOrLater}
              finished={stats.byStatus.done}
            />
          </Section>

          <Section eyebrow="Ratings" title="How you score">
            <StatsRatingHistogram data={stats.ratings} />
          </Section>

          {stats.streak > 0 ? (
            <View style={styles.streakWrap}>
              <StatsStreakCard streakDays={stats.streak} />
            </View>
          ) : null}

          {stats.topTags.length > 0 ? (
            <Section eyebrow="Top tags" title="Your obsessions">
              <StatsTagCloud tags={stats.topTags} />
            </Section>
          ) : null}

          {!stats.loaded ? (
            <View style={styles.loadingWrap}>
              <Text
                style={[
                  styles.loadingText,
                  { fontFamily: t.tokens.fonts.sansRegular, color: t.tokens.semantic.inkFaint },
                ]}
              >
                Crunching the numbers…
              </Text>
            </View>
          ) : null}
        </ScrollView>
      </View>
    </AnimatedScreen>
  );
};

const Section = ({
  eyebrow,
  title,
  children,
}: {
  eyebrow: string;
  title: string;
  children: React.ReactNode;
}) => (
  <View style={styles.section}>
    <SectionHeader eyebrow={eyebrow} title={title} />
    <View style={styles.sectionBody}>{children}</View>
  </View>
);

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: {},
  titleBlock: {
    paddingHorizontal: 24,
  },
  title: {
    marginTop: 6,
  },
  section: {
    marginTop: 32,
  },
  sectionBody: {
    paddingHorizontal: 24,
  },
  streakWrap: {
    paddingHorizontal: 24,
    marginTop: 32,
  },
  loadingWrap: {
    paddingHorizontal: 24,
    paddingTop: 12,
  },
  loadingText: {
    fontSize: 12,
    textAlign: 'center',
  },
});

export default StatsScreen;
