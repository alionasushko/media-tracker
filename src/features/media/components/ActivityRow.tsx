import { Mono } from '@/shared/components/design/text';
import { useAppTheme } from '@/shared/theme';
import { StyleSheet, Text, View } from 'react-native';

interface Props {
  text: string;
  when: string;
  divider?: boolean;
}

const ActivityRow = ({ text, when, divider }: Props) => {
  const t = useAppTheme();
  return (
    <View
      style={[
        styles.row,
        divider
          ? {
              borderBottomWidth: StyleSheet.hairlineWidth,
              borderBottomColor: t.tokens.semantic.hairline,
            }
          : null,
      ]}
    >
      <View style={[styles.dot, { backgroundColor: t.tokens.semantic.accent }]} />
      <View style={styles.body}>
        <Text
          style={[
            styles.text,
            { fontFamily: t.tokens.fonts.sansRegular, color: t.tokens.semantic.ink },
          ]}
        >
          {text}
        </Text>
        <Mono style={[styles.when, { color: t.tokens.semantic.inkFaint }]}>{when}</Mono>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingBottom: 12,
    marginBottom: 12,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginTop: 6,
  },
  body: {
    flex: 1,
    marginLeft: 14,
  },
  text: {
    fontSize: 13,
    lineHeight: 18,
  },
  when: {
    fontSize: 10,
    marginTop: 3,
  },
});

export default ActivityRow;
