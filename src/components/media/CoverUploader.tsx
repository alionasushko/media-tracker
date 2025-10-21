import { commonStyles } from '@/styles/common';
import { captureImageFromCamera, pickImageFromLibrary } from '@services/storage';
import Cover from './Cover';
import CoverPlaceholder from './CoverPlaceholder';

interface CoverUploaderProps {
  value: string | null;
  loading?: boolean;
  onChange: (uri: string | null) => void;
}

const CoverUploader = ({ value, loading, onChange }: CoverUploaderProps) => {
  const handlePickFromLibrary = async () => {
    const uri = await pickImageFromLibrary();
    if (uri) onChange(uri);
  };

  const handleTakePhoto = async () => {
    const uri = await captureImageFromCamera();
    if (uri) onChange(uri);
  };

  const handleRemove = () => {
    onChange(null);
  };

  return value ? (
    <Cover
      path={value}
      loading={loading}
      previewStyle={commonStyles.preview}
      showButtons
      onTakePhoto={handleTakePhoto}
      onPickFromLibrary={handlePickFromLibrary}
      onDeletePress={handleRemove}
    />
  ) : (
    <CoverPlaceholder
      loading={loading}
      previewStyle={commonStyles.preview}
      onTakePhoto={handleTakePhoto}
      onPickFromLibrary={handlePickFromLibrary}
    />
  );
};

export default CoverUploader;
