import { mediaTypes, MEDIA_TYPE } from '@/features/media/constants';
import type { MediaType } from '@/features/media/types';
import { Display, Eyebrow, Mono } from '@/shared/components/design/text';
import { useAppTheme } from '@/shared/theme';
import { StyleSheet, Text, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';

interface Props {
  byType: Record<MediaType, number>;
}

const LABELS: Record<MediaType, string> = {
  [MEDIA_TYPE.MOVIE]: 'Movies',
  [MEDIA_TYPE.BOOK]: 'Books',
  [MEDIA_TYPE.SERIES]: 'Series',
  [MEDIA_TYPE.GAME]: 'Games',
};

const SIZE = 180;
const RADIUS = 72;
const CX = 90;
const CY = 90;

const polar = (deg: number) => {
  const a = ((deg - 90) * Math.PI) / 180;
  return [CX + RADIUS * Math.cos(a), CY + RADIUS * Math.sin(a)] as const;
};

const arcPath = (s: number, e: number) => {
  const [x1, y1] = polar(s);
  const [x2, y2] = polar(e);
  const large = e - s > 180 ? 1 : 0;
  return `M ${x1} ${y1} A ${RADIUS} ${RADIUS} 0 ${large} 1 ${x2} ${y2}`;
};

const StatsTypeDonut = ({ byType }: Props) => {
  const t = useAppTheme();
  const total = mediaTypes.reduce((s, k) => s + byType[k], 0);

  if (total === 0) {
    return (
      <View
        style={[
          styles.card,
          styles.empty,
          {
            backgroundColor: t.tokens.semantic.surface1,
            borderColor: t.tokens.semantic.hairline,
          },
        ]}
      >
        <Text
          style={[
            styles.emptyText,
            { fontFamily: t.tokens.fonts.sansRegular, color: t.tokens.semantic.inkMute },
          ]}
        >
          No items yet — donut will appear when you start tracking.
        </Text>
      </View>
    );
  }

  let acc = 0;
  const segments = mediaTypes.map((type) => {
    const v = byType[type];
    const start = (acc / total) * 360;
    acc += v;
    const end = (acc / total) * 360;
    return { type, v, start, end };
  });

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
      <View style={styles.donut}>
        <Svg width={SIZE} height={SIZE}>
          {segments
            .filter((s) => s.v > 0)
            .map((s) => (
              <Path
                key={s.type}
                d={arcPath(s.start + 1, s.end - 1)}
                stroke={t.tokens.typeAccents[s.type]}
                strokeWidth={20}
                strokeLinecap="round"
                fill="none"
              />
            ))}
        </Svg>
        <View style={styles.donutCenter}>
          <Display size={36}>{total}</Display>
          <Eyebrow style={styles.donutCenterLabel}>items</Eyebrow>
        </View>
      </View>
      <View style={styles.legend}>
        {segments.map((s) => (
          <View key={s.type} style={styles.legendRow}>
            <View
              style={[styles.legendDot, { backgroundColor: t.tokens.typeAccents[s.type] }]}
            />
            <Text
              style={[
                styles.legendName,
                { fontFamily: t.tokens.fonts.sansRegular, color: t.tokens.semantic.ink },
              ]}
            >
              {LABELS[s.type]}
            </Text>
            <Mono style={[styles.legendCount, { color: t.tokens.semantic.inkMute }]}>
              {s.v}
            </Mono>
            <Mono style={[styles.legendPct, { color: t.tokens.semantic.inkFaint }]}>
              {Math.round((s.v / total) * 100)}%
            </Mono>
          </View>
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
    alignItems: 'center',
  },
  empty: {
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 13,
    paddingVertical: 24,
  },
  donut: {
    width: SIZE,
    height: SIZE,
  },
  donutCenter: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  donutCenterLabel: {
    marginTop: 4,
  },
  legend: {
    flex: 1,
    marginLeft: 18,
    gap: 10,
  },
  legendRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 2,
  },
  legendName: {
    flex: 1,
    fontSize: 12,
    marginLeft: 10,
  },
  legendCount: {
    fontSize: 12,
  },
  legendPct: {
    fontSize: 10,
    width: 36,
    textAlign: 'right',
  },
});

export default StatsTypeDonut;
