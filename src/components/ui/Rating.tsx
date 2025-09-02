import { Pressable, StyleSheet, View } from 'react-native';
import { Icon } from 'react-native-paper';

const Rating = ({
  value = 0,
  onChange,
  max = 5,
  size = 22,
}: {
  value?: number;
  onChange?: (v: number) => void;
  max?: number;
  size?: number;
}) => {
  const v = Math.max(0, Math.min(value || 0, max));
  return (
    <View style={styles.container}>
      {Array.from({ length: max }).map((_, i) => {
        const filled = i < v;
        return (
          <Pressable key={i} onPress={() => onChange?.(i + 1)} hitSlop={8}>
            <Icon source={filled ? 'star' : 'star-outline'} size={size} />
          </Pressable>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flexDirection: 'row', alignItems: 'center' },
});

export default Rating;
