import { Display } from '@/shared/components/design/text';
import { useAppTheme } from '@/shared/theme';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';

interface Props {
  onAdd: () => void;
}

const PLACEHOLDER_LAYOUT = [
  { x: -32, r: -8, op: 0.4 },
  { x: 0, r: 0, op: 1 },
  { x: 32, r: 8, op: 0.4 },
];

const EmptyLibrary = ({ onAdd }: Props) => {
  const t = useAppTheme();
  return (
    <View style={styles.container}>
      <View style={styles.stack}>
        {PLACEHOLDER_LAYOUT.map((c, i) => (
          <View
            key={i}
            style={[
              styles.placeholder,
              {
                backgroundColor: t.tokens.semantic.surface1,
                borderColor: t.tokens.semantic.hairlineStrong,
                transform: [{ translateX: c.x }, { rotate: `${c.r}deg` }],
                opacity: c.op,
              },
            ]}
          >
            {i === 1 ? (
              <MaterialCommunityIcons
                name="movie-roll"
                size={32}
                color={t.tokens.semantic.inkFaint}
              />
            ) : null}
          </View>
        ))}
      </View>
      <Display size={26} style={styles.title}>
        Nothing tracked yet
      </Display>
      <Text
        style={[
          styles.body,
          { color: t.tokens.semantic.inkMute, fontFamily: t.tokens.fonts.sansRegular },
        ]}
      >
        Add the first thing you&apos;re watching, reading, or playing. Your shelf will fill itself.
      </Text>
      <Pressable
        onPress={onAdd}
        style={[
          styles.cta,
          { backgroundColor: t.tokens.semantic.accent, shadowColor: t.tokens.semantic.accent },
        ]}
      >
        <MaterialCommunityIcons name="plus" size={16} color={t.tokens.semantic.accentInk} />
        <Text
          style={[
            styles.ctaLabel,
            { color: t.tokens.semantic.accentInk, fontFamily: t.tokens.fonts.sansBold },
          ]}
        >
          Add your first
        </Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: 48,
    paddingHorizontal: 32,
    alignItems: 'center',
  },
  stack: {
    width: 200,
    height: 180,
    marginBottom: 28,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  placeholder: {
    position: 'absolute',
    width: 110,
    height: 160,
    borderRadius: 10,
    borderWidth: StyleSheet.hairlineWidth,
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    textAlign: 'center',
    marginBottom: 10,
  },
  body: {
    textAlign: 'center',
    maxWidth: 260,
    fontSize: 13,
    lineHeight: 19,
    marginBottom: 24,
  },
  cta: {
    height: 44,
    paddingHorizontal: 22,
    borderRadius: 9999,
    flexDirection: 'row',
    alignItems: 'center',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 4,
  },
  ctaLabel: {
    fontSize: 13,
    marginLeft: 8,
    letterSpacing: 0.2,
  },
});

export default EmptyLibrary;
