import { StyleSheet } from 'react-native';

export const commonStyles = StyleSheet.create({
  container: {
    flex: 1,
  },
  authContainer: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: 'center',
  },
  authTitleWrapper: { alignItems: 'center', marginBottom: 24 },
  authTitle: { marginTop: 6, opacity: 0.5 },
  authFormComponentMargin: { marginTop: 16 },
  authBtnMargin: { marginTop: 24 },
  preview: {
    width: '100%',
    aspectRatio: 16 / 9,
    borderRadius: 12,
    overflow: 'hidden',
  },
});
