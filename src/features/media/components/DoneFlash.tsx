import { useAppTheme } from '@/shared/theme';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { StyleSheet } from 'react-native';
import Animated, { Easing, FadeOut, ZoomIn } from 'react-native-reanimated';

interface Props {
  visible: boolean;
}

const DoneFlash = ({ visible }: Props) => {
  const t = useAppTheme();
  if (!visible) return null;
  return (
    <Animated.View
      entering={ZoomIn.duration(380).easing(Easing.out(Easing.back(1.6)))}
      exiting={FadeOut.duration(220)}
      style={[
        styles.burst,
        {
          backgroundColor: 'rgba(95, 179, 122, 0.22)',
          borderColor: t.tokens.semantic.statusDone,
          shadowColor: t.tokens.semantic.statusDone,
        },
      ]}
      pointerEvents="none"
    >
      <MaterialCommunityIcons name="check" size={64} color={t.tokens.semantic.statusDone} />
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  burst: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    width: 160,
    height: 160,
    marginLeft: -80,
    marginTop: -80,
    borderRadius: 80,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 40,
    elevation: 12,
  },
});

export default DoneFlash;
