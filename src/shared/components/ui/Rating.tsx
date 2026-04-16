import { Pressable, StyleSheet, View } from 'react-native';
import { Icon, useTheme } from 'react-native-paper';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';

const Star = ({
  filled,
  size,
  onPress,
  index,
  max,
  filledColor,
  emptyColor,
}: {
  filled: boolean;
  size: number;
  onPress: () => void;
  index: number;
  max: number;
  filledColor: string;
  emptyColor: string;
}) => {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePress = () => {
    scale.value = withSpring(1.25, { damping: 10, stiffness: 400 });
    setTimeout(() => {
      scale.value = withSpring(1, { damping: 10, stiffness: 400 });
    }, 80);
    onPress();
  };

  return (
    <Pressable
      onPress={handlePress}
      hitSlop={6}
      accessibilityRole="button"
      accessibilityLabel={`Rate ${index + 1} of ${max}`}
    >
      <Animated.View style={animatedStyle}>
        <Icon
          source={filled ? 'star' : 'star-outline'}
          size={size}
          color={filled ? filledColor : emptyColor}
        />
      </Animated.View>
    </Pressable>
  );
};

const Rating = ({
  value = 0,
  onChange,
  max = 5,
  size = 20,
}: {
  value?: number;
  onChange?: (v: number) => void;
  max?: number;
  size?: number;
}) => {
  const theme = useTheme();
  const v = Math.max(0, Math.min(value || 0, max));

  return (
    <View
      style={styles.container}
      accessible
      accessibilityRole="adjustable"
      accessibilityLabel={`Rating: ${v} out of ${max}`}
    >
      {Array.from({ length: max }).map((_, i) => (
        <Star
          key={i}
          filled={i < v}
          size={size}
          onPress={() => onChange?.(i + 1)}
          index={i}
          max={max}
          filledColor={theme.colors.primary}
          emptyColor={theme.colors.outline}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flexDirection: 'row', alignItems: 'center', gap: 2 },
});

export default Rating;
