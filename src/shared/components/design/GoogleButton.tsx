import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useAppTheme } from '@/shared/theme';

interface Props {
  label?: string;
  onPress?: () => void;
  loading?: boolean;
  disabled?: boolean;
}

const GoogleButton = ({ label = 'Continue with Google', onPress, loading, disabled }: Props) => {
  const t = useAppTheme();
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || loading}
      style={[
        styles.btn,
        {
          backgroundColor: t.tokens.semantic.surface1,
          borderColor: t.tokens.semantic.hairlineStrong,
          opacity: disabled ? 0.5 : 1,
        },
      ]}
    >
      <View style={styles.row}>
        {loading ? (
          <ActivityIndicator color={t.tokens.semantic.ink} size={16} style={{ marginRight: 10 }} />
        ) : (
          <MaterialCommunityIcons
            name="google"
            size={18}
            color={t.tokens.semantic.ink}
            style={{ marginRight: 12 }}
          />
        )}
        <Text
          style={{
            fontFamily: t.tokens.fonts.sansSemiBold,
            fontSize: 14,
            color: t.tokens.semantic.ink,
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
    width: '100%',
    height: 52,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: StyleSheet.hairlineWidth,
  },
  row: { flexDirection: 'row', alignItems: 'center' },
});

export default GoogleButton;
