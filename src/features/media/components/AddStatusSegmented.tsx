import { statusOptions } from '@/features/media/constants';
import type { Status } from '@/features/media/types';
import StatusDot from '@/shared/components/design/StatusDot';
import { useAppTheme } from '@/shared/theme';
import { Pressable, StyleSheet, Text, View } from 'react-native';

interface Props {
  value: Status;
  onChange: (s: Status) => void;
}

const AddStatusSegmented = ({ value, onChange }: Props) => {
  const t = useAppTheme();
  return (
    <View
      style={[
        styles.bar,
        {
          backgroundColor: t.tokens.semantic.surface1,
          borderColor: t.tokens.semantic.hairline,
        },
      ]}
    >
      {statusOptions.map((opt) => {
        const active = value === opt.value;
        return (
          <Pressable
            key={opt.value}
            onPress={() => onChange(opt.value)}
            style={[
              styles.option,
              active
                ? {
                    backgroundColor: t.tokens.semantic.accent,
                    shadowColor: t.tokens.semantic.accent,
                    shadowOpacity: 0.3,
                    shadowRadius: 10,
                    shadowOffset: { width: 0, height: 4 },
                  }
                : null,
            ]}
          >
            {active ? (
              <View
                style={[styles.activeDot, { backgroundColor: t.tokens.semantic.accentInk }]}
              />
            ) : (
              <StatusDot status={opt.value} size={6} style={styles.statusDot} />
            )}
            <Text
              style={[
                styles.label,
                {
                  fontFamily: t.tokens.fonts.sansSemiBold,
                  color: active ? t.tokens.semantic.accentInk : t.tokens.semantic.inkMute,
                },
              ]}
            >
              {opt.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  bar: {
    flexDirection: 'row',
    padding: 4,
    borderRadius: 9999,
    borderWidth: StyleSheet.hairlineWidth,
    gap: 4,
  },
  option: {
    flex: 1,
    height: 36,
    borderRadius: 9999,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    opacity: 0.85,
    marginRight: 6,
  },
  statusDot: {
    marginRight: 6,
  },
  label: {
    fontSize: 11,
  },
});

export default AddStatusSegmented;
