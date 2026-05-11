import ThemeSwatch from '@/shared/components/design/ThemeSwatch';
import { Eyebrow } from '@/shared/components/design/text';
import { useAppTheme } from '@/shared/theme';
import type { ThemePref } from '@/stores/ui.store';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';

interface ThemeOption {
  value: ThemePref;
  label: string;
  subtitle: string;
}

const THEME_OPTIONS: ThemeOption[] = [
  { value: 'system', label: 'System', subtitle: 'Match device' },
  { value: 'light', label: 'Light', subtitle: 'Bright surfaces' },
  { value: 'dark', label: 'Dark', subtitle: 'Warm low-light' },
];

interface Props {
  value: ThemePref;
  onChange: (v: ThemePref) => void;
}

const AppearancePicker = ({ value, onChange }: Props) => {
  const t = useAppTheme();
  return (
    <View>
      <Eyebrow style={styles.eyebrow}>Appearance</Eyebrow>
      <View
        style={[
          styles.card,
          {
            backgroundColor: t.tokens.semantic.surface1,
            borderColor: t.tokens.semantic.hairline,
          },
        ]}
      >
        {THEME_OPTIONS.map((opt, idx) => {
          const active = value === opt.value;
          const isLast = idx === THEME_OPTIONS.length - 1;
          return (
            <Pressable
              key={opt.value}
              onPress={() => onChange(opt.value)}
              style={[
                styles.row,
                isLast
                  ? null
                  : {
                      borderBottomWidth: StyleSheet.hairlineWidth,
                      borderBottomColor: t.tokens.semantic.hairline,
                    },
              ]}
            >
              <ThemeSwatch variant={opt.value} />
              <View style={styles.rowBody}>
                <Text
                  style={[
                    styles.rowLabel,
                    { fontFamily: t.tokens.fonts.sansSemiBold, color: t.tokens.semantic.ink },
                  ]}
                >
                  {opt.label}
                </Text>
                <Text
                  style={[
                    styles.rowSubtitle,
                    { fontFamily: t.tokens.fonts.sansRegular, color: t.tokens.semantic.inkMute },
                  ]}
                >
                  {opt.subtitle}
                </Text>
              </View>
              <View
                style={[
                  styles.radio,
                  {
                    borderColor: active
                      ? t.tokens.semantic.accent
                      : t.tokens.semantic.inkGhost,
                    backgroundColor: active ? t.tokens.semantic.accent : 'transparent',
                    borderWidth: active ? 0 : 1.5,
                  },
                ]}
              >
                {active ? (
                  <MaterialCommunityIcons
                    name="check"
                    size={12}
                    color={t.tokens.semantic.accentInk}
                  />
                ) : null}
              </View>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  eyebrow: {
    marginBottom: 12,
  },
  card: {
    borderRadius: 18,
    borderWidth: StyleSheet.hairlineWidth,
    overflow: 'hidden',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  rowBody: {
    flex: 1,
    marginLeft: 14,
  },
  rowLabel: {
    fontSize: 14,
  },
  rowSubtitle: {
    fontSize: 11,
    marginTop: 2,
  },
  radio: {
    width: 22,
    height: 22,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default AppearancePicker;
