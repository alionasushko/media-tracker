import CoverArt from '@/shared/components/design/CoverArt';
import TypeIcon from '@/shared/components/design/TypeIcon';
import { useAppTheme } from '@/shared/theme';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import type { UserMedia } from '../types';

interface Props {
  items: UserMedia[];
  onOpen: (id: string) => void;
}

const COVER_W = 108;
const COVER_H = 156;

const UpNextShelf = ({ items, onOpen }: Props) => {
  const t = useAppTheme();
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.shelf}
    >
      {items.map((m) => (
        <Pressable key={m.id} onPress={() => onOpen(m.id)} style={styles.item}>
          <CoverArt
            path={m.coverUrl}
            title={m.title}
            type={m.type}
            width={COVER_W}
            height={COVER_H}
            radius={10}
          />
          <Text
            numberOfLines={1}
            style={[
              styles.title,
              { fontFamily: t.tokens.fonts.sansSemiBold, color: t.tokens.semantic.ink },
            ]}
          >
            {m.title}
          </Text>
          <View style={styles.metaRow}>
            <TypeIcon type={m.type} size={10} color={t.tokens.semantic.inkFaint} />
            <Text
              style={[
                styles.metaText,
                { fontFamily: t.tokens.fonts.sansMedium, color: t.tokens.semantic.inkFaint },
              ]}
            >
              {m.type}
            </Text>
          </View>
        </Pressable>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  shelf: {
    paddingHorizontal: 24,
    gap: 14,
  },
  item: {
    width: COVER_W,
  },
  title: {
    marginTop: 8,
    fontSize: 12,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 3,
  },
  metaText: {
    marginLeft: 4,
    fontSize: 10,
    textTransform: 'capitalize',
    letterSpacing: 0.4,
  },
});

export default UpNextShelf;
