import { StyleSheet } from 'react-native';
import { colors } from '../styles/global';

export default StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 16, backgroundColor: colors.background },
  title: { fontSize: 24, marginBottom: 24, color: colors.text, fontWeight: '700' },
  buttonWrap: { width: '100%', marginVertical: 8, alignItems: 'center' },
  homeButton: { width: '90%', backgroundColor: colors.primary, paddingVertical: 18, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  homeLabel: { color: colors.white, fontSize: 18, fontWeight: '700', marginLeft: 10 },
});
