import { Pressable, StyleSheet, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withSpring,
} from 'react-native-reanimated';
import { useAppTheme } from '@/shared/theme';

interface StarProps {
  filled: boolean;
  size: number;
  filledColor: string;
  emptyColor: string;
  onPress: () => void;
  index: number;
}

const Star = ({ filled, size, filledColor, emptyColor, onPress, index }: StarProps) => {
  const scale = useSharedValue(1);
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));
  const handlePress = () => {
    scale.value = withSequence(
      withSpring(1.3, { damping: 8, stiffness: 400 }),
      withSpring(1, { damping: 12, stiffness: 320 }),
    );
    onPress();
  };
  return (
    <Pressable onPress={handlePress} hitSlop={6} accessibilityLabel={`Rate ${index + 1}`}>
      <Animated.View style={animatedStyle}>
        <MaterialCommunityIcons
          name={filled ? 'star' : 'star-outline'}
          size={size}
          color={filled ? filledColor : emptyColor}
        />
      </Animated.View>
    </Pressable>
  );
};

interface Props {
  value: number;
  onChange?: (v: number) => void;
  size?: number;
  spacing?: number;
}

const Stars = ({ value = 0, onChange, size = 22, spacing = 6 }: Props) => {
  const t = useAppTheme();
  const v = Math.max(0, Math.min(value, 5));
  return (
    <View style={[styles.row, { gap: spacing }]}>
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          filled={i < v}
          size={size}
          filledColor={t.tokens.semantic.accent}
          emptyColor={t.tokens.semantic.inkGhost}
          onPress={() => onChange?.(i + 1)}
          index={i}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center' },
});

export default Stars;
