import Stars from '@/shared/components/design/Stars';
import { Eyebrow } from '@/shared/components/design/text';
import { useAppTheme } from '@/shared/theme';
import { Pressable, StyleSheet, Text, View } from 'react-native';

interface Props {
  rating: number;
  onChange: (v: number) => void;
  onClear: () => void;
}

const DetailRating = ({ rating, onChange, onClear }: Props) => {
  const t = useAppTheme();
  return (
    <View style={styles.container}>
      <Eyebrow>Your rating</Eyebrow>
      <View style={styles.row}>
        <Stars value={rating} onChange={onChange} />
        {rating > 0 ? (
          <Pressable onPress={onClear} style={styles.clearBtn}>
            <Text
              style={[
                styles.clearText,
                { fontFamily: t.tokens.fonts.sansMedium, color: t.tokens.semantic.inkFaint },
              ]}
            >
              Clear
            </Text>
          </Pressable>
        ) : null}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingTop: 28,
    gap: 8,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  clearBtn: {
    marginLeft: 12,
  },
  clearText: {
    fontSize: 12,
  },
});

export default DetailRating;
