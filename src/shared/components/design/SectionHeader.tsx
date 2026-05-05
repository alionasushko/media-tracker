import { StyleSheet, View, type ViewStyle } from 'react-native';
import { Display, Eyebrow } from './text';

interface Props {
  eyebrow: string;
  title: string;
  size?: number;
  paddingHorizontal?: number;
  style?: ViewStyle;
}

const SectionHeader = ({
  eyebrow,
  title,
  size = 28,
  paddingHorizontal = 24,
  style,
}: Props) => (
  <View style={[styles.wrap, { paddingHorizontal }, style]}>
    <Eyebrow>{eyebrow}</Eyebrow>
    <Display size={size} style={styles.title}>
      {title}
    </Display>
  </View>
);

const styles = StyleSheet.create({
  wrap: {
    marginBottom: 14,
  },
  title: {
    marginTop: 6,
  },
});

export default SectionHeader;
