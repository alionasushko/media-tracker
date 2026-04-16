import { Menu } from 'react-native-paper';
import type { ReactElement } from 'react';

interface CoverSourceMenuProps {
  anchor: ReactElement;
  visible: boolean;
  onDismiss: () => void;
  onTakePhoto: () => void;
  onPickFromLibrary: () => void;
}

const CoverSourceMenu = ({
  anchor,
  visible,
  onDismiss,
  onTakePhoto,
  onPickFromLibrary,
}: CoverSourceMenuProps) => {
  return (
    <Menu visible={visible} onDismiss={onDismiss} anchor={anchor} anchorPosition="bottom">
      <Menu.Item
        onPress={() => {
          onDismiss();
          onTakePhoto();
        }}
        title="Take photo"
        leadingIcon="camera"
      />
      <Menu.Item
        onPress={() => {
          onDismiss();
          onPickFromLibrary();
        }}
        title="Choose from library"
        leadingIcon="image"
      />
    </Menu>
  );
};

export default CoverSourceMenu;
