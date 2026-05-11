import { STATUS } from '@/features/media/constants';
import { Mono } from '@/shared/components/design/text';
import { useAppTheme } from '@/shared/theme';
import { mixHex } from '@/shared/utils/color';
import { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSpring,
} from 'react-native-reanimated';

interface Props {
  planned: number;
  started: number;
  finished: number;
}

interface Stage {
  key: string;
  label: string;
  value: number;
  accentRatio: number;
}

const StatsFunnel = ({ planned, started, finished }: Props) => {
  const t = useAppTheme();
  const max = Math.max(1, planned);
  const stages: Stage[] = [
    { key: STATUS.PLAN, label: 'Planned', value: planned, accentRatio: 0.5 },
    { key: STATUS.PROGRESS, label: 'Started', value: started, accentRatio: 0.75 },
    { key: STATUS.DONE, label: 'Finished', value: finished, accentRatio: 1 },
  ];

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: t.tokens.semantic.surface1,
          borderColor: t.tokens.semantic.hairline,
        },
      ]}
    >
      {stages.map((s, i) => (
        <FunnelRow
          key={s.key}
          label={s.label}
          value={s.value}
          ratio={s.value / max}
          accentRatio={s.accentRatio}
          rate={i < stages.length - 1 ? stages[i + 1].value / Math.max(1, s.value) : null}
          isLast={i === stages.length - 1}
          delay={i * 80}
        />
      ))}
    </View>
  );
};

const FunnelRow = ({
  label,
  value,
  ratio,
  accentRatio,
  rate,
  isLast,
  delay,
}: {
  label: string;
  value: number;
  ratio: number;
  accentRatio: number;
  rate: number | null;
  isLast: boolean;
  delay: number;
}) => {
  const t = useAppTheme();
  const w = useSharedValue(0);

  useEffect(() => {
    w.value = withDelay(delay, withSpring(ratio, { damping: 16, stiffness: 120 }));
  }, [ratio, delay, w]);

  const fillStyle = useAnimatedStyle(() => ({
    width: `${Math.min(100, w.value * 100)}%`,
  }));

  const color = isLast
    ? t.tokens.semantic.accent
    : mixHex(t.tokens.semantic.accent, t.tokens.semantic.surface3, accentRatio);

  return (
    <View style={styles.row}>
      <Text
        style={[
          styles.label,
          { fontFamily: t.tokens.fonts.sansRegular, color: t.tokens.semantic.inkMute },
        ]}
      >
        {label}
      </Text>
      <View style={[styles.track, { backgroundColor: t.tokens.semantic.surface3 }]}>
        <Animated.View style={[styles.fill, { backgroundColor: color }, fillStyle]}>
          <View style={styles.fillInner}>
            <Mono
              style={[
                styles.value,
                { color: isLast ? t.tokens.semantic.accentInk : t.tokens.semantic.ink },
              ]}
            >
              {value}
            </Mono>
          </View>
        </Animated.View>
      </View>
      <View style={styles.rate}>
        {rate !== null ? (
          <Mono style={[styles.rateText, { color: t.tokens.semantic.accent }]}>
            {Math.round(rate * 100)}%
          </Mono>
        ) : null}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    padding: 22,
    borderRadius: 20,
    borderWidth: StyleSheet.hairlineWidth,
    gap: 12,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  label: {
    width: 64,
    fontSize: 11,
  },
  track: {
    flex: 1,
    height: 32,
    borderRadius: 8,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    borderRadius: 8,
  },
  fillInner: {
    flex: 1,
    justifyContent: 'center',
    paddingLeft: 12,
  },
  value: {
    fontSize: 13,
    fontWeight: '700',
  },
  rate: {
    width: 40,
    alignItems: 'flex-end',
  },
  rateText: {
    fontSize: 11,
    fontWeight: '600',
  },
});

export default StatsFunnel;
