import { StyleSheet, Text, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useAppTheme } from '@/shared/theme';

interface Props {
  size?: 'sm' | 'md' | 'lg';
}

const Wordmark = ({ size = 'lg' }: Props) => {
  const t = useAppTheme();
  const fs = size === 'lg' ? 30 : size === 'md' ? 24 : 18;
  const box = Math.round(fs * 1.4);

  return (
    <View style={styles.row}>
      <View
        style={[
          styles.mark,
          {
            width: box,
            height: box,
            borderRadius: 12,
            backgroundColor: t.tokens.semantic.accent,
            shadowColor: t.tokens.semantic.accent,
          },
        ]}
      >
        <MaterialCommunityIcons
          name="bookmark"
          size={Math.round(fs * 0.78)}
          color={t.tokens.semantic.accentInk}
        />
      </View>
      <View style={{ marginLeft: 12, flexDirection: 'row', alignItems: 'baseline' }}>
        <Text
          style={{
            fontFamily: t.tokens.fonts.serifMedium,
            fontSize: fs,
            letterSpacing: -fs * 0.022,
            color: t.tokens.semantic.ink,
          }}
        >
          media
        </Text>
        <Text
          style={{
            fontFamily: t.tokens.fonts.serifMedium,
            fontStyle: 'italic',
            fontSize: fs,
            letterSpacing: -fs * 0.022,
            color: t.tokens.semantic.accent,
          }}
        >
          tracker
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center' },
  mark: {
    alignItems: 'center',
    justifyContent: 'center',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 14,
    elevation: 4,
  },
});

export default Wordmark;
