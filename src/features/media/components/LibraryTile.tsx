import { mediaTypeIconNames } from '@/features/media/constants';
import type { UserMedia } from '@/features/media/types';
import CoverArt from '@/shared/components/design/CoverArt';
import StatusDot from '@/shared/components/design/StatusDot';
import { Mono } from '@/shared/components/design/text';
import { useAppTheme } from '@/shared/theme';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Pressable, StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';
import Animated, { FadeInDown } from 'react-native-reanimated';

const ENTRY_DELAY_CAP = 12;

interface Props {
  item: UserMedia;
  tileWidth: number;
  index: number;
  onPress: () => void;
}

const LibraryTile = ({ item, tileWidth, index, onPress }: Props) => {
  const t = useAppTheme();

  return (
    <Animated.View
      entering={FadeInDown.duration(260)
        .delay(Math.min(index, ENTRY_DELAY_CAP) * 30)
        .springify()}
    >
      <Pressable onPress={onPress} style={{ width: tileWidth }}>
        <CoverArt
          path={item.coverUrl}
          title={item.title}
          type={item.type}
          width={tileWidth}
          radius={9}
        >
          <View style={styles.tileBadge}>
            <StatusDot status={item.status} size={5} />
            <MaterialCommunityIcons
              name={mediaTypeIconNames[item.type]}
              size={9}
              color="#FFFFFF"
              style={{ marginLeft: 4 }}
            />
          </View>
          {(item.rating ?? 0) > 0 ? (
            <View style={styles.ratingBadge}>
              <MaterialCommunityIcons
                name="star"
                size={9}
                color={t.tokens.semantic.accent}
              />
              <Mono style={[styles.ratingText, { color: '#FFFFFF' }]}>{item.rating}</Mono>
            </View>
          ) : null}
        </CoverArt>
        <Text
          numberOfLines={2}
          style={[
            styles.title,
            {
              fontFamily: t.tokens.fonts.sansSemiBold,
              color: t.tokens.semantic.ink,
            },
          ]}
        >
          {item.title}
        </Text>
      </Pressable>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  tileBadge: {
    position: 'absolute',
    top: 6,
    left: 6,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.55)',
    borderRadius: 9999,
    paddingHorizontal: 7,
    paddingVertical: 3,
  },
  ratingBadge: {
    position: 'absolute',
    bottom: 5,
    right: 5,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.6)',
    borderRadius: 9999,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  ratingText: {
    fontSize: 10,
    marginLeft: 3,
    fontWeight: '700',
  },
  title: {
    marginTop: 6,
    fontSize: 11,
    lineHeight: 14,
  },
});

export default LibraryTile;
