import { StyleSheet } from 'react-native';
import { colors } from '../styles/global';

export default StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modal: {
    width: '92%',
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 6,
  },
  title: { fontSize: 18, fontWeight: '600', marginBottom: 8, color: colors.text },
  instructionText: { color: colors.muted, marginBottom: 6, fontSize: 14 },
  input: {
    backgroundColor: colors.white,
    padding: 10,
    borderRadius: 8,
    marginTop: 8,
    borderWidth: 1,
    borderColor: '#eee',
  },
  row: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 12 },
  button: {
    backgroundColor: colors.primary,
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 8,
  },
  buttonText: { color: colors.white, fontWeight: '600' },
  buttonOutline: { borderWidth: 1, borderColor: colors.primary, paddingVertical: 10, paddingHorizontal: 18, borderRadius: 8 },
  buttonOutlineText: { color: colors.primary, fontWeight: '600' },
  
});
