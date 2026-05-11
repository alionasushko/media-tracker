import { Mono } from '@/shared/components/design/text';
import { useAppTheme } from '@/shared/theme';
import { StyleSheet, Text, View } from 'react-native';

interface Props {
  tags: { tag: string; count: number }[];
}

const StatsTagCloud = ({ tags }: Props) => {
  const t = useAppTheme();
  return (
    <View style={styles.cloud}>
      {tags.map((entry, i) => {
        const scale = 1 - (i / tags.length) * 0.4;
        const fontSize = 11 + Math.round(scale * 4);
        return (
          <View
            key={entry.tag}
            style={[
              styles.chip,
              {
                backgroundColor: t.tokens.semantic.surface2,
                borderColor: t.tokens.semantic.hairline,
                opacity: 0.6 + scale * 0.4,
              },
            ]}
          >
            <Text
              style={[
                styles.tagText,
                { fontFamily: t.tokens.fonts.sansMedium, color: t.tokens.semantic.inkMute, fontSize },
              ]}
            >
              {entry.tag}
            </Text>
            <Mono style={[styles.count, { color: t.tokens.semantic.inkFaint }]}>
              {entry.count}
            </Mono>
          </View>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  cloud: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 28,
    paddingHorizontal: 12,
    borderRadius: 9999,
    borderWidth: StyleSheet.hairlineWidth,
  },
  tagText: {},
  count: {
    fontSize: 10,
    marginLeft: 6,
  },
});

export default StatsTagCloud;
