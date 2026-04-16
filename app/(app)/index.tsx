import { useCurrentUserId } from '@/features/auth/hooks/useCurrentUserId';
import FilterMenu from '@/features/media/components/FilterMenu';
import MediaCard from '@/features/media/components/MediaCard';
import SortMenu from '@/features/media/components/SortMenu';
import { statusFilters, typeFilters } from '@/features/media/constants';
import { useUserMedia } from '@/features/media/queries';
import { StatusFilter, TypeFilter, UserMedia } from '@/features/media/types';
import AnimatedScreen from '@/shared/components/ui/AnimatedScreen';
import { commonStyles } from '@/shared/styles/common';
import { getErrorMessage } from '@/shared/utils/toast';
import { useUI } from '@/stores/ui.store';
import { router } from 'expo-router';
import { useCallback, useMemo, useState } from 'react';
import { FlatList, Pressable, StyleSheet, View } from 'react-native';
import { ActivityIndicator, Icon, Searchbar, Text, useTheme } from 'react-native-paper';
import Animated, { FadeInDown, ZoomIn } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useDebouncedCallback } from 'use-debounce';

const Library = () => {
  const uid = useCurrentUserId();
  const { filters, setFilters } = useUI();
  const theme = useTheme();
  const insets = useSafeAreaInsets();

  const [searchText, setSearchText] = useState(filters.q);
  const [statusMenuVisible, setStatusMenuVisible] = useState(false);
  const [typeMenuVisible, setTypeMenuVisible] = useState(false);

  const { data, isLoading, isError, error, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useUserMedia(uid ?? '', filters);

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

  const renderItem = useCallback(
    ({ item, index }: { item: UserMedia; index: number }) => (
      <Animated.View
        entering={FadeInDown.duration(250)
          .delay(index * 40)
          .springify()}
      >
        <MediaCard item={item} onPress={() => handleOpenItem(item.id)} />
      </Animated.View>
    ),
    [],
  );

  return (
    <AnimatedScreen>
      <View style={[commonStyles.container, { backgroundColor: theme.colors.background }]}>
        <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
          <Text style={[styles.headerTitle, { color: theme.colors.onBackground }]}>Library</Text>
          <Pressable onPress={handleOpenSettings} hitSlop={8}>
            <Icon source="cog-outline" size={22} color={theme.colors.onSurfaceVariant} />
          </Pressable>
        </View>

        <View style={styles.toolbar}>
          <Searchbar
            placeholder="Search"
            value={searchText}
            onChangeText={handleChangeSearchText}
            style={[styles.searchbar, { backgroundColor: theme.colors.surfaceVariant }]}
            inputStyle={styles.searchInput}
            elevation={0}
            placeholderTextColor={theme.colors.onSurfaceVariant}
          />
          <View style={styles.filterRow}>
            <View style={styles.filterGroup}>
              <FilterMenu<StatusFilter>
                label="Status"
                value={filters.status}
                visible={statusMenuVisible}
                options={statusFilters}
                onChangeVisibility={setStatusMenuVisible}
                onSelect={handleSelectStatusFilter}
              />
              <FilterMenu<TypeFilter>
                label="Type"
                value={filters.type}
                visible={typeMenuVisible}
                options={typeFilters}
                onChangeVisibility={setTypeMenuVisible}
                onSelect={handleSelectTypeFilter}
              />
            </View>
            <SortMenu disabled={!!filters.q} />
          </View>
        </View>

        {isLoading ? (
          <ActivityIndicator style={styles.centered} />
        ) : isError ? (
          <View style={styles.centered}>
            <Text variant="bodyMedium" style={{ color: theme.colors.error }}>
              {getErrorMessage(error)}
            </Text>
          </View>
        ) : (
          <FlatList
            data={items}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.list}
            renderItem={renderItem}
            onScrollBeginDrag={() => setHasScrolled(true)}
            onEndReached={() => {
              if (hasScrolled && hasNextPage && !isFetchingNextPage) fetchNextPage();
            }}
            onEndReachedThreshold={0.5}
            ListFooterComponent={
              isFetchingNextPage ? <ActivityIndicator style={styles.footer} /> : null
            }
            ListEmptyComponent={
              <View style={styles.emptyState}>
                <Icon source="bookshelf" size={48} color={theme.colors.outlineVariant} />
                <Text
                  variant="bodyLarge"
                  style={[styles.emptyText, { color: theme.colors.onSurfaceVariant }]}
                >
                  No media found
                </Text>
              </View>
            }
          />
        )}

        <Animated.View
          entering={ZoomIn.duration(250).delay(150).springify()}
          style={[styles.fabContainer, { bottom: insets.bottom + 24 }]}
        >
          <Pressable
            onPress={handleAddItem}
            style={[styles.fab, { backgroundColor: theme.colors.primary }]}
            accessibilityLabel="Add new media item"
          >
            <Icon source="plus" size={24} color={theme.colors.onPrimary} />
          </Pressable>
        </Animated.View>
      </View>
    </AnimatedScreen>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 8,
  },
  headerTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 28,
    letterSpacing: -0.5,
  },
  toolbar: { paddingHorizontal: 20, gap: 12, paddingBottom: 8 },
  searchbar: {
    borderRadius: 12,
    elevation: 0,
    height: 44,
  },
  searchInput: { fontFamily: 'Inter-Regular', fontSize: 15, minHeight: 44 },
  filterRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  filterGroup: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  list: { paddingHorizontal: 20, paddingTop: 4, paddingBottom: 100, gap: 12 },
  centered: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  footer: { marginVertical: 20 },
  emptyState: { alignItems: 'center', paddingTop: 80, gap: 12 },
  emptyText: { fontFamily: 'Inter-Regular' },
  fabContainer: { position: 'absolute', right: 20 },
  fab: {
    width: 56,
    height: 56,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 6,
  },
});

export default Library;
