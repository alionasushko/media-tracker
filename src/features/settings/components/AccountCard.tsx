import { useAppTheme } from '@/shared/theme';
import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet, Text, View } from 'react-native';

interface Props {
  name: string;
  email?: string;
}

const AccountCard = ({ name, email }: Props) => {
  const t = useAppTheme();
  const initial = name.trim().charAt(0).toUpperCase() || 'A';

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: t.tokens.semantic.surface1,
          borderColor: t.tokens.semantic.hairline,
        },
      ]}
    >
      <View style={[styles.avatar, { shadowColor: t.tokens.semantic.accent }]}>
        <LinearGradient
          colors={[t.tokens.semantic.accent, t.tokens.semantic.ink]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={StyleSheet.absoluteFillObject}
        />
        <Text
          style={[
            styles.initial,
            { fontFamily: t.tokens.fonts.serifMedium, color: t.tokens.semantic.accentInk },
          ]}
        >
          {initial}
        </Text>
      </View>
      <View style={styles.body}>
        <Text
          numberOfLines={1}
          style={[
            styles.name,
            { fontFamily: t.tokens.fonts.sansSemiBold, color: t.tokens.semantic.ink },
          ]}
        >
          {name}
        </Text>
        {email ? (
          <Text
            numberOfLines={1}
            style={[
              styles.email,
              { fontFamily: t.tokens.fonts.sansRegular, color: t.tokens.semantic.inkMute },
            ]}
          >
            {email}
          </Text>
        ) : null}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 18,
    borderWidth: StyleSheet.hairlineWidth,
  },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 4,
  },
  initial: {
    fontSize: 22,
  },
  body: {
    flex: 1,
    marginLeft: 14,
  },
  name: {
    fontSize: 16,
    letterSpacing: -0.2,
  },
  email: {
    fontSize: 12,
    marginTop: 2,
  },
});

export default AccountCard;
