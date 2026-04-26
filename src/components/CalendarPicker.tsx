import React, { useMemo, useState } from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { colors } from '../styles/global';

type Props = {
  visible: boolean;
  onClose: () => void;
  initialDate?: string; // YYYY-MM-DD
  onSelect: (date: string) => void;
};

function pad(n: number) { return n < 10 ? `0${n}` : `${n}`; }

export default function CalendarPicker({ visible, onClose, initialDate, onSelect }: Props) {
  const today = useMemo(() => new Date(), []);
  const init = useMemo(() => {
    if (!initialDate) return today;
    const parts = String(initialDate).split('-').map(p => parseInt(p, 10));
    if (parts.length >= 3) return new Date(parts[0], parts[1] - 1, parts[2]);
    return today;
  }, [initialDate, today]);

  const [year, setYear] = useState(init.getFullYear());
  const [month, setMonth] = useState(init.getMonth());
  const [selected, setSelected] = useState(init.getDate());

  const monthLabel = useMemo(() => new Date(year, month).toLocaleString('es-CL', { month: 'long', year: 'numeric' }), [year, month]);

  const daysInMonth = useMemo(() => new Date(year, month + 1, 0).getDate(), [year, month]);
  const firstDay = useMemo(() => new Date(year, month, 1).getDay(), [year, month]);

  const days: Array<(number | null)> = [];
  for (let i = 0; i < firstDay; i++) days.push(null);
  for (let d = 1; d <= daysInMonth; d++) days.push(d);

  function selectDay(d: number | null) {
    if (!d) return;
    setSelected(d);
    const dateStr = `${year}-${pad(month + 1)}-${pad(d)}`;
    onSelect(dateStr);
    onClose();
  }

  function prevMonth() {
    if (month === 0) { setMonth(11); setYear(y => y - 1); } else setMonth(m => m - 1);
  }
  function nextMonth() {
    if (month === 11) { setMonth(0); setYear(y => y + 1); } else setMonth(m => m + 1);
  }

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={s.backdrop}>
        <View style={s.card}>
          <View style={s.header}>
            <TouchableOpacity onPress={prevMonth} style={s.navBtn}><Text style={s.navText}>{'<'}</Text></TouchableOpacity>
            <Text style={s.monthLabel}>{monthLabel}</Text>
            <TouchableOpacity onPress={nextMonth} style={s.navBtn}><Text style={s.navText}>{'>'}</Text></TouchableOpacity>
          </View>

          <View style={s.weekRow}>
            {['Dom','Lun','Mar','Mié','Jue','Vie','Sáb'].map(w => <Text key={w} style={s.weekText}>{w}</Text>)}
          </View>

          <View style={s.grid}>
            {days.map((d, idx) => (
              <TouchableOpacity key={idx} style={[s.cell, d === selected ? s.cellSelected : null]} onPress={() => selectDay(d)}>
                <Text style={[s.cellText, d === selected ? s.cellTextSelected : null]}>{d ? String(d) : ''}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={s.footerRow}>
            <TouchableOpacity onPress={onClose} style={s.closeBtn}><Text style={s.closeText}>Cerrar</Text></TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const s = StyleSheet.create({
  backdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'center', alignItems: 'center' },
  card: { width: 320, backgroundColor: colors.card, borderRadius: 12, padding: 12 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 },
  navBtn: { padding: 8 },
  navText: { fontSize: 18, color: colors.text },
  monthLabel: { fontSize: 16, fontWeight: '700', color: colors.text },
  weekRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 6 },
  weekText: { width: 36, textAlign: 'center', color: colors.muted, fontSize: 12 },
  grid: { flexDirection: 'row', flexWrap: 'wrap' },
  cell: { width: 36, height: 36, alignItems: 'center', justifyContent: 'center', margin: 4, borderRadius: 6 },
  cellSelected: { backgroundColor: colors.primary },
  cellText: { color: colors.text },
  cellTextSelected: { color: colors.white, fontWeight: '700' },
  footerRow: { marginTop: 8, alignItems: 'flex-end' },
  closeBtn: { padding: 8 },
  closeText: { color: colors.primary, fontWeight: '700' },
});
