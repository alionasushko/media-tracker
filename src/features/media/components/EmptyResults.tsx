import { Display } from '@/shared/components/design/text';
import { useAppTheme } from '@/shared/theme';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';

interface Props {
  query: string;
  onClear: () => void;
}

const EmptyResults = ({ query, onClear }: Props) => {
  const t = useAppTheme();
  return (
    <View style={styles.container}>
      <View
        style={[
          styles.iconCircle,
          {
            backgroundColor: t.tokens.semantic.surface1,
            borderColor: t.tokens.semantic.hairlineStrong,
          },
        ]}
      >
        <MaterialCommunityIcons name="magnify" size={32} color={t.tokens.semantic.inkFaint} />
      </View>
      <Display size={26} style={styles.title}>
        No matches
      </Display>
      <Text
        style={[
          styles.body,
          { color: t.tokens.semantic.inkMute, fontFamily: t.tokens.fonts.sansRegular },
        ]}
      >
        {query
          ? `Nothing matches “${query}”. Try a different search or adjust your filters.`
          : 'Nothing matches the selected filters. Try a different combination.'}
      </Text>
      <Pressable
        onPress={onClear}
        style={[
          styles.cta,
          {
            backgroundColor: t.tokens.semantic.surface2,
            borderColor: t.tokens.semantic.hairlineStrong,
          },
        ]}
      >
        <Text
          style={[
            styles.ctaLabel,
            { color: t.tokens.semantic.ink, fontFamily: t.tokens.fonts.sansSemiBold },
          ]}
        >
          Clear filters
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
  iconCircle: {
    width: 88,
    height: 88,
    borderRadius: 44,
    borderWidth: StyleSheet.hairlineWidth,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  title: {
    textAlign: 'center',
    marginBottom: 10,
  },
  body: {
    textAlign: 'center',
    maxWidth: 280,
    fontSize: 13,
    lineHeight: 19,
    marginBottom: 24,
  },
  cta: {
    height: 40,
    paddingHorizontal: 18,
    borderRadius: 9999,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: StyleSheet.hairlineWidth,
  },
  ctaLabel: {
    fontSize: 13,
    letterSpacing: 0.2,
  },
});

export default EmptyResults;
