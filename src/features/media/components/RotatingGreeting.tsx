import { Display } from '@/shared/components/design/text';
import { useAppTheme } from '@/shared/theme';
import { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { getCurrentGreeting } from '../greetings';

interface Props {
  inProgress: number;
  planned: number;
  streak: number;
}

const RotatingGreeting = ({ inProgress, planned, streak }: Props) => {
  const t = useAppTheme();
  const greeting = useMemo(() => getCurrentGreeting(), []);

  return (
    <View style={styles.wrap}>
      <Display size={30} style={styles.lead}>
        {greeting.lead}{' '}
        <Display size={30} style={[styles.em, { color: t.tokens.semantic.accent }]}>
          {greeting.em}
        </Display>
        .
      </Display>
      <Text
        style={[
          styles.stats,
          { fontFamily: t.tokens.fonts.sansRegular, color: t.tokens.semantic.inkMute },
        ]}
      >
        {inProgress} in motion · {planned} on deck
        {streak > 0 ? ` · ${streak}-day streak` : ''}.
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  wrap: {
    paddingHorizontal: 24,
    paddingBottom: 28,
  },
  lead: {
    maxWidth: 320,
  },
  em: {
    fontStyle: 'italic',
  },
  stats: {
    marginTop: 10,
    fontSize: 13,
    lineHeight: 20,
  },
});

export default RotatingGreeting;
