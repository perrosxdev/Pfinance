import React, { useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { load } from '../storage/storage';
import { lastNMonths } from '../utils/retention';
import { formatCLP } from '../utils/format';
import { colors } from '../styles/global';

export default function History() {
  const nav = useNavigation();
  const [months, setMonths] = useState<string[]>([]);
  const [totals, setTotals] = useState<any>({});

  useEffect(() => {
    (async () => {
      const last = lastNMonths(6);
      setMonths(last);
      const ingresos = await load('ingresos') || [];
      const gastos = await load('gastos') || [];
      const deudores = await load('deudores') || [];

      const t: any = {};
      last.forEach(m => { t[m] = { ingresos: 0, gastos: 0, deudas: 0 }; });

      ingresos.forEach((it: any) => { const ym = (it.date || '').slice(0,7); if (t[ym]) t[ym].ingresos += (it.amount||0); });
      gastos.forEach((it: any) => { const ym = (it.date || '').slice(0,7); if (t[ym]) t[ym].gastos += (it.amount||0); });
      (deudores||[]).forEach((d: any) => (d.debts||[]).forEach((dd: any) => { const ym = (dd.date||'').slice(0,7); if (t[ym]) t[ym].deudas += (dd.amount||0); }));

      setTotals(t);
    })();
  }, []);

  function label(m: string) {
    const [y, mm] = m.split('-');
    return new Date(Number(y), Number(mm)-1).toLocaleString('es-CL', { month: 'long', year: 'numeric' });
  }

  return (
    <SafeAreaView style={{ flex: 1, padding: 16, backgroundColor: colors.background }}>
      <Text style={{ fontSize: 20, fontWeight: '700', color: colors.text, marginBottom: 12 }}>Historial (últimos 6 meses)</Text>
      <FlatList
        data={months}
        keyExtractor={m => m}
        renderItem={({ item }) => (
          <View style={{ padding: 12, backgroundColor: '#fff', borderRadius: 10, marginBottom: 10 }}>
            <Text style={{ fontWeight: '700', color: colors.text }}>{label(item)}</Text>
            <Text style={{ color: colors.muted, marginTop: 6 }}>Ingresos: {formatCLP(totals[item]?.ingresos || 0)}</Text>
            <Text style={{ color: colors.muted }}>Gastos: {formatCLP(totals[item]?.gastos || 0)}</Text>
            <Text style={{ color: colors.muted }}>Deudas: {formatCLP(totals[item]?.deudas || 0)}</Text>
            <View style={{ flexDirection: 'row', marginTop: 8 }}>
              <TouchableOpacity style={{ marginRight: 8, padding: 8, backgroundColor: colors.primary, borderRadius: 8 }} onPress={() => nav.navigate('Ingresos', { month: item })}><Text style={{ color: '#fff' }}>Ver Ingresos</Text></TouchableOpacity>
              <TouchableOpacity style={{ padding: 8, backgroundColor: colors.primary, borderRadius: 8 }} onPress={() => nav.navigate('Gastos', { month: item })}><Text style={{ color: '#fff' }}>Ver Gastos</Text></TouchableOpacity>
            </View>
          </View>
        )}
      />
    </SafeAreaView>
  );
}
