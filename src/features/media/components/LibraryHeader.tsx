import {
  mediaTypePluralOptions,
  statusOptions as baseStatusOptions,
} from '@/features/media/constants';
import type { StatusFilter, TypeFilter } from '@/features/media/types';
import { ChipRow, type ChipOption } from '@/shared/components/design/Chip';
import { Display, Eyebrow } from '@/shared/components/design/text';
import { useAppTheme } from '@/shared/theme';
import { SEARCH_DEBOUNCE_MS } from '@/shared/utils/debounce';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useState } from 'react';
import { Pressable, StyleSheet, TextInput, View } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import { useDebouncedCallback } from 'use-debounce';

const statusOptions: ChipOption<StatusFilter>[] = [
  { value: 'all', label: 'All' },
  ...baseStatusOptions,
];

const typeOptions: ChipOption<TypeFilter>[] = [
  { value: 'all', label: 'All types' },
  ...mediaTypePluralOptions,
];

interface Props {
  totalCount: number;
  status: StatusFilter;
  type: TypeFilter;
  onStatusChange: (v: StatusFilter) => void;
  onTypeChange: (v: TypeFilter) => void;
  onSearchChange: (q: string) => void;
}

const LibraryHeader = ({
  totalCount,
  status,
  type,
  onStatusChange,
  onTypeChange,
  onSearchChange,
}: Props) => {
  const t = useAppTheme();

  const [searchOpen, setSearchOpen] = useState(false);
  const [searchText, setSearchText] = useState('');

  const debouncedSearch = useDebouncedCallback(onSearchChange, SEARCH_DEBOUNCE_MS);

  const handleChangeText = (text: string) => {
    setSearchText(text);
    debouncedSearch(text);
  };

  const handleClose = () => {
    setSearchOpen(false);
    setSearchText('');
    debouncedSearch.cancel();
    onSearchChange('');
  };

  const showSearchInput = searchOpen || searchText.length > 0;

  return (
    <View>
      <View style={styles.header}>
        <View style={styles.titleSlot}>
          {showSearchInput ? (
            <Animated.View entering={FadeIn.duration(180)} style={styles.searchInputWrap}>
              <MaterialCommunityIcons name="magnify" size={18} color={t.tokens.semantic.inkFaint} />
              <TextInput
                autoFocus
                value={searchText}
                onChangeText={handleChangeText}
                placeholder="Search your library"
                placeholderTextColor={t.tokens.semantic.inkFaint}
                style={[
                  styles.searchInput,
                  {
                    fontFamily: t.tokens.fonts.sansRegular,
                    color: t.tokens.semantic.ink,
                  },
                ]}
              />
            </Animated.View>
          ) : (
            <>
              <Eyebrow>{`Library · ${totalCount} ${totalCount === 1 ? 'title' : 'titles'}`}</Eyebrow>
              <Display size={36} style={styles.titleText}>
                Collection
              </Display>
            </>
          )}
        </View>

        <Pressable
          onPress={showSearchInput ? handleClose : () => setSearchOpen(true)}
          style={[
            styles.iconBtn,
            {
              backgroundColor: t.tokens.semantic.surface2,
              borderColor: t.tokens.semantic.hairline,
            },
          ]}
        >
          <MaterialCommunityIcons
            name={showSearchInput ? 'close' : 'magnify'}
            size={18}
            color={t.tokens.semantic.inkMute}
          />
        </Pressable>
      </View>

      <View style={styles.chipsWrap}>
        <ChipRow value={status} options={statusOptions} onChange={onStatusChange} kind="status" />
        <View style={styles.chipsGap} />
        <ChipRow value={type} options={typeOptions} onChange={onTypeChange} kind="type" />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: 24,
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingTop: 16,
    paddingBottom: 8,
  },
  titleSlot: {
    flex: 1,
  },
  titleText: {
    marginTop: 6,
  },
  iconBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: StyleSheet.hairlineWidth,
  },
  chipsWrap: {
    paddingTop: 14,
    paddingBottom: 12,
  },
  chipsGap: {
    height: 8,
  },
  searchInputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 44,
  },
  searchInput: {
    flex: 1,
    fontSize: 18,
    marginLeft: 10,
    padding: 0,
  },
});

export default LibraryHeader;
