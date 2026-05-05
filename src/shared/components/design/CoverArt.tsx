import { mediaTypeIconNames } from '@/features/media/constants';
import { useStorageDownloadUrl } from '@/shared/hooks/useStorageDownloadUrl';
import { useAppTheme } from '@/shared/theme';
import type { MediaType } from '@/shared/theme/tokens';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Image, StyleSheet, View, type ViewStyle } from 'react-native';

interface Props {
  path?: string | null;
  title?: string;
  type: MediaType;
  size?: number;
  width?: number;
  height?: number;
  radius?: number;
  style?: ViewStyle;
  children?: React.ReactNode;
}

const hashTitle = (s: string) => {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0;
  return Math.abs(h);
};

const CoverArt = ({
  path,
  title = '',
  type,
  size,
  width,
  height,
  radius = 10,
  style,
  children,
}: Props) => {
  const t = useAppTheme();
  const isDirectUri = typeof path === 'string' && /:\/\//.test(path);
  const { url } = useStorageDownloadUrl(isDirectUri ? undefined : path ?? undefined);
  const finalUri = isDirectUri ? path : url;

  const w = width ?? size ?? 80;
  const h = height ?? size ? Math.round((size ?? w) * 1.45) : Math.round(w * 1.45);

  if (path && finalUri) {
    return (
      <View
        style={[
          {
            width: w,
            height: h,
            borderRadius: radius,
            overflow: 'hidden',
            backgroundColor: t.tokens.semantic.surface2,
          },
          style,
        ]}
      >
        <Image source={{ uri: finalUri }} style={StyleSheet.absoluteFillObject} resizeMode="cover" />
        {children}
      </View>
    );
  }

  const accent = t.tokens.typeAccents[type];
  const seed = hashTitle(title || type);
  const tilt = (seed % 30) - 15;
  const lighten = (hex: string, amt: number) => {
    const n = parseInt(hex.slice(1), 16);
    const r = Math.min(255, Math.round((n >> 16) + amt * 255));
    const g = Math.min(255, Math.round(((n >> 8) & 0xff) + amt * 255));
    const b = Math.min(255, Math.round((n & 0xff) + amt * 255));
    return `rgb(${r}, ${g}, ${b})`;
  };
  const darken = (hex: string, amt: number) => {
    const n = parseInt(hex.slice(1), 16);
    const r = Math.max(0, Math.round((n >> 16) - amt * 255));
    const g = Math.max(0, Math.round(((n >> 8) & 0xff) - amt * 255));
    const b = Math.max(0, Math.round((n & 0xff) - amt * 255));
    return `rgb(${r}, ${g}, ${b})`;
  };

  return (
    <View
      style={[
        {
          width: w,
          height: h,
          borderRadius: radius,
          overflow: 'hidden',
          backgroundColor: t.tokens.semantic.surface2,
        },
        style,
      ]}
    >
      <LinearGradient
        colors={[lighten(accent, 0.05), accent, darken(accent, 0.25)]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFillObject}
      />
      <View
        style={[
          StyleSheet.absoluteFillObject,
          {
            alignItems: 'center',
            justifyContent: 'center',
            transform: [{ rotate: `${tilt}deg` }],
            opacity: 0.32,
          },
        ]}
      >
        <MaterialCommunityIcons
          name={mediaTypeIconNames[type]}
          size={Math.min(w, h) * 0.55}
          color="#ffffff"
        />
      </View>
      {children}
    </View>
  );
};

export default CoverArt;
