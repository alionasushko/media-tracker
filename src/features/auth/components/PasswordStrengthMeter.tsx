import { useAppTheme } from '@/shared/theme';
import { StyleSheet, Text, View } from 'react-native';

const passwordStrength = (password: string) => {
  let score = 0;
  if (password.length >= 8) score++;
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score++;
  if (/\d/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;
  return score;
};

const strengthLabel = (s: number) => {
  if (s <= 1) return 'Weak';
  if (s === 2) return 'Fair';
  if (s === 3) return 'Strong';
  return 'Excellent';
};

interface Props {
  password: string;
}

const PasswordStrengthMeter = ({ password }: Props) => {
  const t = useAppTheme();
  if (password.length === 0) return <View style={styles.placeholder} />;

  const strength = passwordStrength(password);
  return (
    <View style={styles.wrap}>
      <View style={styles.bars}>
        {[1, 2, 3, 4].map((i) => (
          <View
            key={i}
            style={[
              styles.bar,
              {
                backgroundColor:
                  i <= strength ? t.tokens.semantic.accent : t.tokens.semantic.surface3,
              },
            ]}
          />
        ))}
      </View>
      <View style={styles.row}>
        <Text
          style={[
            styles.label,
            { fontFamily: t.tokens.fonts.sansRegular, color: t.tokens.semantic.inkFaint },
          ]}
        >
          {strengthLabel(strength)} password
        </Text>
        <Text
          style={[
            styles.score,
            { fontFamily: t.tokens.fonts.monoMedium, color: t.tokens.semantic.accent },
          ]}
        >
          {strength} / 4
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  placeholder: {
    height: 22,
  },
  wrap: {
    marginBottom: 22,
  },
  bars: {
    flexDirection: 'row',
    gap: 4,
    marginBottom: 6,
  },
  bar: {
    flex: 1,
    height: 3,
    borderRadius: 2,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  label: {
    fontSize: 11,
  },
  score: {
    fontSize: 11,
  },
});

export default PasswordStrengthMeter;
