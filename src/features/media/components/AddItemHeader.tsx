import GlassButton from '@/shared/components/design/GlassButton';
import { useAppTheme } from '@/shared/theme';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { ActivityIndicator, Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface Props {
  onBack: () => void;
  onSave: () => void;
  canSave: boolean;
  isSubmitting: boolean;
}

const AddItemHeader = ({ onBack, onSave, canSave, isSubmitting }: Props) => {
  const t = useAppTheme();
  const insets = useSafeAreaInsets();

  const paddingTop = Platform.OS === 'ios' ? 12 : insets.top + 8;

  return (
    <View style={[styles.row, { paddingTop }]}>
      <GlassButton onPress={onBack} accessibilityLabel="Back">
        <MaterialCommunityIcons name="chevron-left" size={20} color={t.tokens.semantic.ink} />
      </GlassButton>
      <Pressable
        onPress={onSave}
        disabled={!canSave}
        style={[
          styles.savePill,
          {
            backgroundColor: t.tokens.semantic.accent,
            shadowColor: t.tokens.semantic.accent,
            opacity: canSave ? 1 : 0.5,
          },
        ]}
      >
        {isSubmitting ? (
          <ActivityIndicator size={14} color={t.tokens.semantic.accentInk} />
        ) : (
          <MaterialCommunityIcons name="check" size={14} color={t.tokens.semantic.accentInk} />
        )}
        <Text
          style={[
            styles.saveLabel,
            { fontFamily: t.tokens.fonts.sansBold, color: t.tokens.semantic.accentInk },
          ]}
        >
          SAVE
        </Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  row: {
    paddingHorizontal: 16,
    paddingBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  savePill: {
    height: 36,
    paddingHorizontal: 16,
    borderRadius: 18,
    flexDirection: 'row',
    alignItems: 'center',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 4,
  },
  saveLabel: {
    fontSize: 12,
    letterSpacing: 1,
    marginLeft: 6,
  },
});

export default AddItemHeader;
