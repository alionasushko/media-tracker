import { useAppTheme } from '@/shared/theme';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { BlurView } from 'expo-blur';
import { router } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface TabSpec {
  routeName: string;
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  iconActive: keyof typeof MaterialCommunityIcons.glyphMap;
  label: string;
}

const TABS: TabSpec[] = [
  { routeName: 'index', icon: 'home-outline', iconActive: 'home', label: 'Home' },
  {
    routeName: 'library',
    icon: 'view-grid-outline',
    iconActive: 'view-grid',
    label: 'Library',
  },
  { routeName: 'stats', icon: 'chart-donut', iconActive: 'chart-donut', label: 'Stats' },
  { routeName: 'settings', icon: 'cog-outline', iconActive: 'cog', label: 'Settings' },
];

const TabButton = ({
  spec,
  active,
  onPress,
}: {
  spec: TabSpec;
  active: boolean;
  onPress: () => void;
}) => {
  const t = useAppTheme();
  const scale = useSharedValue(1);
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Pressable
      onPress={onPress}
      onPressIn={() => {
        scale.value = withSpring(0.9, { damping: 14, stiffness: 380 });
      }}
      onPressOut={() => {
        scale.value = withSpring(1, { damping: 14, stiffness: 380 });
      }}
      style={styles.tab}
      accessibilityLabel={spec.label}
    >
      <Animated.View style={[styles.tabInner, animatedStyle]}>
        <MaterialCommunityIcons
          name={active ? spec.iconActive : spec.icon}
          size={20}
          color={active ? t.tokens.semantic.ink : t.tokens.semantic.inkFaint}
        />
        <Text
          style={{
            fontFamily: t.tokens.fonts.sansSemiBold,
            fontSize: 9,
            letterSpacing: 0.4,
            textTransform: 'uppercase',
            color: active ? t.tokens.semantic.ink : t.tokens.semantic.inkFaint,
            marginTop: 3,
          }}
        >
          {spec.label}
        </Text>
        {active ? (
          <View
            style={[
              styles.activeDot,
              {
                backgroundColor: t.tokens.semantic.accent,
                shadowColor: t.tokens.semantic.accent,
              },
            ]}
          />
        ) : null}
      </Animated.View>
    </Pressable>
  );
};

const AddFab = ({ onPress }: { onPress: () => void }) => {
  const t = useAppTheme();
  const scale = useSharedValue(1);
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));
  return (
    <Pressable
      onPress={onPress}
      onPressIn={() => {
        scale.value = withSpring(0.88, { damping: 12, stiffness: 360 });
      }}
      onPressOut={() => {
        scale.value = withSpring(1, { damping: 12, stiffness: 360 });
      }}
      accessibilityLabel="Add"
      style={styles.fabSlot}
    >
      <Animated.View
        style={[
          styles.fab,
          {
            backgroundColor: t.tokens.semantic.accent,
            shadowColor: t.tokens.semantic.accent,
          },
          animatedStyle,
        ]}
      >
        <MaterialCommunityIcons name="plus" size={22} color={t.tokens.semantic.accentInk} />
      </Animated.View>
    </Pressable>
  );
};

const FloatingTabBar = ({ state, navigation }: BottomTabBarProps) => {
  const t = useAppTheme();
  const insets = useSafeAreaInsets();
  const isDark =
    t.tokens.semantic.bg.startsWith('#0') || t.tokens.semantic.bg === '#000000';

  const handleTabPress = (routeName: string) => {
    const route = state.routes.find((r) => r.name === routeName);
    if (!route) return;
    const event = navigation.emit({
      type: 'tabPress',
      target: route.key,
      canPreventDefault: true,
    });
    const isFocused = state.routes[state.index]?.name === routeName;
    if (!isFocused && !event.defaultPrevented) {
      navigation.navigate(routeName);
    }
  };

  const handleAddPress = () => {
    router.push('/(app)/item/add');
  };

  const half = Math.ceil(TABS.length / 2);
  const left = TABS.slice(0, half);
  const right = TABS.slice(half);

  return (
    <View
      pointerEvents="box-none"
      style={[styles.wrap, { paddingBottom: insets.bottom > 0 ? insets.bottom : 16 }]}
    >
      <View
        style={[
          styles.bar,
          {
            borderColor: t.tokens.semantic.hairlineStrong,
            shadowColor: '#000',
          },
        ]}
      >
        <BlurView
          intensity={60}
          tint={isDark ? 'dark' : 'light'}
          style={StyleSheet.absoluteFillObject}
        />
        <View
          style={[
            StyleSheet.absoluteFillObject,
            {
              backgroundColor: isDark
                ? 'rgba(34, 31, 27, 0.5)'
                : 'rgba(255, 255, 255, 0.55)',
            },
          ]}
        />

        <View style={styles.barInner}>
          {left.map((spec) => (
            <TabButton
              key={spec.routeName}
              spec={spec}
              active={state.routes[state.index]?.name === spec.routeName}
              onPress={() => handleTabPress(spec.routeName)}
            />
          ))}
          <AddFab onPress={handleAddPress} />
          {right.map((spec) => (
            <TabButton
              key={spec.routeName}
              spec={spec}
              active={state.routes[state.index]?.name === spec.routeName}
              onPress={() => handleTabPress(spec.routeName)}
            />
          ))}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrap: {
    position: 'absolute',
    left: 16,
    right: 16,
    bottom: 0,
  },
  bar: {
    height: 64,
    borderRadius: 9999,
    borderWidth: StyleSheet.hairlineWidth,
    overflow: 'hidden',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.4,
    shadowRadius: 24,
    elevation: 8,
  },
  barInner: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingHorizontal: 12,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 6,
  },
  tabInner: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeDot: {
    position: 'absolute',
    bottom: -6,
    width: 4,
    height: 4,
    borderRadius: 2,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 6,
    elevation: 4,
  },
  fabSlot: {
    width: 56,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fab: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 6,
  },
});

export default FloatingTabBar;
