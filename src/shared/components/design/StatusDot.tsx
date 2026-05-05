import { View, type ViewStyle } from 'react-native';
import { useAppTheme } from '@/shared/theme';
import type { Status } from '@/features/media/types';

interface Props {
  status: Status;
  size?: number;
  ring?: boolean;
  style?: ViewStyle;
}

export const statusColor = (semantic: ReturnType<typeof useAppTheme>['tokens']['semantic'], s: Status) => {
  switch (s) {
    case 'plan':
      return semantic.statusPlan;
    case 'progress':
      return semantic.statusProgress;
    case 'done':
      return semantic.statusDone;
    case 'dropped':
      return semantic.statusDropped;
  }
};

const StatusDot = ({ status, size = 8, ring, style }: Props) => {
  const t = useAppTheme();
  const color = statusColor(t.tokens.semantic, status);
  return (
    <View
      style={[
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: color,
        },
        ring && status === 'progress'
          ? {
              shadowColor: color,
              shadowOffset: { width: 0, height: 0 },
              shadowOpacity: 1,
              shadowRadius: 0,
              borderWidth: size * 0.4,
              borderColor: t.tokens.semantic.accentSoft,
              width: size + size * 0.8,
              height: size + size * 0.8,
              borderRadius: size,
            }
          : null,
        style,
      ]}
    />
  );
};

export default StatusDot;
