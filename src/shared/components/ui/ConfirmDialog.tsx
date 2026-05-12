import { useAppTheme } from '@/shared/theme';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';

interface Props {
  visible: boolean;
  title: string;
  message: string;
  confirmLabel: string;
  cancelLabel?: string;
  destructive?: boolean;
  onDismiss: () => void;
  onConfirm: () => void;
}

const ConfirmDialog = ({
  visible,
  title,
  message,
  confirmLabel,
  cancelLabel = 'Cancel',
  destructive,
  onDismiss,
  onConfirm,
}: Props) => {
  const t = useAppTheme();
  const confirmColor = destructive ? t.tokens.semantic.statusDropped : t.tokens.semantic.accent;
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onDismiss}>
      <Pressable style={styles.backdrop} onPress={onDismiss}>
        <View
          style={[
            styles.dialog,
            {
              backgroundColor: t.tokens.semantic.surface1,
              borderColor: t.tokens.semantic.hairlineStrong,
            },
          ]}
          onStartShouldSetResponder={() => true}
        >
          <Text
            style={[
              styles.title,
              { fontFamily: t.tokens.fonts.sansSemiBold, color: t.tokens.semantic.ink },
            ]}
          >
            {title}
          </Text>
          <Text
            style={[
              styles.message,
              { fontFamily: t.tokens.fonts.sansRegular, color: t.tokens.semantic.inkMute },
            ]}
          >
            {message}
          </Text>
          <View style={styles.actions}>
            <Pressable onPress={onDismiss} style={styles.btn}>
              <Text
                style={[
                  styles.btnLabel,
                  { fontFamily: t.tokens.fonts.sansSemiBold, color: t.tokens.semantic.inkMute },
                ]}
              >
                {cancelLabel}
              </Text>
            </Pressable>
            <Pressable onPress={onConfirm} style={styles.btn}>
              <Text
                style={[
                  styles.btnLabel,
                  { fontFamily: t.tokens.fonts.sansSemiBold, color: confirmColor },
                ]}
              >
                {confirmLabel}
              </Text>
            </Pressable>
          </View>
        </View>
      </Pressable>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  dialog: {
    width: '100%',
    maxWidth: 360,
    borderRadius: 18,
    padding: 22,
    borderWidth: StyleSheet.hairlineWidth,
  },
  title: {
    fontSize: 18,
    marginBottom: 8,
  },
  message: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 18,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 4,
  },
  btn: {
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  btnLabel: {
    fontSize: 14,
    letterSpacing: 0.2,
  },
});

export default ConfirmDialog;
