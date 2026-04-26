import React, { useEffect, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { View, Text, FlatList, TouchableOpacity, Alert, TextInput, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { load, save } from '../storage/storage';
import TransactionForm from '../components/TransactionForm';
import { Debtor, Debt } from '../types';
import { useRoute } from '@react-navigation/native';
import gstyles from '../styles/global';
import IconButton from '../components/IconButton';
import { formatCLP } from '../utils/format';
import FilterBar from '../components/FilterBar';
import { getYearMonth } from '../utils/retention';

export default function DeudorDetail() {
  const route: any = useRoute();
  const debtorId: string = route.params?.debtorId;
  const [debtors, setDebtors] = useState<Debtor[]>([]);
  const [debtor, setDebtor] = useState<Debtor | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingDebt, setEditingDebt] = useState<Debt | null>(null);
  const [search, setSearch] = useState('');
  const [txFilter, setTxFilter] = useState<{ month?: string }>({ month: new Date().toISOString().slice(0, 7) });

  useFocusEffect(
    React.useCallback(() => {
      let mounted = true;
      (async () => {
        const data = await load('deudores');
        if (data && mounted) {
          const normalized = data.map((d: any) => ({ ...d, debts: (d.debts || []).map((dd: any) => ({ ...dd, category: dd.category ?? 'Otros' })) }));
          setDebtors(normalized);
          const d = normalized.find((x: Debtor) => x.id === debtorId) || null;
          setDebtor(d);
        }
      })();
      return () => { mounted = false; };
    }, [debtorId])
  );

  const persist = async (list: Debtor[]) => {
    setDebtors(list);
    await save('deudores', list);
    const d = list.find(x => x.id === debtorId) || null;
    setDebtor(d);
  };

  const addOrEditDebt = async (data: { amount: number; date: string; note?: string; category?: string }) => {
    if (!debtor) return;
    if (editingDebt) {
      const updated = debtors.map(d => d.id === debtor.id ? { ...d, debts: d.debts.map(dd => dd.id === editingDebt.id ? { ...dd, amount: data.amount, date: data.date, note: data.note, category: data.category ?? dd.category } : dd) } : d);
      await persist(updated);
      setEditingDebt(null);
    } else {
      const newDebt: Debt = { id: Date.now().toString(), amount: data.amount, date: data.date, note: data.note, category: data.category ?? 'Otros' };
      const updated = debtors.map(d => d.id === debtor.id ? { ...d, debts: [newDebt, ...d.debts] } : d);
      await persist(updated);
    }
    setModalVisible(false);
  };

  const startEdit = (debt: Debt) => { setEditingDebt(debt); setModalVisible(true); };

  const deleteDebt = (id: string) => {
    if (!debtor) return;
    Alert.alert('Eliminar deuda', '¿Eliminar esta deuda?', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Eliminar', style: 'destructive', onPress: async () => { const updated = debtors.map(d => d.id === debtor.id ? { ...d, debts: d.debts.filter(dd => dd.id !== id) } : d); await persist(updated); } },
    ]);
  };

  const filtered = debtor ? debtor.debts.filter(dd => {
    if (!dd) return false;
    if (txFilter.month) {
      const ym = getYearMonth(dd.date);
      if (ym !== txFilter.month) return false;
    }
    if (!search) return true;
    return (dd.note || '').toLowerCase().includes(search.toLowerCase()) || dd.date.includes(search);
  }) : [];

  const total = debtor ? debtor.debts.reduce((s, x) => s + x.amount, 0) : 0;

  return (
    <SafeAreaView style={gstyles.container}>
      <View style={gstyles.headerCard}>
        <Text style={gstyles.titleLarge}>{debtor?.name ?? 'Deudor'}</Text>
        <Text style={gstyles.total}>{formatCLP(total)}</Text>
      </View>

      <FilterBar onChange={(f) => setTxFilter({ month: f.month })} initialMonth={txFilter.month} showCategory={true} />

      <View style={gstyles.filterRow}>
        <TextInput style={gstyles.input} placeholder="Filtrar por nota o fecha" value={search} onChangeText={setSearch} />
        <TouchableOpacity style={gstyles.primaryButton} onPress={() => { setEditingDebt(null); setModalVisible(true); }}><IconButton name="add" color="#fff" label="Añadir deuda" labelStyle={{ color: '#fff', fontWeight: '700' }} /></TouchableOpacity>
      </View>

      <ScrollView horizontal contentContainerStyle={{ minWidth: 700 }}>
        <View style={{ width: '100%' }}>
          <FlatList data={filtered} keyExtractor={d => d.id} style={{ width: '100%' }} renderItem={({ item }) => (
            <View style={gstyles.row}>
              <View style={{ flex: 1 }}>
                <Text style={gstyles.debtAmount}>{formatCLP(item.amount)}</Text>
                <Text style={gstyles.subText}>{item.date} — {item.note} {item.category ? `— ${item.category}` : ''}</Text>
              </View>
              <View style={gstyles.rowActions}>
                <TouchableOpacity style={gstyles.actionButton} onPress={() => startEdit(item)}><IconButton name="edit" /></TouchableOpacity>
                <TouchableOpacity style={[gstyles.actionButton, { backgroundColor: '#ffd6d6' }]} onPress={() => deleteDebt(item.id)}><IconButton name="delete" color="#b00020" /></TouchableOpacity>
              </View>
            </View>
          )} ListEmptyComponent={<View style={{ padding: 20 }}><Text>No hay deudas.</Text></View>} />
        </View>
      </ScrollView>

      <TransactionForm visible={modalVisible} onClose={() => { setModalVisible(false); setEditingDebt(null); }} onSubmit={addOrEditDebt} initialData={editingDebt ?? null} title={editingDebt ? 'Editar deuda' : 'Nueva deuda'} />
    </SafeAreaView>
  );
}
