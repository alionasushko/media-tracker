import FilterMenu from '@/features/media/components/FilterMenu';
import MediaCard from '@/features/media/components/MediaCard';
import SortMenu from '@/features/media/components/SortMenu';
import { commonStyles } from '@/shared/styles/common';
import { StatusFilter, TypeFilter } from '@/features/media/types';
import { statusFilters, typeFilters } from '@/features/media/constants';
import { getErrorMessage } from '@/shared/utils/toast';
import { useCurrentUserId } from '@/features/auth/hooks/useCurrentUserId';
import { useUserMedia } from '@/features/media/queries';
import { useUI } from '@/stores/ui.store';
import { router } from 'expo-router';
import { useMemo, useState } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { ActivityIndicator, Appbar, FAB, Searchbar, Text, useTheme } from 'react-native-paper';
import { useDebouncedCallback } from 'use-debounce';

const Library = () => {
  const uid = useCurrentUserId();
  const { filters, setFilters } = useUI();
  const theme = useTheme();

  const [searchText, setSearchText] = useState(filters.q);
  const [statusMenuVisible, setStatusMenuVisible] = useState(false);
  const [typeMenuVisible, setTypeMenuVisible] = useState(false);

  const {
    data,
    isLoading,
    isError,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useUserMedia(uid ?? '', filters);

  const items = useMemo(() => data?.pages.flatMap((p) => p.media) ?? [], [data]);

  const [hasScrolled, setHasScrolled] = useState(false);

  const handleOpenSettings = () => router.push('/(app)/settings');
  const handleAddItem = () => router.push('/(app)/item/add');
  const handleOpenItem = (id: string) =>
    router.push({ pathname: '/(app)/item/[id]', params: { id } });

  const handleChangeSearch = useDebouncedCallback((q: string) => {
    setFilters({ q });
  }, 400);

  const handleChangeSearchText = (text: string) => {
    setSearchText(text);
    handleChangeSearch(text);
  };

  const handleSelectStatusFilter = (value: StatusFilter) => {
    setFilters({ status: value });
    setStatusMenuVisible(false);
  };

  const handleSelectTypeFilter = (value: TypeFilter) => {
    setFilters({ type: value });
    setTypeMenuVisible(false);
  };

  return (
    <View style={[commonStyles.container, { backgroundColor: theme.colors.background }]}>
      <Appbar.Header>
        <Appbar.Content title="My Library" />
        <Appbar.Action icon="cog" onPress={handleOpenSettings} />
      </Appbar.Header>
      <View style={styles.sectionContainer}>
        <Searchbar
          placeholder="Search your media"
          value={searchText}
          onChangeText={handleChangeSearchText}
        />
        <View style={styles.filterToolbarContainer}>
          <View style={styles.filterContainer}>
            <FilterMenu<StatusFilter>
              label="Status: "
              value={filters.status}
              visible={statusMenuVisible}
              options={statusFilters}
              onChangeVisibility={(visible) => setStatusMenuVisible(visible)}
              onSelect={handleSelectStatusFilter}
            />
            <FilterMenu<TypeFilter>
              label="Type: "
              value={filters.type}
              visible={typeMenuVisible}
              options={typeFilters}
              onChangeVisibility={(visible) => setTypeMenuVisible(visible)}
              onSelect={handleSelectTypeFilter}
            />
          </View>
          <SortMenu disabled={!!filters.q} />
        </View>
      </View>
      {isLoading ? (
        <ActivityIndicator style={styles.activityIndicator} />
      ) : isError ? (
        <Text variant="bodyLarge" style={styles.errorMessage}>
          {getErrorMessage(error)}
        </Text>
      ) : (
        <FlatList
          data={items}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
          renderItem={({ item }) => (
            <MediaCard item={item} onPress={() => handleOpenItem(item.id)} />
          )}
          onScrollBeginDrag={() => setHasScrolled(true)}
          onEndReached={() => {
            if (hasScrolled && hasNextPage && !isFetchingNextPage) fetchNextPage();
          }}
          onEndReachedThreshold={0.5}
          ListFooterComponent={
            isFetchingNextPage ? <ActivityIndicator style={styles.footerIndicator} /> : null
          }
          ListEmptyComponent={
            <Text variant="bodyLarge" style={styles.listEmptyMessage}>
              No media found
            </Text>
          }
        />
      )}
      <FAB
        icon="plus"
        style={styles.btnAdd}
        onPress={handleAddItem}
        accessibilityLabel="Add new media item"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  sectionContainer: { padding: 12, gap: 12 },
  listContainer: { padding: 12, paddingBottom: 32, gap: 12 },
  filterToolbarContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    gap: 12,
  },
  filterContainer: { display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 8 },
  activityIndicator: { marginTop: 24 },
  footerIndicator: { marginVertical: 16 },
  btnAdd: { position: 'absolute', right: 24, bottom: 24 },
  listEmptyMessage: { textAlign: 'center' },
  errorMessage: { marginInline: 16 },
});

export default Library;
