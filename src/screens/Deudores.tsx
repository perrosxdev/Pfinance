import React, { useEffect, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { FlatList, TouchableOpacity, Alert, TextInput, View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { load, save } from '../storage/storage';
import { Debtor } from '../types';
import { useNavigation } from '@react-navigation/native';
import gstyles from '../styles/global';
import IconButton from '../components/IconButton';
import { formatCLP } from '../utils/format';

export default function Deudores() {
  const navigation = useNavigation();
  const [debtors, setDebtors] = useState<Debtor[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [nameInput, setNameInput] = useState('');

  useFocusEffect(
    React.useCallback(() => {
      let mounted = true;
      (async () => {
        const data = await load('deudores');
        if (data && mounted) setDebtors(data.map((d: any) => ({ ...d, debts: (d.debts || []).map((dd: any) => ({ ...dd, category: dd.category ?? 'Otros' })) })));
      })();
      return () => { mounted = false; };
    }, [])
  );

  const persist = async (list: Debtor[]) => {
    setDebtors(list);
    await save('deudores', list);
  };

  const totalFor = (d: Debtor) => d.debts.reduce((s, x) => s + x.amount, 0);

  const startAdd = () => { setEditingId(null); setNameInput(''); setShowForm(true); };

  const startEdit = (d: Debtor) => { setEditingId(d.id); setNameInput(d.name); setShowForm(true); };

  const onSave = async () => {
    if (!nameInput.trim()) return Alert.alert('Nombre requerido');
    if (editingId) {
      const updated = debtors.map(d => d.id === editingId ? { ...d, name: nameInput.trim() } : d);
      await persist(updated);
    } else {
      const newDebtor: Debtor = { id: Date.now().toString(), name: nameInput.trim(), debts: [] };
      await persist([newDebtor, ...debtors]);
    }
    setShowForm(false); setNameInput(''); setEditingId(null);
  };

  const deleteDebtor = (id: string) => {
    Alert.alert('Eliminar', 'Eliminar deudor y sus deudas?', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Eliminar', style: 'destructive', onPress: async () => await persist(debtors.filter(d => d.id !== id)) },
    ]);
  };

  const openDetail = (d: Debtor) => navigation.navigate('DeudorDetail', { debtorId: d.id });

  return (
    <SafeAreaView style={gstyles.container}>
      <View style={gstyles.headerRow}>
        <Text style={gstyles.titleLarge}>Deudores</Text>
        <TouchableOpacity style={gstyles.primaryButton} onPress={startAdd}><IconButton name="person-add" color="#fff" label="Nuevo" labelStyle={{ color: '#fff', fontWeight: '700' }} /></TouchableOpacity>
      </View>

      {showForm ? (
        <View style={gstyles.formCard}>
          <TextInput style={gstyles.input} placeholder="Nombre del deudor" value={nameInput} onChangeText={setNameInput} />
          <View style={gstyles.formActions}>
            <TouchableOpacity style={gstyles.buttonOutline} onPress={() => { setShowForm(false); setEditingId(null); setNameInput(''); }}><Text style={gstyles.buttonOutlineText}>Cancelar</Text></TouchableOpacity>
            <TouchableOpacity style={gstyles.button} onPress={onSave}><Text style={gstyles.buttonText}>{editingId ? 'Guardar' : 'Añadir'}</Text></TouchableOpacity>
          </View>
        </View>
      ) : null}

      <FlatList data={debtors} keyExtractor={d => d.id} style={{ width: '100%' }} renderItem={({ item }) => (
        <View style={gstyles.row}>
          <View style={{ flex: 1 }}>
            <Text style={gstyles.titleLarge}>{item.name}</Text>
            <Text style={gstyles.subText}>{formatCLP(totalFor(item))} — {item.debts.length} deuda(s)</Text>
          </View>
          <View style={gstyles.rowActions}>
            <TouchableOpacity style={gstyles.actionButton} onPress={() => openDetail(item)}><IconButton name="visibility" /></TouchableOpacity>
            <TouchableOpacity style={gstyles.actionButton} onPress={() => startEdit(item)}><IconButton name="edit" /></TouchableOpacity>
            <TouchableOpacity style={[gstyles.actionButton, { backgroundColor: '#ffd6d6' }]} onPress={() => deleteDebtor(item.id)}><IconButton name="delete" color={gstyles ? '#b00020' : '#b00020'} /></TouchableOpacity>
          </View>
        </View>
      )} ListEmptyComponent={<View style={{ padding: 20 }}><Text>No hay deudores todavía.</Text></View>} />
    </SafeAreaView>
  );
}
