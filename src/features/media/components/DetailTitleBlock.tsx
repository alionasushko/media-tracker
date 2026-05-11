import { mediaTypeIconNames } from '@/features/media/constants';
import type { MediaType, Status } from '@/features/media/types';
import StatusPill from '@/shared/components/design/StatusPill';
import { Display, Eyebrow } from '@/shared/components/design/text';
import { useAppTheme } from '@/shared/theme';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { StyleSheet, View } from 'react-native';

interface Props {
  title: string;
  type: MediaType;
  status: Status;
}

const DetailTitleBlock = ({ title, type, status }: Props) => {
  const t = useAppTheme();
  return (
    <View style={styles.container}>
      <View style={styles.metaRow}>
        <MaterialCommunityIcons
          name={mediaTypeIconNames[type]}
          size={11}
          color={t.tokens.semantic.inkFaint}
        />
        <Eyebrow style={styles.metaLabel}>{type}</Eyebrow>
      </View>
      <Display size={36} style={styles.title}>
        {title}
      </Display>
      <StatusPill status={status} size="md" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 28,
    paddingTop: 20,
    alignItems: 'center',
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  metaLabel: {
    marginLeft: 6,
  },
  title: {
    textAlign: 'center',
    marginTop: 4,
    marginBottom: 14,
  },
});

export default DetailTitleBlock;
