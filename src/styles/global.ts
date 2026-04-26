import { StyleSheet } from 'react-native';

export const colors = {
  background: '#fffaf6',
  card: '#fff0e8',
  primary: '#ff8a65',
  accent: '#ffd6ba',
  text: '#4b2e2e',
  muted: '#6b6b6b',
  danger: '#b00020',
  white: '#ffffff',
};

export default StyleSheet.create({
  // Layout
  container: { flex: 1, padding: 16, backgroundColor: colors.background },

  // Header card
  headerCard: { width: '100%', backgroundColor: colors.card, padding: 12, borderRadius: 12, marginBottom: 12, alignItems: 'center' },
  headerText: { color: colors.text, fontSize: 16 },
  total: { fontSize: 22, fontWeight: '700', marginTop: 6, color: colors.text },

  // Actions
  actions: { width: '100%', marginBottom: 8, alignItems: 'center' },
  primaryButton: { backgroundColor: colors.primary, paddingHorizontal: 18, paddingVertical: 14, borderRadius: 12, minWidth: 160, alignItems: 'center', justifyContent: 'center' },
  primaryButtonText: { color: colors.white, fontWeight: '700' },

  // Table
  tableWrapper: { width: '100%' },
  tableHeader: { flexDirection: 'row', paddingVertical: 8, borderBottomWidth: 1, borderColor: '#eee', backgroundColor: 'transparent' },
  row: { flexDirection: 'row', paddingVertical: 12, borderBottomWidth: 1, borderColor: '#f0e6e1', alignItems: 'center' },
  colBase: { paddingHorizontal: 6 },
  colAmount: { width: 120 },
  colCategory: { width: 140 },
  colDate: { width: 120 },
  colNote: { flex: 1, minWidth: 200 },
  colActions: { width: 140, alignItems: 'center' },
  rowActions: { flexDirection: 'row', justifyContent: 'flex-end' },
  actionButton: { backgroundColor: colors.white, borderRadius: 8, paddingHorizontal: 10, paddingVertical: 6, marginLeft: 8, borderWidth: 1, borderColor: colors.accent },
  actionText: { color: colors.text },

  // Table text alignment
  tableHeaderText: { textAlign: 'center', fontWeight: '700', color: colors.text },
  tableCellText: { textAlign: 'center', color: colors.text },

  // Deudores
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  titleLarge: { fontSize: 20, fontWeight: '700', color: colors.text },
  formCard: { backgroundColor: colors.card, padding: 12, borderRadius: 10, marginBottom: 12 },
  input: { backgroundColor: colors.white, padding: 10, borderRadius: 8, borderWidth: 1, borderColor: '#eee' },
  formActions: { flexDirection: 'row', justifyContent: 'flex-end', marginTop: 8 },
  button: { backgroundColor: colors.primary, paddingHorizontal: 12, paddingVertical: 8, borderRadius: 8, marginLeft: 8 },
  buttonText: { color: colors.white, fontWeight: '600' },
  buttonOutline: { borderWidth: 1, borderColor: colors.primary, paddingHorizontal: 12, paddingVertical: 8, borderRadius: 8 },
  buttonOutlineText: { color: colors.primary, fontWeight: '600' },

  // Debtor detail
  filterRow: { flexDirection: 'row', width: '100%', alignItems: 'center', marginBottom: 10 },
  debtAmount: { fontWeight: '700', color: colors.text },
  subText: { color: colors.muted },
});
