import React, { useEffect, useState } from 'react';
import { Modal, View, Text, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import styles from './TransactionForm.styles';
import { formatNumberInput, parseNumberFromFormatted } from '../utils/format';
import CalendarPicker from './CalendarPicker';

type Props = {
  visible: boolean;
  onClose: () => void;
  onSubmit: (data: { amount: number; date: string; note?: string; category?: string }) => void;
  initialData?: { amount?: number; date?: string; note?: string; category?: string } | null;
  title?: string;
};

const CATEGORIES = ['Comida', 'Limpieza', 'Tecnologias', 'Transporte', 'Salud', 'Extras', 'Otros'];

export default function TransactionForm({ visible, onClose, onSubmit, initialData = null, title = 'Formulario' }: Props) {
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState('');
  const [note, setNote] = useState('');
  const [category, setCategory] = useState('');
  const [showCalendar, setShowCalendar] = useState(false);
  const [showCategories, setShowCategories] = useState(false);
  const [focusedField, setFocusedField] = useState<'amount'|'date'|'category'|'note'|null>(null);

  useEffect(() => {
    if (visible) {
      setAmount(initialData?.amount != null ? formatNumberInput(initialData.amount) : '');
      setDate(initialData?.date ?? new Date().toISOString().split('T')[0]);
      setNote(initialData?.note ?? '');
      setCategory(initialData?.category ?? '');
      setShowCategories(false);
      setFocusedField('amount');
    } else {
      setFocusedField(null);
    }
  }, [visible, initialData]);

  function handleSubmit() {
    const amt = parseNumberFromFormatted(amount) || 0;
    onSubmit({ amount: amt, date, note, category });
    setFocusedField(null);
  }

  const instructionMap: Record<string, string> = {
    amount: 'Ingresa el monto (separador de miles aplicado automáticamente)',
    date: 'Selecciona la fecha desde el calendario',
    category: 'Selecciona la categoría',
    note: 'Agrega una nota (opcional)',
  };
  const instructionText = focusedField ? instructionMap[focusedField] : '';

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View style={styles.backdrop}>
        <View style={styles.modal}>
          <Text style={styles.title}>{title}</Text>
          {instructionText ? <Text style={styles.instructionText}>{instructionText}</Text> : null}
          <TextInput
            style={styles.input}
            placeholder="Monto (CLP)"
            keyboardType="numeric"
            value={amount}
            onChangeText={text => setAmount(formatNumberInput(text))}
            onFocus={() => setFocusedField('amount')}
          />

          <TouchableOpacity style={[styles.input, { justifyContent: 'center' }]} onPress={() => { setFocusedField('date'); setShowCalendar(true); }}>
            <Text style={{ color: date ? undefined : '#888' }}>{date || 'Fecha (tocar para seleccionar)'}</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.input, { justifyContent: 'center' }]} onPress={() => { setFocusedField('category'); setShowCategories(v => !v); }}>
            <Text style={{ color: category ? undefined : '#888' }}>{category || 'Selecciona categoría'}</Text>
          </TouchableOpacity>

          {showCategories ? (
            <ScrollView style={{ maxHeight: 140, marginBottom: 8 }}>
              {CATEGORIES.map(c => (
                <TouchableOpacity key={c} style={{ padding: 10, backgroundColor: c === category ? '#fff6f0' : 'transparent', borderRadius: 8 }} onPress={() => { setCategory(c); setShowCategories(false); }}>
                  <Text style={{ color: c === category ? '#000' : '#333', fontWeight: c === category ? '700' : '400' }}>{c}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          ) : null}

          <TextInput style={styles.input} placeholder="Nota (opcional)" value={note} onChangeText={setNote} onFocus={() => setFocusedField('note')} />
          <View style={styles.row}>
            <TouchableOpacity style={styles.buttonOutline} onPress={onClose}>
              <Text style={styles.buttonOutlineText}>Cancelar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={handleSubmit}>
              <Text style={styles.buttonText}>Guardar</Text>
            </TouchableOpacity>
          </View>

          <CalendarPicker visible={showCalendar} initialDate={date} onSelect={(d) => setDate(d)} onClose={() => setShowCalendar(false)} />
        </View>
      </View>
    </Modal>
  );
}
