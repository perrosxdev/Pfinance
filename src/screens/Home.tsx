import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import IconButton from '../components/IconButton';
import styles from './Home.styles';

type RootStackParamList = {
	Home: undefined;
	Ingresos: undefined;
	Gastos: undefined;
	Deudores: undefined;
	History: undefined;
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'Home'>;

export default function Home() {
	const navigation = useNavigation<NavigationProp>();
	return (
		<SafeAreaView style={styles.container}>
			<Text style={styles.title}>Pantalla principal</Text>
			<View style={styles.buttonWrap}>
				<TouchableOpacity style={styles.homeButton} onPress={() => navigation.navigate('Ingresos')}>
					<IconButton name="attach-money" size={28} label="Ingresos" labelStyle={styles.homeLabel} />
				</TouchableOpacity>
			</View>
			<View style={styles.buttonWrap}>
				<TouchableOpacity style={styles.homeButton} onPress={() => navigation.navigate('Gastos')}>
					<IconButton name="money-off" size={28} label="Gastos" labelStyle={styles.homeLabel} />
				</TouchableOpacity>
			</View>
			<View style={styles.buttonWrap}>
				<TouchableOpacity style={styles.homeButton} onPress={() => navigation.navigate('Deudores')}>
					<IconButton name="groups" size={28} label="Deudores" labelStyle={styles.homeLabel} />
				</TouchableOpacity>
			</View>
			<View style={styles.buttonWrap}>
				<TouchableOpacity style={styles.homeButton} onPress={() => navigation.navigate('History')}>
					<IconButton name="history" size={28} label="Historial" labelStyle={styles.homeLabel} />
				</TouchableOpacity>
			</View>
		</SafeAreaView>
	);
}

