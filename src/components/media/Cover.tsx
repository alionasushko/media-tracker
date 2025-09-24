import { useStorageDownloadUrl } from '@/hooks/useStorageDownloadUrl';
import { commonStyles } from '@/styles/common';
import React from 'react';
import type { StyleProp, ViewStyle } from 'react-native';
import { Image, StyleSheet, View } from 'react-native';
import { ActivityIndicator, Icon, IconButton, Text, useTheme } from 'react-native-paper';

interface CoverProps {
  path?: string | null;
  showButtons?: boolean;
  onEditPress?: () => void;
  onDeletePress?: () => void;
  previewStyle?: StyleProp<ViewStyle>;
}

const Cover: React.FC<CoverProps> = ({
  path,
  showButtons,
  onEditPress,
  onDeletePress,
  previewStyle,
}) => {
  const isDirectUri = typeof path === 'string' && /:\/\//.test(path);
  const { url, loading, error } = useStorageDownloadUrl(isDirectUri ? undefined : path);
  const theme = useTheme();

  if (!path) return null;

  if (!isDirectUri && loading) {
    return (
      <View
        style={[
          commonStyles.preview,
          styles.placeholder,
          previewStyle,
          { borderColor: theme.colors.outlineVariant, position: 'relative' },
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
          previewStyle,
          { borderColor: theme.colors.outlineVariant, position: 'relative' },
        ]}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <Icon source="alert-circle-outline" size={20} color={theme.colors.error} />
          <Text>Failed to load image</Text>
        </View>
      </View>
    );
  }

  if (!isDirectUri && !url) return null;

  return (
    <View
      style={[
        commonStyles.preview,
        previewStyle,
        { borderColor: theme.colors.outlineVariant, position: 'relative' },
      ]}
    >
      <Image
        source={{ uri: isDirectUri ? (path as string) : (url as string) }}
        style={styles.image}
        resizeMode="cover"
      />
      {showButtons ? (
        <View style={styles.overlayActions}>
          {onEditPress ? (
            <IconButton
              icon="pencil"
              accessibilityLabel="Change cover"
              onPress={onEditPress}
              iconColor={theme.colors.onPrimary}
              containerColor={theme.colors.primary}
              size={24}
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
