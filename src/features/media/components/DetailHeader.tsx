import GlassButton from '@/shared/components/design/GlassButton';
import { useAppTheme } from '@/shared/theme';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { StyleSheet, Text, View } from 'react-native';
import Animated, {
  interpolate,
  useAnimatedStyle,
  type SharedValue,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface Props {
  title: string;
  scrollY: SharedValue<number>;
  onBack: () => void;
  onMore: () => void;
}

const DetailHeader = ({ title, scrollY, onBack, onMore }: Props) => {
  const t = useAppTheme();
  const insets = useSafeAreaInsets();
  const isDark = t.tokens.semantic.bg.startsWith('#0') || t.tokens.semantic.bg === '#000000';

  const headerBgStyle = useAnimatedStyle(() => ({
    opacity: interpolate(scrollY.value, [180, 240], [0, 1], 'clamp'),
  }));

  const titleStyle = useAnimatedStyle(() => ({
    opacity: interpolate(scrollY.value, [200, 260], [0, 1], 'clamp'),
  }));

  return (
    <>
      <Animated.View
        pointerEvents="none"
        style={[
          styles.bg,
          { paddingTop: insets.top, backgroundColor: t.tokens.semantic.bg },
          headerBgStyle,
        ]}
      >
        <BlurView
          intensity={40}
          tint={isDark ? 'dark' : 'light'}
          style={StyleSheet.absoluteFillObject}
        />
        <View style={[styles.hairline, { backgroundColor: t.tokens.semantic.hairline }]} />
      </Animated.View>

      <View style={[styles.row, { paddingTop: insets.top + 6 }]}>
        <GlassButton onPress={onBack} accessibilityLabel="Back">
          <MaterialCommunityIcons name="chevron-left" size={20} color={t.tokens.semantic.ink} />
        </GlassButton>
        <Animated.View style={[styles.titleWrap, titleStyle]}>
          <Text
            numberOfLines={1}
            style={[
              styles.title,
              { fontFamily: t.tokens.fonts.serifMedium, color: t.tokens.semantic.ink },
            ]}
          >
            {title}
          </Text>
        </Animated.View>
        <GlassButton onPress={onMore} accessibilityLabel="More">
          <MaterialCommunityIcons name="dots-horizontal" size={20} color={t.tokens.semantic.ink} />
        </GlassButton>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  bg: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 5,
    height: 100,
  },
  hairline: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: StyleSheet.hairlineWidth,
  },
  row: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    paddingHorizontal: 16,
    paddingBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  titleWrap: {
    flex: 1,
    paddingHorizontal: 12,
  },
  title: {
    fontSize: 16,
    textAlign: 'center',
  },
});

export default DetailHeader;
