import GlassButton from '@/shared/components/design/GlassButton';
import PrimaryButton from '@/shared/components/design/PrimaryButton';
import { Display } from '@/shared/components/design/text';
import { useAppTheme } from '@/shared/theme';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const NotFound = () => {
  const router = useRouter();
  const t = useAppTheme();
  const insets = useSafeAreaInsets();

  const handleGoBack = () => router.back();
  const handleGoHome = () => router.replace('/');

  return (
    <View style={[styles.container, { backgroundColor: t.tokens.semantic.bg }]}>
      <View style={[styles.headerRow, { paddingTop: insets.top + 8 }]}>
        <GlassButton onPress={handleGoBack} accessibilityLabel="Back">
          <MaterialCommunityIcons
            name="chevron-left"
            size={20}
            color={t.tokens.semantic.ink}
          />
        </GlassButton>
      </View>

      <View style={styles.center}>
        <View style={styles.numericMark}>
          <Text
            style={[
              styles.numeral,
              { fontFamily: t.tokens.fonts.serifMedium, color: t.tokens.semantic.ink },
            ]}
          >
            4
          </Text>
          <Text
            style={[
              styles.numeral,
              styles.numeralItalic,
              { fontFamily: t.tokens.fonts.serifMedium, color: t.tokens.semantic.accent },
            ]}
          >
            0
          </Text>
          <Text
            style={[
              styles.numeral,
              { fontFamily: t.tokens.fonts.serifMedium, color: t.tokens.semantic.ink },
            ]}
          >
            4
          </Text>
        </View>

        <Display size={22} style={styles.tagline}>
          That shelf is{' '}
          <Display size={22} style={{ fontStyle: 'italic', color: t.tokens.semantic.accent }}>
            empty
          </Display>
          .
        </Display>

        <Text
          style={[
            styles.body,
            { fontFamily: t.tokens.fonts.sansRegular, color: t.tokens.semantic.inkMute },
          ]}
        >
          We couldn&apos;t find what you were looking for. It may have been removed, or the link
          might be stale.
        </Text>

        <View style={styles.cta}>
          <PrimaryButton label="Back to home" icon="home-outline" onPress={handleGoHome} />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  headerRow: {
    paddingHorizontal: 16,
    paddingBottom: 4,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  numericMark: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  numeral: {
    fontSize: 140,
    lineHeight: 120,
    letterSpacing: -7,
  },
  numeralItalic: {
    fontStyle: 'italic',
  },
  tagline: {
    textAlign: 'center',
    marginTop: 24,
  },
  body: {
    fontSize: 13,
    lineHeight: 20,
    textAlign: 'center',
    marginTop: 10,
    maxWidth: 280,
  },
  cta: {
    marginTop: 32,
    width: '100%',
    maxWidth: 240,
  },
});

export default NotFound;
