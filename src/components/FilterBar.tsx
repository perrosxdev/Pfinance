import React, { useMemo, useState } from 'react';
import { View, Text, TouchableOpacity, Modal, StyleSheet, ScrollView } from 'react-native';
import { colors } from '../styles/global';
import { lastNMonths } from '../utils/retention';

type Filter = { month?: string; category?: string };

type Props = {
  initialMonth?: string;
  initialCategory?: string;
  categories?: string[];
  showCategory?: boolean;
  onChange: (f: Filter) => void;
};

const DEFAULT_CATS = ['Comida', 'Limpieza', 'Tecnologias', 'Transporte', 'Salud', 'Extras', 'Otros'];

export default function FilterBar({ initialMonth, initialCategory, categories = DEFAULT_CATS, showCategory = true, onChange }: Props) {
  const months = useMemo(() => lastNMonths(6), []);
  const [open, setOpen] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState(initialMonth ?? months[0]);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory ?? '');

  function labelFor(month: string) {
    const [y, m] = month.split('-');
    const date = new Date(Number(y), Number(m) - 1);
    return date.toLocaleString('es-CL', { month: 'long', year: 'numeric' });
  }

  function applyMonth(m?: string) {
    setSelectedMonth(m ?? '');
    onChange({ month: m, category: selectedCategory || undefined });
    setOpen(false);
  }

  function applyCategory(c?: string) {
    setSelectedCategory(c ?? '');
    onChange({ month: selectedMonth || undefined, category: c || undefined });
  }

  return (
    <View style={s.bar}>
      <TouchableOpacity style={s.pill} onPress={() => setOpen(true)}>
        <Text style={s.pillText}>{selectedMonth ? labelFor(selectedMonth) : 'Mes: Todos'}</Text>
      </TouchableOpacity>

      {showCategory ? (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={s.cats} contentContainerStyle={{ paddingHorizontal: 4 }}>
          <TouchableOpacity style={[s.catPill, !selectedCategory ? s.catSelected : null]} onPress={() => applyCategory('')}>
            <Text style={[s.catText, !selectedCategory ? s.catTextSelected : null]}>Todas</Text>
          </TouchableOpacity>
          {categories.map(c => (
            <TouchableOpacity key={c} style={[s.catPill, selectedCategory === c ? s.catSelected : null]} onPress={() => applyCategory(c)}>
              <Text style={[s.catText, selectedCategory === c ? s.catTextSelected : null]}>{c}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      ) : null}

      <Modal visible={open} transparent animationType="fade" onRequestClose={() => setOpen(false)}>
        <View style={s.modalBackdrop}>
          <View style={s.modalCard}>
            <Text style={s.modalTitle}>Selecciona mes</Text>
            {months.map(m => (
              <TouchableOpacity key={m} style={[s.modalRow, m === selectedMonth ? s.modalRowSelected : null]} onPress={() => applyMonth(m)}>
                <Text style={m === selectedMonth ? s.modalTextSelected : s.modalText}>{labelFor(m)}</Text>
              </TouchableOpacity>
            ))}
            <TouchableOpacity style={s.modalClose} onPress={() => applyMonth('')}><Text style={s.modalCloseText}>Mostrar todo</Text></TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const s = StyleSheet.create({
  bar: { width: '100%', flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  pill: { paddingVertical: 8, paddingHorizontal: 12, backgroundColor: colors.card, borderRadius: 8, marginRight: 8 },
  pillText: { color: colors.text, fontWeight: '700' },
  cats: { flex: 1 },
  catPill: { paddingVertical: 6, paddingHorizontal: 10, backgroundColor: 'transparent', borderRadius: 8, marginRight: 8, borderWidth: 1, borderColor: 'transparent' },
  catSelected: { backgroundColor: colors.primary },
  catText: { color: colors.text },
  catTextSelected: { color: '#fff', fontWeight: '700' },

  modalBackdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'center', alignItems: 'center' },
  modalCard: { width: 300, backgroundColor: colors.card, borderRadius: 12, padding: 12 },
  modalTitle: { fontWeight: '700', marginBottom: 8, color: colors.text },
  modalRow: { paddingVertical: 8 },
  modalRowSelected: { backgroundColor: 'rgba(0,0,0,0.03)', borderRadius: 6 },
  modalText: { color: colors.text },
  modalTextSelected: { color: colors.primary, fontWeight: '700' },
  modalClose: { marginTop: 12, alignItems: 'flex-end' },
  modalCloseText: { color: colors.primary, fontWeight: '700' },
});
