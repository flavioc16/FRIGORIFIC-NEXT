import { StyleSheet, View, Image } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useColorScheme } from '@/hooks/useColorScheme'; // Hook personalizado para tema
import { AuthContext } from '../../../src/context/AuthContext';
import { useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ThemedClientItem from '../../../components/ThemedClientItem'; // Importando a lista de clientes

export default function TabTwoScreen() {
  const { user } = useContext(AuthContext);
  const [currentUser, setCurrentUser] = useState<any>(null);

  const colorScheme = useColorScheme(); // Obter o tema atual

  const headerImageSource =
    colorScheme === 'dark'
      ? require('../../../assets/images/LOGO-VERMELHO-E-BRANCA.png') // Imagem para tema escuro
      : require('../../../assets/images/LOGO-TODA-VERMELHA.png'); // Imagem para tema claro

  useEffect(() => {
    const fetchUser = async () => {
      const userFromStorage = await AsyncStorage.getItem('@frigorifico');
      if (userFromStorage) {
        setCurrentUser(JSON.parse(userFromStorage));
      } else {
        setCurrentUser(user);
      }
    };

    fetchUser();
  }, [user]);

  return (
    <ThemedView style={styles.container}>
      <ThemedClientItem />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  headerImage: {
    marginTop: 55,
    width: '90%',
    height: 140,
    alignSelf: 'center',
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderBottomEndRadius: 10,
  },
});
