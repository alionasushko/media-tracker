import { useAppTheme } from '@/shared/theme';
import { StyleSheet, Text, View, type ViewStyle } from 'react-native';

interface Props {
  text: string;
  style?: ViewStyle;
}

const EmptyHint = ({ text, style }: Props) => {
  const t = useAppTheme();
  return (
    <View
      style={[styles.box, { borderColor: t.tokens.semantic.hairlineStrong }, style]}
    >
      <Text
        style={[
          styles.text,
          { fontFamily: t.tokens.fonts.sansRegular, color: t.tokens.semantic.inkMute },
        ]}
      >
        {text}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  box: {
    marginHorizontal: 24,
    padding: 18,
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: 16,
  },
  text: {
    fontSize: 13,
    lineHeight: 19,
  },
});

export default EmptyHint;
