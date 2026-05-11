import SheetItem from '@/shared/components/design/SheetItem';
import { useAppTheme } from '@/shared/theme';
import { useState } from 'react';
import { Modal, Platform, StyleSheet, TouchableWithoutFeedback, View } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface Props {
  visible: boolean;
  hasCover: boolean;
  onClose: () => void;
  onReplaceCover: () => void;
  onTakePhoto: () => void;
  onRemoveCover: () => void;
  onDelete: () => void;
}

const DetailMoreSheet = ({
  visible,
  hasCover,
  onClose,
  onReplaceCover,
  onTakePhoto,
  onRemoveCover,
  onDelete,
}: Props) => {
  const t = useAppTheme();
  const insets = useSafeAreaInsets();

  const [queued, setQueued] = useState<(() => void) | null>(null);

  const queueAndClose = (action: () => void) => () => {
    if (Platform.OS === 'ios') {
      setQueued(() => action);
      onClose();
    } else {
      onClose();
      action();
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
      onDismiss={() => {
        if (queued) {
          const fn = queued;
          setQueued(null);
          fn();
        }
      }}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.backdrop}>
          <TouchableWithoutFeedback>
            <Animated.View
              entering={FadeIn.duration(180)}
              style={[
                styles.sheet,
                {
                  backgroundColor: t.tokens.semantic.surface2,
                  borderColor: t.tokens.semantic.hairlineStrong,
                  paddingBottom: insets.bottom + 12,
                },
              ]}
            >
              <View
                style={[styles.handle, { backgroundColor: t.tokens.semantic.hairlineStrong }]}
              />
              <SheetItem
                icon="image-edit-outline"
                label="Replace cover"
                onPress={queueAndClose(onReplaceCover)}
              />
              <SheetItem
                icon="camera-outline"
                label="Take photo"
                onPress={queueAndClose(onTakePhoto)}
              />
              {hasCover ? (
                <SheetItem
                  icon="image-off-outline"
                  label="Remove cover"
                  onPress={queueAndClose(onRemoveCover)}
                />
              ) : null}
              <SheetItem
                icon="trash-can-outline"
                label="Delete item"
                destructive
                onPress={queueAndClose(onDelete)}
              />
            </Animated.View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  sheet: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderLeftWidth: StyleSheet.hairlineWidth,
    borderRightWidth: StyleSheet.hairlineWidth,
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 12,
  },
});

export default DetailMoreSheet;
