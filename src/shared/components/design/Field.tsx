import { useAppTheme } from '@/shared/theme';
import { forwardRef, useState } from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  type TextInputProps,
  type ViewStyle,
} from 'react-native';

type FocusHandler = NonNullable<TextInputProps['onFocus']>;
type BlurHandler = NonNullable<TextInputProps['onBlur']>;

interface Props extends Omit<TextInputProps, 'style'> {
  label: string;
  helper?: string;
  error?: string | null;
  multiline?: boolean;
  containerStyle?: ViewStyle;
  trailing?: React.ReactNode;
}

const Field = forwardRef<TextInput, Props>(
  (
    {
      label,
      helper,
      error,
      multiline,
      containerStyle,
      trailing,
      onFocus,
      onBlur,
      placeholder,
      ...rest
    },
    ref,
  ) => {
    const t = useAppTheme();
    const [focused, setFocused] = useState(false);

    const handleFocus: FocusHandler = (e) => {
      setFocused(true);
      onFocus?.(e);
    };

    const handleBlur: BlurHandler = (e) => {
      setFocused(false);
      onBlur?.(e);
    };

    const accentColor = error
      ? t.tokens.semantic.statusDropped
      : focused
        ? t.tokens.semantic.accent
        : t.tokens.semantic.inkFaint;

    const borderColor = error
      ? t.tokens.semantic.statusDropped
      : focused
        ? t.tokens.semantic.accent
        : t.tokens.semantic.hairlineStrong;

    return (
      <View style={containerStyle}>
        <View
          collapsable={false}
          style={[
            styles.box,
            {
              backgroundColor: t.tokens.semantic.surface1,
              borderColor,
              ...(focused && !error
                ? {
                    shadowColor: t.tokens.semantic.accent,
                    shadowOffset: { width: 0, height: 0 },
                    shadowOpacity: 0.18,
                    shadowRadius: 8,
                    elevation: 0,
                  }
                : null),
            },
          ]}
        >
          <View style={styles.row}>
            <View style={styles.column}>
              <Text
                style={{
                  fontFamily: t.tokens.fonts.sansSemiBold,
                  fontSize: 10,
                  letterSpacing: 0.8,
                  textTransform: 'uppercase',
                  color: accentColor,
                  marginBottom: 4,
                }}
              >
                {label}
              </Text>
              <TextInput
                ref={ref}
                placeholder={placeholder}
                placeholderTextColor={t.tokens.semantic.inkFaint}
                onFocus={handleFocus}
                onBlur={handleBlur}
                multiline={multiline}
                style={{
                  fontFamily: t.tokens.fonts.sansRegular,
                  fontSize: 15,
                  color: t.tokens.semantic.ink,
                  padding: 0,
                  minHeight: multiline ? 60 : 22,
                  textAlignVertical: multiline ? 'top' : 'center',
                  lineHeight: multiline ? 22 : undefined,
                }}
                {...rest}
              />
            </View>
            {trailing ? <View style={styles.trailing}>{trailing}</View> : null}
          </View>
        </View>
        {error || helper ? (
          <Text
            style={{
              fontFamily: t.tokens.fonts.sansRegular,
              fontSize: 11,
              marginTop: 6,
              paddingLeft: 4,
              color: error ? t.tokens.semantic.statusDropped : t.tokens.semantic.inkFaint,
            }}
          >
            {error ?? helper}
          </Text>
        ) : null}
      </View>
    );
  },
);

Field.displayName = 'Field';

const styles = StyleSheet.create({
  box: {
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 12,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  column: {
    flex: 1,
  },
  trailing: {
    marginLeft: 8,
  },
});

export default Field;
