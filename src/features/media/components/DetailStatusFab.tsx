import { statusActionLabels, statuses } from '@/features/media/constants';
import type { Status } from '@/features/media/types';
import StatusDot from '@/shared/components/design/StatusDot';
import { useAppTheme } from '@/shared/theme';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, { ZoomIn, ZoomOut } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface Props {
  current: Status;
  onChange: (status: Status) => void;
}

const DetailStatusFab = ({ current, onChange }: Props) => {
  const t = useAppTheme();
  const insets = useSafeAreaInsets();
  const [open, setOpen] = useState(false);

  const handleSelect = (s: Status) => {
    setOpen(false);
    onChange(s);
  };

  return (
    <View
      style={[styles.wrap, { bottom: insets.bottom + 24 }]}
      pointerEvents="box-none"
    >
      {open ? (
        <Animated.View
          entering={ZoomIn.duration(220).springify()}
          exiting={ZoomOut.duration(140)}
          style={[
            styles.menu,
            {
              backgroundColor: t.tokens.semantic.surface2,
              borderColor: t.tokens.semantic.hairlineStrong,
              shadowColor: '#000',
            },
          ]}
        >
          {statuses.map((s) => {
            const active = current === s;
            return (
              <Pressable
                key={s}
                onPress={() => handleSelect(s)}
                style={[
                  styles.menuItem,
                  {
                    backgroundColor: active ? t.tokens.semantic.accentSoft : 'transparent',
                  },
                ]}
              >
                <StatusDot status={s} size={8} />
                <Text
                  style={[
                    styles.menuLabel,
                    {
                      fontFamily: t.tokens.fonts.sansMedium,
                      color: active ? t.tokens.semantic.accent : t.tokens.semantic.ink,
                    },
                  ]}
                >
                  {statusActionLabels[s]}
                </Text>
              </Pressable>
            );
          })}
        </Animated.View>
      ) : null}
      <Pressable
        onPress={() => setOpen((v) => !v)}
        style={[
          styles.fab,
          {
            backgroundColor: t.tokens.semantic.accent,
            shadowColor: t.tokens.semantic.accent,
          },
        ]}
        accessibilityLabel="Change status"
      >
        <MaterialCommunityIcons
          name={open ? 'close' : 'pencil-outline'}
          size={22}
          color={t.tokens.semantic.accentInk}
        />
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  wrap: {
    position: 'absolute',
    right: 20,
    alignItems: 'flex-end',
  },
  fab: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.5,
    shadowRadius: 18,
    elevation: 8,
  },
  menu: {
    position: 'absolute',
    bottom: 68,
    right: 0,
    width: 220,
    borderRadius: 16,
    padding: 6,
    borderWidth: StyleSheet.hairlineWidth,
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 0.4,
    shadowRadius: 24,
    elevation: 8,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
  },
  menuLabel: {
    fontSize: 13,
    marginLeft: 10,
  },
});

export default DetailStatusFab;
