import ActivityRow from '@/features/media/components/ActivityRow';
import { STATUS } from '@/features/media/constants';
import type { Status } from '@/features/media/types';
import { Eyebrow } from '@/shared/components/design/text';
import { fmtRelativeUpper } from '@/shared/utils/date';
import { StyleSheet, View } from 'react-native';

interface Props {
  status: Status;
  createdAt: number;
  updatedAt: number;
}

const DetailActivity = ({ status, createdAt, updatedAt }: Props) => {
  const statusText = status === STATUS.PROGRESS ? 'in progress' : status;
  return (
    <View style={styles.container}>
      <Eyebrow style={styles.eyebrow}>Activity</Eyebrow>
      <ActivityRow
        text={`Status set to ${statusText}.`}
        when={fmtRelativeUpper(updatedAt)}
        divider
      />
      <ActivityRow text="Added to your shelf." when={fmtRelativeUpper(createdAt)} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 28,
    paddingTop: 28,
  },
  eyebrow: {
    marginBottom: 14,
  },
});

export default DetailActivity;
