import { Display, Eyebrow } from '@/shared/components/design/text';
import { useAppTheme } from '@/shared/theme';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';

interface Props {
  streakDays: number;
}

const StatsStreakCard = ({ streakDays }: Props) => {
  const t = useAppTheme();
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
      <View
        style={[
          styles.badge,
          {
            backgroundColor: t.tokens.semantic.accentSoft,
            borderColor: t.tokens.semantic.accentSoft,
          },
        ]}
      >
        <MaterialCommunityIcons name="fire" size={28} color={t.tokens.semantic.accent} />
      </View>
      <View style={styles.body}>
        <Eyebrow style={styles.label}>Current streak</Eyebrow>
        <View style={styles.numberRow}>
          <Display size={30}>{streakDays}</Display>
          <Text
            style={[
              styles.unit,
              { fontFamily: t.tokens.fonts.sansMedium, color: t.tokens.semantic.inkMute },
            ]}
          >
            days
          </Text>
        </View>
        <Text
          style={[
            styles.subtitle,
            { fontFamily: t.tokens.fonts.sansRegular, color: t.tokens.semantic.inkMute },
          ]}
        >
          Keep it lit.
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 22,
    borderRadius: 20,
    borderWidth: StyleSheet.hairlineWidth,
  },
  badge: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: StyleSheet.hairlineWidth,
  },
  body: {
    flex: 1,
    marginLeft: 18,
  },
  label: {
    marginBottom: 4,
  },
  numberRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  unit: {
    fontSize: 14,
    marginLeft: 6,
  },
  subtitle: {
    fontSize: 12,
    marginTop: 4,
  },
});

export default StatsStreakCard;
