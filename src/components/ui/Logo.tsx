import React from 'react';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import { Icon, Text, useTheme } from 'react-native-paper';

export type LogoVariant = 'wordmark' | 'badge';

interface Props {
  variant?: LogoVariant;
  /** 'sm' ≈ 18, 'md' ≈ 22, 'lg' ≈ 28 */
  size?: 'sm' | 'md' | 'lg' | number;
  showIcon?: boolean;
}

const sizeToPx = (s: Props['size']) =>
  s === 'sm' ? 18 : s === 'md' ? 22 : s === 'lg' ? 28 : typeof s === 'number' ? s : 22;

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
    <Icon source="play" color={tint} size={Math.round(box * 0.65)} />
  </View>
);

const Logo: React.FC<Props> = ({ variant = 'wordmark', size = 'md', showIcon = false }) => {
  const { colors } = useTheme();
  const fontSize = sizeToPx(size);
  const box = fontSize + 8;

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
        <Text style={[styles.logoTitleFontBold, { color: colors.primary }]}> Tracker</Text>
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  logoTileWrapper: {
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoTileMargin: { marginRight: 6 },
  logoWordmarkWrapper: { flexDirection: 'row', alignItems: 'center' },
  logoTitle: { fontWeight: '800', letterSpacing: 0.3 },
  logoTitleFontBold: { fontWeight: '900' },
});

export default Logo;
