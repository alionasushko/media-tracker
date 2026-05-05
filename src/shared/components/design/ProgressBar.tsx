import { useEffect } from 'react';
import { View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { useAppTheme } from '@/shared/theme';

interface Props {
  value: number;
  total: number;
  height?: number;
}

const ProgressBar = ({ value, total, height = 3 }: Props) => {
  const t = useAppTheme();
  const pct = useSharedValue(0);
  const target = total > 0 ? Math.max(0, Math.min(1, value / total)) : 0;

  useEffect(() => {
    pct.value = withSpring(target, { damping: 18, stiffness: 140 });
  }, [target, pct]);

  const fillStyle = useAnimatedStyle(() => ({
    width: `${pct.value * 100}%`,
  }));

  return (
    <View
      style={{
        height,
        borderRadius: height,
        backgroundColor: t.tokens.semantic.surface3,
        overflow: 'hidden',
      }}
    >
      <Animated.View
        style={[
          {
            height: '100%',
            borderRadius: height,
            backgroundColor: t.tokens.semantic.accent,
          },
          fillStyle,
        ]}
      />
    </View>
  );
};

export default ProgressBar;
