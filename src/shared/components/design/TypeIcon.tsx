import { mediaTypeIconNames } from '@/features/media/constants';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useAppTheme } from '@/shared/theme';
import type { MediaType } from '@/shared/theme/tokens';

interface Props {
  type: MediaType;
  size?: number;
  color?: string;
  tinted?: boolean;
}

const TypeIcon = ({ type, size = 14, color, tinted }: Props) => {
  const t = useAppTheme();
  const resolved = color ?? (tinted ? t.tokens.typeAccents[type] : t.tokens.semantic.inkMute);
  return <MaterialCommunityIcons name={mediaTypeIconNames[type]} size={size} color={resolved} />;
};

export default TypeIcon;
