import { useAppTheme } from '@/shared/theme';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';
import Animated, { FadeInDown, FadeOutUp } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const OfflineBanner = () => {
  const t = useAppTheme();
  const insets = useSafeAreaInsets();

  return (
    <Animated.View
      entering={FadeInDown.duration(200)}
      exiting={FadeOutUp.duration(180)}
      pointerEvents="none"
      style={[
        styles.wrap,
        {
          paddingTop: insets.top + 6,
          backgroundColor: t.tokens.semantic.statusPlan,
        },
      ]}
    >
      <View style={styles.row}>
        <MaterialCommunityIcons name="wifi-off" size={14} color="white" />
        <Text style={[styles.label, { fontFamily: t.tokens.fonts.sansSemiBold }]}>
          You&apos;re offline · changes will sync when you&apos;re back
        </Text>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  wrap: {
    paddingBottom: 8,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingHorizontal: 16,
  },
  label: {
    color: 'white',
    fontSize: 12,
    letterSpacing: 0.2,
  },
});

export default OfflineBanner;
