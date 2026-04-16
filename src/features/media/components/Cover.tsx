import { useStorageDownloadUrl } from '@/shared/hooks/useStorageDownloadUrl';
import { commonStyles } from '@/shared/styles/common';
import { useState } from 'react';
import type { StyleProp, ViewStyle } from 'react-native';
import { Image, StyleSheet, View } from 'react-native';
import { ActivityIndicator, Icon, IconButton, Text, useTheme } from 'react-native-paper';
import Animated, { FadeIn } from 'react-native-reanimated';
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

  if (loading || (!isDirectUri && fetchingUrl)) {
    return (
      <View
        style={[
          commonStyles.preview,
          styles.placeholder,
          { backgroundColor: theme.colors.surfaceVariant },
          previewStyle,
        ]}
      >
        <ActivityIndicator />
      </View>
    );
  }

  if (!isDirectUri && error) {
    return (
      <View
        style={[
          commonStyles.preview,
          styles.placeholder,
          { backgroundColor: theme.colors.surfaceVariant },
          previewStyle,
        ]}
      >
        <View style={styles.errorRow}>
          <Icon source="alert-circle-outline" size={18} color={theme.colors.error} />
          <Text style={[styles.errorText, { color: theme.colors.onSurfaceVariant }]}>
            Failed to load image
          </Text>
        </View>
      </View>
    );
  }

  if (!isDirectUri && !url) return null;

  return (
    <Animated.View
      entering={FadeIn.duration(300)}
      style={[commonStyles.preview, previewStyle]}
    >
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
                  iconColor="#FFFFFF"
                  containerColor="rgba(0, 0, 0, 0.5)"
                  size={18}
                  style={styles.overlayBtn}
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
              icon="delete-outline"
              accessibilityLabel="Delete cover"
              onPress={onDeletePress}
              iconColor="#FFFFFF"
              containerColor="rgba(0, 0, 0, 0.5)"
              size={18}
              style={styles.overlayBtn}
            />
          ) : null}
        </View>
      ) : null}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  image: { width: '100%', height: '100%' },
  placeholder: { alignItems: 'center', justifyContent: 'center' },
  errorRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  errorText: { fontFamily: 'Inter-Regular', fontSize: 13 },
  overlayActions: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    flexDirection: 'row',
    gap: 4,
    alignItems: 'center',
  },
  overlayBtn: { borderRadius: 10 },
});

export default Cover;
