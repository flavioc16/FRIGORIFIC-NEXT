import { router } from 'expo-router';
import React, { useContext } from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { AuthContext } from '@/src/context/AuthContext'; 
export default function ProfileScreen() {
  const { themeColor, themeMode } = useTheme();
  const { signOut, user } = useContext(AuthContext); 

  return (
    <View style={[styles.container, { backgroundColor: themeColor }]}>
      <Text style={[styles.title, { color: themeMode === 'dark' ? '#fff' : '#000' }]}>
        Perfil do Usuário
      </Text>
      <View style={styles.bottomSection}>
              <Button title="Sair do app" onPress={() => signOut()} />
            </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  bottomSection: {
    flex: 1,
    justifyContent: 'flex-end', // Mantém o botão na parte inferior
    alignItems: 'center',
    marginBottom: 32, // Espaço extra na parte inferior
  },
});
