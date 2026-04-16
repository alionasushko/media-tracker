import Rating from '@/shared/components/ui/Rating';
import Cover from '@/features/media/components/Cover';
import { UserMedia } from '@/features/media/types';
import { Pressable, StyleSheet, View } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';

const MediaCard = ({ item, onPress }: { item: UserMedia; onPress?: () => void }) => {
  const theme = useTheme();
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.98, { damping: 20, stiffness: 300 });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 20, stiffness: 300 });
  };

  return (
    <Animated.View style={animatedStyle}>
      <Pressable
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={[
          styles.card,
          {
            backgroundColor: theme.colors.surface,
            borderColor: theme.colors.outlineVariant,
          },
        ]}
      >
        <Cover path={item.coverUrl} previewStyle={styles.cover} />
        <View style={styles.content}>
          <Text
            style={[styles.title, { color: theme.colors.onSurface }]}
            numberOfLines={1}
          >
            {item.title}
          </Text>
          <Text style={[styles.meta, { color: theme.colors.onSurfaceVariant }]}>
            {item.type} &bull; {item.status}
          </Text>
          {typeof item.rating === 'number' && item.rating > 0 ? (
            <View style={styles.ratingRow}>
              <Rating value={item.rating} size={16} />
            </View>
          ) : null}
        </View>
      </Pressable>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
  },
  cover: { borderRadius: 0 },
  content: { padding: 14, gap: 2 },
  title: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 15,
    letterSpacing: -0.1,
  },
  meta: {
    fontFamily: 'Inter-Regular',
    fontSize: 13,
    textTransform: 'capitalize',
    opacity: 0.6,
  },
  ratingRow: { marginTop: 6 },
});

export default MediaCard;
