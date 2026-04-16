import { useStorageDownloadUrl } from '@/shared/hooks/useStorageDownloadUrl';
import { commonStyles } from '@/shared/styles/common';
import { useState } from 'react';
import type { StyleProp, ViewStyle } from 'react-native';
import { Image, StyleSheet, View } from 'react-native';
import { ActivityIndicator, Icon, IconButton, Text, useTheme } from 'react-native-paper';
import CoverSourceMenu from './CoverSourceMenu';

interface CoverProps {
  path?: string | null;
  loading?: boolean;
  previewStyle?: StyleProp<ViewStyle>;
  showButtons?: boolean;
  onTakePhoto?: () => void;
  onPickFromLibrary?: () => void;
  onDeletePress?: () => void;
}

const Cover = ({
  path,
  loading,
  previewStyle,
  showButtons,
  onTakePhoto,
  onPickFromLibrary,
  onDeletePress,
}: CoverProps) => {
  const isDirectUri = typeof path === 'string' && /:\/\//.test(path);
  const {
    url,
    loading: fetchingUrl,
    error,
  } = useStorageDownloadUrl(isDirectUri ? undefined : path);
  const theme = useTheme();
  const [menuVisible, setMenuVisible] = useState(false);

  if (!path) return null;

  const borderStyle = { borderColor: theme.colors.outlineVariant };

  if (loading || (!isDirectUri && fetchingUrl)) {
    return (
      <View
        style={[commonStyles.preview, styles.placeholder, styles.relative, previewStyle, borderStyle]}
      >
        <ActivityIndicator />
      </View>
    );
  }

  if (!isDirectUri && error) {
    return (
      <View
        style={[commonStyles.preview, styles.placeholder, styles.relative, previewStyle, borderStyle]}
      >
        <View style={styles.errorRow}>
          <Icon source="alert-circle-outline" size={20} color={theme.colors.error} />
          <Text>Failed to load image</Text>
        </View>
      </View>
    );
  }

  if (!isDirectUri && !url) return null;

  return (
    <View style={[commonStyles.preview, styles.relative, previewStyle, borderStyle]}>
      <Image
        source={{ uri: isDirectUri ? (path as string) : (url as string) }}
        style={styles.image}
        resizeMode="cover"
      />
      {showButtons ? (
        <View style={styles.overlayActions}>
          {onTakePhoto && onPickFromLibrary ? (
            <CoverSourceMenu
              anchor={
                <IconButton
                  icon="pencil"
                  accessibilityLabel="Change cover"
                  onPress={() => setMenuVisible(true)}
                  iconColor={theme.colors.onPrimary}
                  containerColor={theme.colors.primary}
                  size={24}
                />
              }
              visible={menuVisible}
              onDismiss={() => setMenuVisible(false)}
              onTakePhoto={onTakePhoto}
              onPickFromLibrary={onPickFromLibrary}
            />
          ) : null}
          {onDeletePress ? (
            <IconButton
              icon="delete"
              accessibilityLabel="Delete cover"
              onPress={onDeletePress}
              iconColor={theme.colors.onPrimary}
              containerColor={theme.colors.primary}
              size={24}
            />
          ) : null}
        </View>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  image: { width: '100%', height: '100%' },
  placeholder: { alignItems: 'center', justifyContent: 'center' },
  relative: { position: 'relative' },
  errorRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  overlayActions: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
  },
});

export default Cover;
