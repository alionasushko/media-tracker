import { SortKey } from '@/types/media';
import { useUI } from '@stores/ui.store';
import { useState } from 'react';
import { Button, Divider, Menu } from 'react-native-paper';

const sortOptions: { key: SortKey; label: string }[] = [
  { key: 'updatedAt', label: 'Last Updated' },
  { key: 'title', label: 'Title' },
  { key: 'rating', label: 'Rating' },
];

const SortMenu = () => {
  const { filters, setFilters } = useUI();
  const [menuVisible, setMenuVisible] = useState(false);

  const toggleOrder = () => {
    setFilters({
      sort: {
        ...filters.sort,
        order: filters.sort.order === 'asc' ? 'desc' : 'asc',
      },
    });
  };

  return (
    <Menu
      visible={menuVisible}
      onDismiss={() => setMenuVisible(false)}
      anchor={
        <Button
          mode="text"
          icon={filters.sort.order === 'asc' ? 'arrow-up' : 'arrow-down'}
          onPress={() => setMenuVisible(true)}
        >
          {sortOptions.find((o) => o.key === filters.sort.key)?.label}
        </Button>
      }
    >
      {sortOptions.map((opt) => (
        <Menu.Item
          key={opt.key}
          title={opt.label}
          onPress={() => {
            setFilters({ sort: { key: opt.key, order: filters.sort.order } });
            setMenuVisible(false);
          }}
          leadingIcon={filters.sort.key === opt.key ? 'check' : undefined}
        />
      ))}
      <Divider />
      <Menu.Item
        title={`Order: ${filters.sort.order === 'asc' ? 'Ascending' : 'Descending'}`}
        onPress={toggleOrder}
        leadingIcon={filters.sort.order === 'asc' ? 'arrow-up' : 'arrow-down'}
      />
    </Menu>
  );
};

export default SortMenu;
