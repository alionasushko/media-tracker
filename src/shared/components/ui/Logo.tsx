import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import { Icon, Text, useTheme } from 'react-native-paper';

export type LogoVariant = 'wordmark' | 'badge';

interface Props {
  variant?: LogoVariant;
  size?: 'sm' | 'md' | 'lg' | number;
  showIcon?: boolean;
}

const sizeToPx = (s: Props['size']) =>
  s === 'sm' ? 16 : s === 'md' ? 20 : s === 'lg' ? 26 : typeof s === 'number' ? s : 20;

const LogoTile = ({
  box,
  tint,
  bg,
  style,
}: {
  box: number;
  tint: string;
  bg: string;
  style?: StyleProp<ViewStyle>;
}) => (
  <View
    style={[
      {
        width: box,
        height: box,
        backgroundColor: bg,
      },
      styles.logoTileWrapper,
      style,
    ]}
  >
    <Icon source="play" color={tint} size={Math.round(box * 0.55)} />
  </View>
);

const Logo = ({ variant = 'wordmark', size = 'md', showIcon = false }: Props) => {
  const { colors } = useTheme();
  const fontSize = sizeToPx(size);
  const box = fontSize + 10;

  if (variant === 'badge') {
    return <LogoTile box={box} bg={colors.primary} tint={colors.onPrimary} />;
  }

  return (
    <View style={styles.logoWordmarkWrapper}>
      {showIcon && (
        <LogoTile
          box={box}
          bg={colors.primary}
          tint={colors.onPrimary}
          style={styles.logoTileMargin}
        />
      )}
      <Text style={[styles.logoTitle, { fontSize }]}>
        Media
        <Text style={[styles.logoAccent, { color: colors.primary }]}> Tracker</Text>
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  logoTileWrapper: {
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoTileMargin: { marginRight: 8 },
  logoWordmarkWrapper: { flexDirection: 'row', alignItems: 'center' },
  logoTitle: { fontFamily: 'Inter-SemiBold', letterSpacing: -0.3 },
  logoAccent: { fontFamily: 'Inter-Bold', letterSpacing: -0.3 },
});

export default Logo;
