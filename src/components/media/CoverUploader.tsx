import { commonStyles } from '@/styles/common';
import { pickImageFromLibrary } from '@services/storage';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';
import Cover from './Cover';
import CoverPlaceholder from './CoverPlaceholder';

interface CoverUploaderProps {
  value: string | null;
  onChange: (uri: string | null) => void;
  label?: string;
  disabled?: boolean;
}

const CoverUploader: React.FC<CoverUploaderProps> = ({
  value,
  onChange,
  label = 'Cover',
  disabled,
}) => {
  const handlePick = async () => {
    const uri = await pickImageFromLibrary();
    if (uri) onChange(uri);
  };

  const handleRemove = () => {
    onChange(null);
  };

  return (
    <View style={styles.container}>
      <Text variant="titleMedium">{label}</Text>
      {value ? (
        <Cover
          path={value}
          previewStyle={commonStyles.preview}
          showButtons
          onEditPress={handlePick}
          onDeletePress={handleRemove}
        />
      ) : (
        <CoverPlaceholder
          onAddPress={disabled ? undefined : handlePick}
          previewStyle={commonStyles.preview}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { gap: 8 },
});

export default CoverUploader;
