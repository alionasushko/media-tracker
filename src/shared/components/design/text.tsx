import { Text, type TextProps, type TextStyle } from 'react-native';
import { useAppTheme } from '@/shared/theme';

interface BaseProps extends TextProps {
  style?: TextStyle | TextStyle[];
}

export const Eyebrow = ({ style, children, ...rest }: BaseProps) => {
  const t = useAppTheme();
  return (
    <Text
      {...rest}
      style={[
        {
          fontFamily: t.tokens.fonts.monoMedium,
          fontSize: 10,
          letterSpacing: 1.6,
          textTransform: 'uppercase',
          color: t.tokens.semantic.inkFaint,
        },
        style as TextStyle,
      ]}
    >
      {children}
    </Text>
  );
};

interface DisplayProps extends BaseProps {
  size?: number;
}

export const Display = ({ style, size = 28, children, ...rest }: DisplayProps) => {
  const t = useAppTheme();
  return (
    <Text
      {...rest}
      style={[
        {
          fontFamily: t.tokens.fonts.serifMedium,
          fontSize: size,
          lineHeight: size * 1.05,
          letterSpacing: -size * 0.022,
          color: t.tokens.semantic.ink,
        },
        style as TextStyle,
      ]}
    >
      {children}
    </Text>
  );
};

export const Mono = ({ style, children, ...rest }: BaseProps) => {
  const t = useAppTheme();
  return (
    <Text
      {...rest}
      style={[
        {
          fontFamily: t.tokens.fonts.monoRegular,
          color: t.tokens.semantic.ink,
        },
        style as TextStyle,
      ]}
    >
      {children}
    </Text>
  );
};
