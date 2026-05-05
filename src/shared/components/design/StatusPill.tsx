import { statusLabels } from '@/features/media/constants';
import type { Status } from '@/features/media/types';
import { useAppTheme } from '@/shared/theme';
import { StyleSheet, Text, View } from 'react-native';
import StatusDot, { statusColor } from './StatusDot';

interface Props {
  status: Status;
  size?: 'sm' | 'md';
}

const StatusPill = ({ status, size = 'sm' }: Props) => {
  const t = useAppTheme();
  const color = statusColor(t.tokens.semantic, status);
  const isMd = size === 'md';
  return (
    <View
      style={[
        styles.base,
        {
          backgroundColor: t.tokens.semantic.surface2,
          borderColor: t.tokens.semantic.hairline,
          paddingHorizontal: isMd ? 14 : 10,
          height: isMd ? 32 : 26,
        },
      ]}
    >
      <StatusDot status={status} size={isMd ? 7 : 6} />
      <Text
        style={{
          fontFamily: t.tokens.fonts.sansMedium,
          fontSize: isMd ? 13 : 11,
          color,
          letterSpacing: 0.1,
          marginLeft: 7,
        }}
      >
        {statusLabels[status]}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 9999,
    borderWidth: StyleSheet.hairlineWidth,
  },
});

export default StatusPill;
