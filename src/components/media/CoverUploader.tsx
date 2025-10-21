import { commonStyles } from '@/styles/common';
import { captureImageFromCamera, pickImageFromLibrary } from '@services/storage';
import Cover from './Cover';
import CoverPlaceholder from './CoverPlaceholder';

interface CoverUploaderProps {
  value: string | null;
  onChange: (uri: string | null) => void;
}

const CoverUploader = ({ value, onChange }: CoverUploaderProps) => {
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
      previewStyle={commonStyles.preview}
      showButtons
      onTakePhoto={handleTakePhoto}
      onPickFromLibrary={handlePickFromLibrary}
      onDeletePress={handleRemove}
    />
  ) : (
    <CoverPlaceholder
      onTakePhoto={handleTakePhoto}
      onPickFromLibrary={handlePickFromLibrary}
      previewStyle={commonStyles.preview}
    />
  );
};

export default CoverUploader;
