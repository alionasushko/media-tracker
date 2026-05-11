import { mediaTypeOptions } from '@/features/media/constants';
import type { MediaType } from '@/features/media/types';
import TypeIcon from '@/shared/components/design/TypeIcon';
import { useAppTheme } from '@/shared/theme';
import { Pressable, StyleSheet, Text, View } from 'react-native';

interface Props {
  value: MediaType;
  onChange: (v: MediaType) => void;
}

const AddTypeGrid = ({ value, onChange }: Props) => {
  const t = useAppTheme();
  return (
    <View style={styles.grid}>
      {mediaTypeOptions.map((opt) => {
        const active = value === opt.value;
        return (
          <Pressable
            key={opt.value}
            onPress={() => onChange(opt.value)}
            style={[
              styles.card,
              {
                backgroundColor: active ? t.tokens.semantic.surface1 : 'transparent',
                borderColor: active ? t.tokens.semantic.accent : t.tokens.semantic.hairline,
                shadowColor: t.tokens.semantic.accent,
                shadowOpacity: active ? 0.25 : 0,
                shadowRadius: 10,
                shadowOffset: { width: 0, height: 0 },
              },
            ]}
          >
            <TypeIcon
              type={opt.value}
              size={22}
              color={active ? t.tokens.semantic.ink : t.tokens.semantic.inkMute}
            />
            <Text
              style={[
                styles.label,
                {
                  fontFamily: t.tokens.fonts.sansSemiBold,
                  color: active ? t.tokens.semantic.ink : t.tokens.semantic.inkMute,
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
  grid: {
    flexDirection: 'row',
    gap: 8,
  },
  card: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 14,
    borderWidth: StyleSheet.hairlineWidth,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    fontSize: 11,
    marginTop: 6,
  },
});

export default AddTypeGrid;
