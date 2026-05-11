import type { MediaType } from '@/features/media/types';
import CoverArt from '@/shared/components/design/CoverArt';
import { useAppTheme } from '@/shared/theme';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Dimensions, StyleSheet, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  type SharedValue,
} from 'react-native-reanimated';

const { width: screenWidth } = Dimensions.get('window');
export const HERO_HEIGHT = 380;
const COVER_SIZE = 180;

interface Props {
  coverUrl?: string | null;
  title: string;
  type: MediaType;
  scrollY: SharedValue<number>;
  isUploading?: boolean;
}

const DetailHero = ({ coverUrl, title, type, scrollY, isUploading }: Props) => {
  const t = useAppTheme();

  const backdropStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: scrollY.value * 0.4 }, { scale: 1.15 }],
  }));

  const coverStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: scrollY.value * 0.2 }],
  }));

  return (
    <View style={styles.container}>
      <Animated.View style={[StyleSheet.absoluteFillObject, backdropStyle]}>
        <CoverArt
          path={coverUrl}
          title={title}
          type={type}
          width={screenWidth}
          height={HERO_HEIGHT * 1.2}
          radius={0}
        />
        <View
          style={[
            StyleSheet.absoluteFillObject,
            { backgroundColor: t.tokens.semantic.bg, opacity: 0.55 },
          ]}
        />
      </Animated.View>

      <LinearGradient
        colors={['transparent', 'transparent', t.tokens.semantic.bg]}
        locations={[0, 0.45, 1]}
        style={StyleSheet.absoluteFillObject}
      />

      <Animated.View style={[styles.coverWrap, coverStyle]}>
        <CoverArt
          path={coverUrl}
          title={title}
          type={type}
          width={COVER_SIZE}
          height={COVER_SIZE * 1.45}
          radius={14}
        />
        {isUploading ? (
          <View style={styles.uploadingOverlay}>
            <MaterialCommunityIcons name="cloud-upload-outline" size={32} color="#FFFFFF" />
          </View>
        ) : null}
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: HERO_HEIGHT,
    overflow: 'hidden',
  },
  coverWrap: {
    position: 'absolute',
    left: (screenWidth - COVER_SIZE) / 2,
    bottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 18 },
    shadowOpacity: 0.55,
    shadowRadius: 30,
    elevation: 12,
  },
  uploadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 14,
    backgroundColor: 'rgba(0,0,0,0.4)',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default DetailHero;
