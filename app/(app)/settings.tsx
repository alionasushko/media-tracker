import AppButton from '@/components/ui/AppButton';
import { commonStyles } from '@/styles/common';
import { auth } from '@services/firebase';
import { useUI } from '@stores/ui.store';
import { router } from 'expo-router';
import { signOut } from 'firebase/auth';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Appbar, Card, Icon, RadioButton, Text, useTheme } from 'react-native-paper';

const Settings = () => {
  const ownerName = auth.currentUser?.displayName;
  const { theme, setTheme } = useUI();
  const paperTheme = useTheme();

  const handleSignOut = async () => {
    await signOut(auth);
    router.replace('/(auth)/sign-in');
  };
  const handleGoBack = () => router.back();
  const handleChangeTheme = (v: any) => setTheme(v);

  return (
    <View style={[commonStyles.container, { backgroundColor: paperTheme.colors.background }]}>
      <Appbar.Header>
        <Appbar.BackAction onPress={handleGoBack} />
        <Appbar.Content title="Settings" />
      </Appbar.Header>
      <ScrollView contentContainerStyle={styles.scrollView}>
        <Card>
          <Card.Title
            title={
              <View style={styles.cardTitleWrapper}>
                <Icon source="palette" size={28} />
                <Text variant="titleMedium">Appearance</Text>
              </View>
            }
          />
          <Card.Content>
            <RadioButton.Group value={theme} onValueChange={handleChangeTheme}>
              <RadioButton.Item label="Light" value="light" />
              <RadioButton.Item label="Dark" value="dark" />
            </RadioButton.Group>
          </Card.Content>
        </Card>
        <Card>
          <Card.Title
            title={
              <View style={styles.cardTitleWrapper}>
                <Icon source="account" size={28} />
                <Text variant="titleMedium">{ownerName}</Text>
              </View>
            }
          />
          <Card.Content>
            <AppButton
              onPress={handleSignOut}
              mode="contained"
              style={styles.btnSignOut}
              icon="logout"
            >
              Sign out
            </AppButton>
          </Card.Content>
        </Card>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  scrollView: { padding: 16, gap: 24 },
  description: { textAlign: 'center' },
  btnContainer: { flexDirection: 'row', gap: 8, marginTop: 12 },
  cardTitleWrapper: {
    display: 'flex',
    flexDirection: 'row',
    gap: 8,
    paddingTop: 16,
    paddingBottom: 8,
  },
  btnSignOut: { marginTop: 8 },
});

export default Settings;
