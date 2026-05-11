import { Mono } from '@/shared/components/design/text';
import { useAppTheme } from '@/shared/theme';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSpring,
} from 'react-native-reanimated';

interface Props {
  data: number[];
}

const CARD_HEIGHT = 200;
const BAR_HEIGHT = 130;

const StatsRatingHistogram = ({ data }: Props) => {
  const t = useAppTheme();
  const max = Math.max(1, ...data);
  const peakIdx = data.indexOf(Math.max(...data));

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
      {data.map((v, i) => (
        <RatingBar
          key={i}
          value={v}
          maxValue={max}
          stars={i + 1}
          isPeak={i === peakIdx && v > 0}
          delay={i * 90}
        />
      ))}
    </View>
  );
};

const RatingBar = ({
  value,
  maxValue,
  stars,
  isPeak,
  delay,
}: {
  value: number;
  maxValue: number;
  stars: number;
  isPeak: boolean;
  delay: number;
}) => {
  const t = useAppTheme();
  const h = useSharedValue(0);

  useEffect(() => {
    h.value = withDelay(delay, withSpring(value / maxValue, { damping: 16, stiffness: 120 }));
  }, [value, maxValue, delay, h]);

  const animatedStyle = useAnimatedStyle(() => ({
    height: BAR_HEIGHT * h.value,
  }));

  return (
    <View style={styles.col}>
      <Mono style={[styles.count, { color: t.tokens.semantic.ink }]}>{value}</Mono>
      <Animated.View
        style={[
          styles.bar,
          {
            backgroundColor: isPeak ? t.tokens.semantic.accent : t.tokens.semantic.surface3,
          },
          animatedStyle,
        ]}
      />
      <View style={styles.starsRow}>
        {Array.from({ length: stars }).map((_, j) => (
          <MaterialCommunityIcons
            key={j}
            name="star"
            size={9}
            color={isPeak ? t.tokens.semantic.accent : t.tokens.semantic.inkFaint}
          />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    padding: 22,
    borderRadius: 20,
    borderWidth: StyleSheet.hairlineWidth,
    flexDirection: 'row',
    alignItems: 'flex-end',
    height: CARD_HEIGHT,
    justifyContent: 'space-around',
  },
  col: {
    alignItems: 'center',
    justifyContent: 'flex-end',
    flex: 1,
    gap: 8,
  },
  count: {
    fontSize: 11,
    fontWeight: '600',
  },
  bar: {
    width: '70%',
    maxWidth: 36,
    borderRadius: 6,
  },
  starsRow: {
    flexDirection: 'row',
    gap: 1,
  },
});

export default StatsRatingHistogram;
