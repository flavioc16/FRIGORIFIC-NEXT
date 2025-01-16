import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { useTheme } from '../../context/ThemeContext'; // Caso você queira usar o tema

export default function Settings() {
  const { themeColor, themeMode, toggleTheme } = useTheme(); // Acesso ao tema

  return (
     <View style={[styles.container, { backgroundColor: themeColor }]}>
      <Text style={[styles.title, { color: themeMode === 'dark' ? '#fff' : '#000' }]}>
        Configurações do usuário
        </Text>
        <Text style={[styles.title, { color: themeMode === 'dark' ? '#fff' : '#000' }]}>
                Tema atual: {themeMode === 'dark' ? 'Escuro' : 'Claro'}
        </Text>
      
      <Button title="Alternar Tema" onPress={toggleTheme} />
      {/* Você pode adicionar outras configurações aqui */}
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
  subtitle: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 16,
  },
});
