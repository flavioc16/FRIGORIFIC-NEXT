import { router } from 'expo-router';
import React from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import { useTheme } from '@/context/ThemeContext'; // Importando o ThemeContext

export default function ProfileScreen() {
  const { themeColor, themeMode } = useTheme(); // Consumindo o contexto do tema

  return (
    <View style={[styles.container, { backgroundColor: themeColor }]}>
      <Text style={[styles.title, { color: themeMode === 'dark' ? '#fff' : '#000' }]}>
        Perfil do Usuário
      </Text>
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
});
