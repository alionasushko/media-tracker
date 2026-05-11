import { useCurrentUserId } from '@/features/auth/hooks/useCurrentUserId';
import EmptyLibrary from '@/features/media/components/EmptyLibrary';
import EmptyResults from '@/features/media/components/EmptyResults';
import LibraryHeader from '@/features/media/components/LibraryHeader';
import LibraryTile from '@/features/media/components/LibraryTile';
import { useUserMedia } from '@/features/media/queries';
import type { StatusFilter, TypeFilter, UserMedia } from '@/features/media/types';
import AnimatedScreen from '@/shared/components/ui/AnimatedScreen';
import { commonStyles } from '@/shared/styles/common';
import { useAppTheme } from '@/shared/theme';
import { getErrorMessage } from '@/shared/utils/toast';
import { useUI } from '@/stores/ui.store';
import { router } from 'expo-router';
import { useCallback, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  RefreshControl,
  StyleSheet,
  View,
} from 'react-native';
import { Text } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const screenWidth = Dimensions.get('window').width;
const GRID_PADDING = 24;
const GRID_GAP = 14;
const COL_COUNT = 3;
const TILE_WIDTH = Math.floor(
  (screenWidth - GRID_PADDING * 2 - GRID_GAP * (COL_COUNT - 1)) / COL_COUNT,
);

const Library = () => {
  const uid = useCurrentUserId();
  const { filters, setFilters } = useUI();
  const t = useAppTheme();
  const insets = useSafeAreaInsets();

  const [refreshing, setRefreshing] = useState(false);

  const {
    data,
    isLoading,
    isError,
    error,
    refetch,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useUserMedia(uid ?? '', filters);

  const items = useMemo(() => data?.pages.flatMap((p) => p.media) ?? [], [data]);

  const handleAddItem = () => router.push('/(app)/item/add');
  const handleOpenItem = (id: string) =>
    router.push({ pathname: '/(app)/item/[id]', params: { id } });

  const handleSelectStatus = useCallback(
    (value: StatusFilter) => setFilters({ status: value }),
    [setFilters],
  );
  const handleSelectType = useCallback(
    (value: TypeFilter) => setFilters({ type: value }),
    [setFilters],
  );
  const handleSearchChange = useCallback((q: string) => setFilters({ q }), [setFilters]);
  const handleClearFilters = useCallback(
    () => setFilters({ q: '', status: 'all', type: 'all' }),
    [setFilters],
  );

  const isFiltering = filters.q.length > 0 || filters.status !== 'all' || filters.type !== 'all';

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  }, [refetch]);

  const renderItem = useCallback(
    ({ item, index }: { item: UserMedia; index: number }) => (
      <LibraryTile
        item={item}
        tileWidth={TILE_WIDTH}
        index={index}
        onPress={() => handleOpenItem(item.id)}
      />
    ),
    [],
  );

  const header = (
    <LibraryHeader
      totalCount={items.length}
      status={filters.status}
      type={filters.type}
      onStatusChange={handleSelectStatus}
      onTypeChange={handleSelectType}
      onSearchChange={handleSearchChange}
    />
  );

  const empty = isLoading ? (
    <ActivityIndicator style={styles.loading} color={t.tokens.semantic.accent} />
  ) : isError ? (
    <View style={styles.loading}>
      <Text style={{ color: t.tokens.semantic.statusDropped }}>{getErrorMessage(error)}</Text>
    </View>
  ) : isFiltering ? (
    <EmptyResults query={filters.q} onClear={handleClearFilters} />
  ) : (
    <EmptyLibrary onAdd={handleAddItem} />
  );

  return (
    <AnimatedScreen>
      <View
        style={[
          commonStyles.container,
          { backgroundColor: t.tokens.semantic.bg, paddingTop: insets.top },
        ]}
      >
        <FlatList
          data={items}
          keyExtractor={(item) => item.id}
          numColumns={COL_COUNT}
          columnWrapperStyle={{ gap: GRID_GAP, paddingHorizontal: GRID_PADDING }}
          contentContainerStyle={[styles.list, { paddingBottom: insets.bottom + 100 }]}
          ListHeaderComponent={header}
          renderItem={renderItem}
          ItemSeparatorComponent={() => <View style={{ height: GRID_GAP }} />}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              colors={[t.tokens.semantic.accent]}
            />
          }
          onEndReached={() => {
            if (hasNextPage && !isFetchingNextPage) fetchNextPage();
          }}
          onEndReachedThreshold={0.5}
          ListFooterComponent={
            isFetchingNextPage ? (
              <ActivityIndicator style={styles.footer} color={t.tokens.semantic.accent} />
            ) : null
          }
          ListEmptyComponent={empty}
        />
      </View>
    </AnimatedScreen>
  );
};

const styles = StyleSheet.create({
  list: {
    flexGrow: 1,
  },
  loading: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  footer: { marginVertical: 20 },
});

export default Library;
