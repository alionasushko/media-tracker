import { StyleSheet } from 'react-native';

export const commonStyles = StyleSheet.create({
  container: {
    flex: 1,
  },
  authContainer: {
    flex: 1,
    padding: 16,
    justifyContent: 'center',
  },
  authTitleWrapper: { alignItems: 'center', marginBottom: 12 },
  authTitle: { marginTop: 2, opacity: 0.7 },
  authFormComponentMargin: { marginTop: 8 },
  authBtnMargin: { marginTop: 12 },
  preview: {
    width: '100%',
    aspectRatio: 16 / 9,
    borderWidth: 1,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: 'rgba(0,0,0,0.05)',
  },
});
