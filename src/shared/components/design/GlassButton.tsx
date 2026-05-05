import { Pressable, StyleSheet, View, type ViewStyle } from 'react-native';
import { BlurView } from 'expo-blur';
import { useAppTheme } from '@/shared/theme';

interface Props {
  onPress?: () => void;
  size?: number;
  children: React.ReactNode;
  style?: ViewStyle;
  accessibilityLabel?: string;
}

const GlassButton = ({ onPress, size = 36, children, style, accessibilityLabel }: Props) => {
  const t = useAppTheme();
  const isDark = t.tokens.semantic.bg.startsWith('#0') || t.tokens.semantic.bg === '#000000';
  return (
    <Pressable
      onPress={onPress}
      accessibilityLabel={accessibilityLabel}
      style={[{ width: size, height: size, borderRadius: size / 2 }, style]}
    >
      <BlurView
        intensity={50}
        tint={isDark ? 'dark' : 'light'}
        style={[
          StyleSheet.absoluteFillObject,
          {
            borderRadius: size / 2,
            overflow: 'hidden',
            borderWidth: StyleSheet.hairlineWidth,
            borderColor: t.tokens.semantic.hairlineStrong,
          },
        ]}
      />
      <View
        style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {children}
      </View>
    </Pressable>
  );
};

export default GlassButton;
