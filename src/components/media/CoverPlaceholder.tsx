import { commonStyles } from '@/styles/common';
import { useState } from 'react';
import type { StyleProp, ViewStyle } from 'react-native';
import { StyleSheet, View } from 'react-native';
import { ActivityIndicator, Icon, IconButton, useTheme } from 'react-native-paper';
import CoverSourceMenu from './CoverSourceMenu';

interface CoverPlaceholderProps {
  loading?: boolean;
  previewStyle?: StyleProp<ViewStyle>;
  onTakePhoto: () => void;
  onPickFromLibrary: () => void;
}

const CoverPlaceholder = ({
  loading,
  previewStyle,
  onTakePhoto,
  onPickFromLibrary,
}: CoverPlaceholderProps) => {
  const theme = useTheme();
  const [menuVisible, setMenuVisible] = useState(false);

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
      <View style={styles.overlayActions}>
        <CoverSourceMenu
          anchor={
            <IconButton
              icon="plus"
              accessibilityLabel="Add cover"
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
      </View>
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
