import { useAppTheme } from '@/shared/theme';
import { darkPalette, lightPalette } from '@/shared/theme/tokens';
import type { ThemePref } from '@/stores/ui.store';
import { StyleSheet, View } from 'react-native';

interface Props {
  variant: ThemePref;
  size?: number;
}

const ThemeSwatch = ({ variant, size = 38 }: Props) => {
  const t = useAppTheme();
  const palette = variant === 'light' ? lightPalette : darkPalette;
  const { bg, ink: fg, accent: dot } = palette;

  return (
    <View
      style={[
        styles.container,
        {
          width: size,
          height: size,
          borderColor: t.tokens.semantic.hairlineStrong,
        },
      ]}
    >
      {variant === 'system' ? (
        <View style={StyleSheet.absoluteFillObject}>
          <View style={[styles.half, { backgroundColor: lightPalette.bg, left: 0 }]} />
          <View style={[styles.half, { backgroundColor: darkPalette.bg, right: 0 }]} />
        </View>
      ) : (
        <View style={[StyleSheet.absoluteFillObject, { backgroundColor: bg }]} />
      )}
      <View style={[styles.line, { left: 6, top: 7, width: 26, backgroundColor: fg, opacity: 0.55 }]} />
      <View style={[styles.line, { left: 6, top: 13, width: 18, backgroundColor: fg, opacity: 0.35 }]} />
      <View style={[styles.dot, { backgroundColor: dot }]} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 10,
    overflow: 'hidden',
    borderWidth: StyleSheet.hairlineWidth,
    position: 'relative',
  },
  half: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: '50%',
  },
  line: {
    position: 'absolute',
    height: 3,
    borderRadius: 2,
  },
  dot: {
    position: 'absolute',
    right: 6,
    bottom: 6,
    width: 8,
    height: 8,
    borderRadius: 4,
  },
});

export default ThemeSwatch;
