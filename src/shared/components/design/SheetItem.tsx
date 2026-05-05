import { useAppTheme } from '@/shared/theme';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text } from 'react-native';

interface Props {
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  label: string;
  onPress: () => void;
  destructive?: boolean;
}

const SheetItem = ({ icon, label, onPress, destructive }: Props) => {
  const t = useAppTheme();
  const color = destructive ? t.tokens.semantic.statusDropped : t.tokens.semantic.ink;
  return (
    <Pressable onPress={onPress} style={styles.row}>
      <MaterialCommunityIcons name={icon} size={20} color={color} />
      <Text
        style={[
          styles.label,
          { fontFamily: t.tokens.fonts.sansMedium, color },
        ]}
      >
        {label}
      </Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 8,
  },
  label: {
    fontSize: 15,
    marginLeft: 14,
  },
});

export default SheetItem;
