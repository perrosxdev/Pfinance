import React, { useEffect, useState } from 'react';
import { useFocusEffect, useRoute } from '@react-navigation/native';
import { View, Text, FlatList, Alert, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { load, save } from '../storage/storage';
import TransactionForm from '../components/TransactionForm';
import FilterBar from '../components/FilterBar';
import { pruneTransactionsToLastNMonths, lastNMonths } from '../utils/retention';
import { Transaction } from '../types';
import gstyles from '../styles/global';
import { formatCLP } from '../utils/format';
import IconButton from '../components/IconButton';

// use CLP formatting

export default function Ingresos() {
  const [items, setItems] = useState<Transaction[]>([]);
  const [filter, setFilter] = useState<{ month?: string; category?: string }>({ month: new Date().toISOString().slice(0, 7) });
  const [modalVisible, setModalVisible] = useState(false);
  const [editing, setEditing] = useState<Transaction | null>(null);
  const route: any = useRoute();

  useFocusEffect(
    React.useCallback(() => {
      let mounted = true;
      (async () => {
        const data = await load('ingresos');
        if (data && mounted) setItems(data.map((i: any) => ({ ...i, category: i.category ?? 'Otros' })));
      })();
      return () => { mounted = false; };
    }, [])
  );

  useEffect(() => {
    // allow navigation param to set month filter (from History screen)
    if ((route?.params as any)?.month) {
      setFilter({ month: (route as any).params.month });
    }
  }, [route?.params]);

  const persist = async (newItems: Transaction[]) => {
    // prune to last 6 months before saving
    const pruned = pruneTransactionsToLastNMonths(newItems, 'date', 6);
    setItems(pruned);
    await save('ingresos', pruned);
  };

  const handleSubmit = async (data: { amount: number; date: string; note?: string; category?: string }) => {
    if (editing) {
      const updated = items.map(i => (i.id === editing.id ? { ...i, amount: data.amount, date: data.date, note: data.note, category: data.category ?? i.category } : i));
      await persist(updated);
      setEditing(null);
    } else {
      const item: Transaction = { id: Date.now().toString(), amount: data.amount, date: data.date, note: data.note, category: data.category ?? 'Otros' };
      await persist([item, ...items]);
    }
    setModalVisible(false);
  };

  const handleEdit = (item: Transaction) => {
    setEditing(item);
    setModalVisible(true);
  };

  const handleDelete = (id: string) => {
    Alert.alert('Eliminar ingreso', '¿Deseas eliminar este ingreso?', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Eliminar', style: 'destructive', onPress: async () => await persist(items.filter(i => i.id !== id)) },
    ]);
  };

  const total = items.reduce((s, i) => s + (i.amount || 0), 0);

  const filteredItems = items.filter(item => {
    if (!item) return false;
    const ym = item.date ? item.date.slice(0, 7) : '';
    if (filter.month && ym !== filter.month) return false;
    if (filter.category && filter.category !== '') {
      if ((item.category ?? 'Otros') !== filter.category) return false;
    }
    return true;
  });

  return (
    <SafeAreaView style={gstyles.container}>
      <View style={gstyles.headerCard}>
        <Text style={gstyles.headerText}>Total Ingresos</Text>
        <Text style={gstyles.total}>{formatCLP(total)}</Text>
      </View>
      <View style={gstyles.actions}>
        <TouchableOpacity style={gstyles.primaryButton} onPress={() => { setEditing(null); setModalVisible(true); }}>
          <IconButton name="add" color="#fff" size={18} label="Nuevo ingreso" labelStyle={{ color: '#fff', fontWeight: '700' }} />
        </TouchableOpacity>
      </View>

      <FilterBar onChange={(f) => setFilter(f)} initialMonth={filter.month} />

      <ScrollView horizontal contentContainerStyle={{ minWidth: 700 }}>
        <View style={gstyles.tableWrapper}>
          <View style={gstyles.tableHeader}>
            <Text style={[gstyles.colBase, gstyles.colAmount, gstyles.tableHeaderText]}>Monto</Text>
            <Text style={[gstyles.colBase, gstyles.colCategory, gstyles.tableHeaderText]}>Categoría</Text>
            <Text style={[gstyles.colBase, gstyles.colDate, gstyles.tableHeaderText]}>Fecha</Text>
            <Text style={[gstyles.colBase, gstyles.colNote, gstyles.tableHeaderText]}>Nota</Text>
            <Text style={[gstyles.colBase, gstyles.colActions, gstyles.tableHeaderText]}>Acciones</Text>
          </View>

          <FlatList
            data={filteredItems}
            keyExtractor={i => i.id}
            style={{ width: '100%' }}
            contentContainerStyle={{ paddingBottom: 120 }}
            renderItem={({ item }) => (
              <View style={gstyles.row}>
                <Text style={[gstyles.colBase, gstyles.colAmount, gstyles.tableCellText]}>{formatCLP(item.amount)}</Text>
                <Text style={[gstyles.colBase, gstyles.colCategory, gstyles.tableCellText]}>{item.category ?? 'Otros'}</Text>
                <Text style={[gstyles.colBase, gstyles.colDate, gstyles.tableCellText]}>{item.date}</Text>
                <Text style={[gstyles.colBase, gstyles.colNote, gstyles.tableCellText]} numberOfLines={1}>{item.note}</Text>
                <View style={[gstyles.colBase, gstyles.colActions, gstyles.rowActions]}>
                  <TouchableOpacity onPress={() => handleEdit(item)} style={gstyles.actionButton}>
                    <IconButton name="edit" />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => handleDelete(item.id)} style={[gstyles.actionButton, { backgroundColor: '#ffd6d6' }]}>
                    <IconButton name="delete" color="#b00020" />
                  </TouchableOpacity>
                </View>
              </View>
            )}
            ListEmptyComponent={<View style={{ padding: 20 }}><Text>No hay ingresos registrados.</Text></View>}
          />
        </View>
      </ScrollView>

      <TransactionForm visible={modalVisible} onClose={() => { setModalVisible(false); setEditing(null); }} onSubmit={handleSubmit} initialData={editing} title={editing ? 'Editar ingreso' : 'Nuevo ingreso'} />
    </SafeAreaView>
  );
}
