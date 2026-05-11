import { Mono } from '@/shared/components/design/text';
import { useAppTheme, type AppTheme } from '@/shared/theme';
import { hexToRgba } from '@/shared/utils/color';
import { fmtMonthDay } from '@/shared/utils/date';
import { StyleSheet, Text, View } from 'react-native';

interface Props {
  data: number[];
  start: Date;
  end: Date;
}

const COLS = 12;
const ROWS = 7;
const CELL = 11;
const GAP = 4;

const heatColor = (v: number, semantic: AppTheme['tokens']['semantic']) => {
  if (v <= 0) return semantic.surface2;
  const alpha = v === 1 ? 0.3 : v === 2 ? 0.55 : v === 3 ? 0.78 : 1;
  return hexToRgba(semantic.accent, alpha);
};

const ActivityHeatmap = ({ data, start, end }: Props) => {
  const t = useAppTheme();
  return (
    <View>
      <View
        style={[
          styles.grid,
          {
            width: COLS * (CELL + GAP) - GAP,
          },
        ]}
      >
        {Array.from({ length: ROWS * COLS }).map((_, i) => {
          const col = i % COLS;
          const row = Math.floor(i / COLS);
          const idx = col * ROWS + row;
          const v = data[idx] ?? 0;
          return (
            <View
              key={i}
              style={[styles.cell, { backgroundColor: heatColor(v, t.tokens.semantic) }]}
            />
          );
        })}
      </View>
      <View style={styles.legendRow}>
        <Mono style={[styles.legendText, { color: t.tokens.semantic.inkFaint }]}>
          {fmtMonthDay(start)}
        </Mono>
        <View style={styles.legendScale}>
          <Text
            style={[
              styles.legendLabel,
              { fontFamily: t.tokens.fonts.sansRegular, color: t.tokens.semantic.inkFaint },
            ]}
          >
            Less
          </Text>
          {[0, 1, 2, 3, 4].map((i) => (
            <View
              key={i}
              style={[styles.legendCell, { backgroundColor: heatColor(i, t.tokens.semantic) }]}
            />
          ))}
          <Text
            style={[
              styles.legendLabel,
              { fontFamily: t.tokens.fonts.sansRegular, color: t.tokens.semantic.inkFaint },
            ]}
          >
            More
          </Text>
        </View>
        <Mono style={[styles.legendText, { color: t.tokens.semantic.inkFaint }]}>
          {fmtMonthDay(end)}
        </Mono>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: GAP,
    alignSelf: 'center',
  },
  cell: {
    width: CELL,
    height: CELL,
    borderRadius: 3,
  },
  legendRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
  },
  legendScale: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  legendText: {
    fontSize: 10,
  },
  legendLabel: {
    fontSize: 10,
  },
  legendCell: {
    width: 9,
    height: 9,
    borderRadius: 2,
  },
});

export default ActivityHeatmap;
