import { SortKey } from '@/features/media/types';
import { useUI } from '@/stores/ui.store';
import { useState } from 'react';
import { Pressable, StyleSheet } from 'react-native';
import { Divider, Menu, Text, useTheme } from 'react-native-paper';

const sortOptions: { key: SortKey; label: string }[] = [
  { key: 'updatedAt', label: 'Last Updated' },
  { key: 'title', label: 'Title' },
  { key: 'rating', label: 'Rating' },
];

type Props = { disabled?: boolean };

const SortMenu = ({ disabled = false }: Props) => {
  const { filters, setFilters } = useUI();
  const theme = useTheme();
  const [menuVisible, setMenuVisible] = useState(false);

  const effectiveKey: SortKey = disabled ? 'title' : filters.sort.key;
  const effectiveOrder = disabled ? 'asc' : filters.sort.order;

  const toggleOrder = () => {
    setFilters({
      sort: {
        ...filters.sort,
        order: filters.sort.order === 'asc' ? 'desc' : 'asc',
      },
    });
  };

  const currentLabel = sortOptions.find((o) => o.key === effectiveKey)?.label;

  return (
    <Menu
      visible={menuVisible}
      onDismiss={() => setMenuVisible(false)}
      contentStyle={styles.menuContent}
      anchor={
        <Pressable
          onPress={() => !disabled && setMenuVisible(true)}
          disabled={disabled}
          hitSlop={8}
        >
          <Text
            style={[
              styles.trigger,
              {
                color: disabled ? theme.colors.onSurfaceDisabled : theme.colors.onSurfaceVariant,
              },
            ]}
          >
            {currentLabel} {effectiveOrder === 'asc' ? '\u2191' : '\u2193'}
          </Text>
        </Pressable>
      }
    >
      {sortOptions.map((opt) => (
        <Menu.Item
          key={opt.key}
          title={opt.label}
          titleStyle={styles.menuItemText}
          onPress={() => {
            setFilters({ sort: { key: opt.key, order: filters.sort.order } });
            setMenuVisible(false);
          }}
          leadingIcon={filters.sort.key === opt.key ? 'check' : undefined}
        />
      ))}
      <Divider />
      <Menu.Item
        title={`${filters.sort.order === 'asc' ? 'Ascending' : 'Descending'}`}
        titleStyle={styles.menuItemText}
        onPress={toggleOrder}
        leadingIcon={filters.sort.order === 'asc' ? 'arrow-up' : 'arrow-down'}
      />
    </Menu>
  );
};

const styles = StyleSheet.create({
  trigger: { fontFamily: 'Inter-Medium', fontSize: 13 },
  menuContent: { marginTop: 4 },
  menuItemText: { fontFamily: 'Inter-Regular', fontSize: 14 },
});

export default SortMenu;
