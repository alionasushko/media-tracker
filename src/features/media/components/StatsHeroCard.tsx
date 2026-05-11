import { Display, Eyebrow } from '@/shared/components/design/text';
import { useAppTheme } from '@/shared/theme';
import { useCountUp } from '@/shared/hooks/useCountUp';
import { mixHex } from '@/shared/utils/color';
import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet, Text, View } from 'react-native';

interface Props {
  total: number;
  finished: number;
  planned: number;
  streakDays: number;
  loaded: boolean;
}

const StatsHeroCard = ({ total, finished, planned, streakDays, loaded }: Props) => {
  const t = useAppTheme();
  const animTotal = useCountUp(total, loaded);
  const animFinished = useCountUp(finished, loaded);
  const animPlanned = useCountUp(planned, loaded);

  return (
    <View style={[styles.card, { borderColor: t.tokens.semantic.hairlineStrong }]}>
      <LinearGradient
        colors={[
          mixHex(t.tokens.semantic.accent, t.tokens.semantic.surface1, 0.35),
          t.tokens.semantic.surface1,
        ]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFillObject}
      />
      <View style={[styles.arc, { backgroundColor: t.tokens.semantic.accent }]} />
      <Eyebrow style={{ color: t.tokens.semantic.accent }}>You&apos;ve tracked</Eyebrow>
      <Display size={96} style={styles.bigNumber}>
        {animTotal}
      </Display>
      <Text
        style={[
          styles.tagline,
          { fontFamily: t.tokens.fonts.serifMedium, color: t.tokens.semantic.inkMute },
        ]}
      >
        {total === 1 ? 'story this year.' : 'stories this year.'}
      </Text>
      <View style={[styles.divider, { borderTopColor: t.tokens.semantic.hairline }]}>
        <SmallStat label="Finished" value={animFinished} />
        <SmallStat label="Planned" value={animPlanned} />
        <SmallStat label="Streak" value={`${streakDays}d`} accent />
      </View>
    </View>
  );
};

const SmallStat = ({
  label,
  value,
  accent,
}: {
  label: string;
  value: number | string;
  accent?: boolean;
}) => {
  const t = useAppTheme();
  return (
    <View>
      <Eyebrow style={styles.smallStatLabel}>{label}</Eyebrow>
      <Text
        style={[
          styles.smallStatValue,
          {
            fontFamily: t.tokens.fonts.serifMedium,
            color: accent ? t.tokens.semantic.accent : t.tokens.semantic.ink,
          },
        ]}
      >
        {value}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 24,
    marginTop: 20,
    borderRadius: 24,
    borderWidth: StyleSheet.hairlineWidth,
    padding: 24,
    overflow: 'hidden',
    position: 'relative',
  },
  arc: {
    position: 'absolute',
    right: -60,
    top: -60,
    width: 200,
    height: 200,
    borderRadius: 100,
    opacity: 0.18,
  },
  bigNumber: {
    marginTop: 4,
    lineHeight: 96,
  },
  tagline: {
    marginTop: 6,
    fontSize: 20,
    fontStyle: 'italic',
  },
  divider: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 22,
    paddingTop: 16,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  smallStatLabel: {
    fontSize: 9,
    marginBottom: 4,
  },
  smallStatValue: {
    fontSize: 22,
    letterSpacing: -0.2,
  },
});

export default StatsHeroCard;
