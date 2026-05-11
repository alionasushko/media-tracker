import { Mono } from '@/shared/components/design/text';
import { useAppTheme } from '@/shared/theme';
import { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSpring,
} from 'react-native-reanimated';

interface Props {
  data: number[];
  labels: string[];
}

const CHART_HEIGHT = 140;

const StatsMonthlyBars = ({ data, labels }: Props) => {
  const t = useAppTheme();
  const max = Math.max(1, ...data);
  const currentMonth = new Date().getMonth();

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
      <View style={styles.barsRow}>
        {data.map((v, i) => (
          <Bar
            key={i}
            heightPct={v / max}
            label={v > 0 && i === currentMonth ? `${v}` : null}
            isCurrent={i === currentMonth}
            delay={i * 40}
          />
        ))}
      </View>
      <View style={styles.labelsRow}>
        {labels.map((l, i) => (
          <Mono
            key={i}
            style={[styles.monthLabel, { color: t.tokens.semantic.inkFaint }]}
          >
            {l[0]}
          </Mono>
        ))}
      </View>
    </View>
  );
};

const Bar = ({
  heightPct,
  label,
  isCurrent,
  delay,
}: {
  heightPct: number;
  label: string | null;
  isCurrent: boolean;
  delay: number;
}) => {
  const t = useAppTheme();
  const h = useSharedValue(0);

  useEffect(() => {
    h.value = withDelay(delay, withSpring(heightPct, { damping: 16, stiffness: 120 }));
  }, [heightPct, delay, h]);

  const animatedStyle = useAnimatedStyle(() => ({
    height: `${Math.min(100, h.value * 100)}%`,
  }));

  return (
    <View style={styles.barCol}>
      <Animated.View
        style={[
          styles.bar,
          {
            backgroundColor: isCurrent ? t.tokens.semantic.accent : t.tokens.semantic.surface3,
          },
          animatedStyle,
        ]}
      >
        {label && isCurrent ? (
          <Text
            style={[
              styles.barLabel,
              { fontFamily: t.tokens.fonts.monoSemiBold, color: t.tokens.semantic.accent },
            ]}
          >
            {label}
          </Text>
        ) : null}
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    padding: 22,
    borderRadius: 20,
    borderWidth: StyleSheet.hairlineWidth,
  },
  barsRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    height: CHART_HEIGHT,
    gap: 4,
  },
  labelsRow: {
    flexDirection: 'row',
    gap: 4,
    marginTop: 10,
  },
  monthLabel: {
    flex: 1,
    textAlign: 'center',
    fontSize: 9,
    letterSpacing: 0.4,
  },
  barCol: {
    flex: 1,
    height: '100%',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  bar: {
    width: '100%',
    borderRadius: 4,
  },
  barLabel: {
    position: 'absolute',
    top: -16,
    alignSelf: 'center',
    fontSize: 10,
  },
});

export default StatsMonthlyBars;
