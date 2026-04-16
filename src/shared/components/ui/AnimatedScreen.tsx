import type { PropsWithChildren } from 'react';
import type { StyleProp, ViewStyle } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';

interface Props {
  style?: StyleProp<ViewStyle>;
}

const AnimatedScreen = ({ children, style }: PropsWithChildren<Props>) => (
  <Animated.View entering={FadeIn.duration(200)} style={[{ flex: 1 }, style]}>
    {children}
  </Animated.View>
);

export default AnimatedScreen;
