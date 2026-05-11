import { Eyebrow } from '@/shared/components/design/text';
import { useAppTheme } from '@/shared/theme';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';

interface Props {
  tags: string[];
}

const DetailTags = ({ tags }: Props) => {
  const t = useAppTheme();
  if (tags.length === 0) return null;
  return (
    <View style={styles.container}>
      <Eyebrow style={styles.eyebrow}>Tags</Eyebrow>
      <View style={styles.row}>
        {tags.map((tag) => (
          <View
            key={tag}
            style={[
              styles.chip,
              {
                backgroundColor: t.tokens.semantic.surface2,
                borderColor: t.tokens.semantic.hairline,
              },
            ]}
          >
            <MaterialCommunityIcons
              name="tag-outline"
              size={11}
              color={t.tokens.semantic.inkFaint}
              style={styles.icon}
            />
            <Text
              style={[
                styles.label,
                { fontFamily: t.tokens.fonts.sansMedium, color: t.tokens.semantic.inkMute },
              ]}
            >
              {tag}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 28,
    paddingTop: 24,
  },
  eyebrow: {
    marginBottom: 12,
  },
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 28,
    paddingHorizontal: 10,
    borderRadius: 9999,
    borderWidth: StyleSheet.hairlineWidth,
  },
  icon: {
    marginRight: 5,
  },
  label: {
    fontSize: 12,
  },
});

export default DetailTags;
