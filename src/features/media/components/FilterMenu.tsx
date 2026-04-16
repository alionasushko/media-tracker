import { StyleSheet } from 'react-native';
import { Chip, Menu, useTheme } from 'react-native-paper';

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
      anchorPosition="bottom"
      contentStyle={styles.menuContent}
      anchor={
        <Chip
          mode="outlined"
          onPress={() => onChangeVisibility(true)}
          textStyle={styles.chipText}
          style={styles.chip}
          compact
        >
          {value === 'all' ? label : value}
        </Chip>
      }
    >
      {options.map((t) => {
        const selected = value === t.value;
        return (
          <Menu.Item
            key={t.value}
            onPress={() => onSelect(t.value)}
            title={t.label}
            titleStyle={styles.menuItemText}
            leadingIcon={selected ? 'check' : undefined}
            style={selected ? { backgroundColor: theme.colors.surfaceVariant } : undefined}
          />
        );
      })}
    </Menu>
  );
};

const styles = StyleSheet.create({
  chip: { borderRadius: 10 },
  chipText: { fontFamily: 'Inter-Medium', fontSize: 13 },
  menuContent: { marginTop: 4 },
  menuItemText: { fontFamily: 'Inter-Regular', fontSize: 14 },
});

export default FilterMenu;
