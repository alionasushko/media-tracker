import { commonStyles } from '@/styles/common';
import React from 'react';
import type { StyleProp, ViewStyle } from 'react-native';
import { StyleSheet, View } from 'react-native';
import { ActivityIndicator, Icon, IconButton, useTheme } from 'react-native-paper';

interface CoverPlaceholderProps {
  loading?: boolean;
  onAddPress?: () => void;
  previewStyle?: StyleProp<ViewStyle>;
}

const CoverPlaceholder: React.FC<CoverPlaceholderProps> = ({
  loading,
  onAddPress,
  previewStyle,
}) => {
  const theme = useTheme();
  return (
    <View
      style={[
        commonStyles.preview,
        { borderColor: theme.colors.outlineVariant, position: 'relative' },
        previewStyle,
      ]}
    >
      <View style={styles.centerContent}>
        {loading ? (
          <ActivityIndicator />
        ) : (
          <Icon source="image-outline" size={48} color={theme.colors.outline} />
        )}
      </View>
      {!loading && onAddPress ? (
        <View style={styles.overlayActions}>
          <IconButton
            icon="plus"
            accessibilityLabel="Add cover"
            onPress={onAddPress}
            iconColor={theme.colors.onPrimary}
            containerColor={theme.colors.primary}
            size={24}
          />
        </View>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  centerContent: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  overlayActions: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
  },
});

export default CoverPlaceholder;
