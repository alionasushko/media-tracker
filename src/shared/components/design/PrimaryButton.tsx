import { ActivityIndicator, Pressable, StyleSheet, Text, View, type ViewStyle } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useAppTheme } from '@/shared/theme';

interface Props {
  label: string;
  onPress?: () => void;
  loading?: boolean;
  disabled?: boolean;
  icon?: keyof typeof MaterialCommunityIcons.glyphMap;
  variant?: 'primary' | 'secondary' | 'ghost';
  fullWidth?: boolean;
  style?: ViewStyle;
}

const PrimaryButton = ({
  label,
  onPress,
  loading,
  disabled,
  icon,
  variant = 'primary',
  fullWidth = true,
  style,
}: Props) => {
  const t = useAppTheme();
  const isPrimary = variant === 'primary';
  const isSecondary = variant === 'secondary';

  const bg = isPrimary
    ? t.tokens.semantic.accent
    : isSecondary
      ? t.tokens.semantic.surface1
      : 'transparent';
  const fg = isPrimary
    ? t.tokens.semantic.accentInk
    : isSecondary
      ? t.tokens.semantic.ink
      : t.tokens.semantic.ink;
  const borderColor = isSecondary ? t.tokens.semantic.hairlineStrong : 'transparent';

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || loading}
      style={[
        styles.btn,
        {
          backgroundColor: bg,
          borderColor,
          opacity: disabled ? 0.5 : 1,
          width: fullWidth ? '100%' : undefined,
          shadowColor: isPrimary ? t.tokens.semantic.accent : 'transparent',
          shadowOffset: { width: 0, height: 6 },
          shadowOpacity: isPrimary ? 0.35 : 0,
          shadowRadius: 16,
          elevation: isPrimary ? 4 : 0,
        },
        style,
      ]}
    >
      <View style={styles.row}>
        {loading ? (
          <ActivityIndicator color={fg} size={16} style={{ marginRight: 10 }} />
        ) : icon ? (
          <MaterialCommunityIcons
            name={icon}
            size={18}
            color={fg}
            style={{ marginRight: 10 }}
          />
        ) : null}
        <Text
          style={{
            fontFamily: t.tokens.fonts.sansBold,
            fontSize: 14,
            letterSpacing: 0.3,
            color: fg,
          }}
        >
          {label}
        </Text>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  btn: {
    height: 52,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: StyleSheet.hairlineWidth,
  },
  row: { flexDirection: 'row', alignItems: 'center' },
});

export default PrimaryButton;
