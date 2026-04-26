import 'react-native-gesture-handler';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Home from './src/screens/Home';
import Ingresos from './src/screens/Ingresos';
import Gastos from './src/screens/Gastos';
import Deudores from './src/screens/Deudores';
import DeudorDetail from './src/screens/DebtorDetail';
import History from './src/screens/History';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
      <Stack.Navigator initialRouteName="Home" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="Ingresos" component={Ingresos} />
        <Stack.Screen name="Gastos" component={Gastos} />
        <Stack.Screen name="Deudores" component={Deudores} />
        <Stack.Screen name="DeudorDetail" component={DeudorDetail} />
        <Stack.Screen name="History" component={History} />
      </Stack.Navigator>
    </NavigationContainer>
    </SafeAreaProvider>
  );
}
