import type { Status } from '@/features/media/types';
import { useAppTheme } from '@/shared/theme';
import type { MediaType } from '@/shared/theme/tokens';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import StatusDot from './StatusDot';
import TypeIcon from './TypeIcon';

export interface ChipOption<V extends string> {
  value: V;
  label: string;
}

type ChipKind = 'status' | 'type';

interface Props<V extends string> {
  value: V;
  options: readonly ChipOption<V>[];
  onChange: (v: V) => void;
  kind?: ChipKind;
}

export const ChipRow = <V extends string>({ value, options, onChange, kind }: Props<V>) => {
  const t = useAppTheme();
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.row}
    >
      {options.map((opt) => {
        const active = value === opt.value;
        const isAll = opt.value === 'all';
        const labelColor = active ? t.tokens.semantic.bg : t.tokens.semantic.inkMute;

        return (
          <Pressable
            key={opt.value}
            onPress={() => onChange(opt.value)}
            style={[
              styles.chip,
              {
                backgroundColor: active ? t.tokens.semantic.ink : t.tokens.semantic.surface2,
                borderColor: active ? t.tokens.semantic.ink : t.tokens.semantic.hairline,
              },
            ]}
          >
            {!isAll && kind === 'status' ? (
              <StatusDot status={opt.value as Status} size={6} style={styles.leading} />
            ) : null}
            {!isAll && kind === 'type' ? (
              <View style={styles.leading}>
                <TypeIcon type={opt.value as MediaType} size={11} color={labelColor} />
              </View>
            ) : null}
            <Text
              style={[
                styles.label,
                { fontFamily: t.tokens.fonts.sansMedium, color: labelColor },
              ]}
            >
              {opt.label}
            </Text>
          </Pressable>
        );
      })}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  row: {
    paddingHorizontal: 24,
    gap: 8,
    alignItems: 'center',
  },
  chip: {
    height: 30,
    paddingHorizontal: 12,
    borderRadius: 9999,
    borderWidth: StyleSheet.hairlineWidth,
    flexDirection: 'row',
    alignItems: 'center',
  },
  leading: {
    marginRight: 6,
  },
  label: {
    fontSize: 12,
    letterSpacing: 0.1,
  },
});

export default ChipRow;
