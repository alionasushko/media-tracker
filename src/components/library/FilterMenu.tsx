import { StyleSheet, View } from 'react-native';
import { Chip, Menu, Text, useTheme } from 'react-native-paper';

interface Props<T extends string> {
  label: string;
  value: T;
  visible: boolean;
  options: readonly { value: T; label: string }[];
  onChangeVisibility: (visible: boolean) => void;
  onSelect: (value: T) => void;
}

const FilterMenu = <T extends string>({
  label,
  value,
  visible,
  options,
  onChangeVisibility,
  onSelect,
}: Props<T>) => {
  const theme = useTheme();

  return (
    <Menu
      visible={visible}
      onDismiss={() => onChangeVisibility(false)}
      anchor={
        <View>
          <Text variant="labelSmall" style={styles.chipLabel}>
            {label}
          </Text>
          <Chip mode="outlined" onPress={() => onChangeVisibility(true)}>
            {value}
          </Chip>
        </View>
      }
    >
      {options.map((t) => {
        const selected = value === t.value;
        return (
          <Menu.Item
            key={t.value}
            onPress={() => onSelect(t.value)}
            title={t.label}
            leadingIcon={selected ? 'check' : undefined}
            style={{
              backgroundColor: selected ? theme.colors.secondaryContainer : undefined,
            }}
          />
        );
      })}
    </Menu>
  );
};

const styles = StyleSheet.create({
  chipLabel: { marginBottom: 4, opacity: 0.7 },
});

export default FilterMenu;
