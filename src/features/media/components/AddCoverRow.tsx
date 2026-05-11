import type { MediaType } from '@/features/media/types';
import CoverArt from '@/shared/components/design/CoverArt';
import { useAppTheme } from '@/shared/theme';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';

interface Props {
  coverUri: string | null;
  title: string;
  type: MediaType;
  onPickImage: () => void;
  onTakePhoto: () => void;
  onRemove: () => void;
}

const AddCoverRow = ({
  coverUri,
  title,
  type,
  onPickImage,
  onTakePhoto,
  onRemove,
}: Props) => {
  const t = useAppTheme();
  return (
    <View style={styles.row}>
      <View style={styles.coverShadow}>
        <CoverArt
          path={coverUri}
          title={title || 'New entry'}
          type={type}
          width={96}
          height={140}
          radius={12}
        />
      </View>
      <View style={styles.actions}>
        <Pressable
          onPress={onPickImage}
          style={[
            styles.btn,
            {
              backgroundColor: t.tokens.semantic.surface2,
              borderColor: t.tokens.semantic.hairlineStrong,
            },
          ]}
        >
          <MaterialCommunityIcons
            name="image-outline"
            size={14}
            color={t.tokens.semantic.inkMute}
          />
          <Text
            style={[
              styles.btnLabel,
              { fontFamily: t.tokens.fonts.sansSemiBold, color: t.tokens.semantic.ink },
            ]}
          >
            Choose from library
          </Text>
        </Pressable>
        <Pressable
          onPress={onTakePhoto}
          style={[styles.btnDashed, { borderColor: t.tokens.semantic.hairlineStrong }]}
        >
          <MaterialCommunityIcons
            name="camera-outline"
            size={14}
            color={t.tokens.semantic.inkMute}
          />
          <Text
            style={[
              styles.btnLabel,
              { fontFamily: t.tokens.fonts.sansMedium, color: t.tokens.semantic.inkMute },
            ]}
          >
            Take photo
          </Text>
        </Pressable>
        {coverUri ? (
          <Pressable onPress={onRemove} style={styles.removeBtn}>
            <MaterialCommunityIcons
              name="close"
              size={12}
              color={t.tokens.semantic.inkFaint}
            />
            <Text
              style={[
                styles.removeLabel,
                { fontFamily: t.tokens.fonts.sansMedium, color: t.tokens.semantic.inkFaint },
              ]}
            >
              Remove
            </Text>
          </Pressable>
        ) : null}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  coverShadow: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 4,
  },
  actions: {
    flex: 1,
    marginLeft: 14,
    gap: 8,
  },
  btn: {
    height: 40,
    paddingHorizontal: 14,
    borderRadius: 10,
    borderWidth: StyleSheet.hairlineWidth,
    flexDirection: 'row',
    alignItems: 'center',
  },
  btnDashed: {
    height: 40,
    paddingHorizontal: 14,
    borderRadius: 10,
    borderWidth: StyleSheet.hairlineWidth,
    borderStyle: 'dashed',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  btnLabel: {
    fontSize: 12,
    marginLeft: 8,
  },
  removeBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingLeft: 14,
  },
  removeLabel: {
    fontSize: 11,
    marginLeft: 4,
  },
});

export default AddCoverRow;
