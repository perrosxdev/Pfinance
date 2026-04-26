import AsyncStorage from '@react-native-async-storage/async-storage';

export async function load(key: string) {
  try {
    const json = await AsyncStorage.getItem(key);
    return json ? JSON.parse(json) : null;
  } catch (e) {
    console.error('Error loading', key, e);
    return null;
  }
}

export async function save(key: string, value: any) {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error('Error saving', key, e);
  }
}

export async function remove(key: string) {
  try {
    await AsyncStorage.removeItem(key);
  } catch (e) {
    console.error('Error removing', key, e);
  }
}
