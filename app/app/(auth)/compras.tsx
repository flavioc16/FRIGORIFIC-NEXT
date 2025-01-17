import { ThemedView } from '@/components/ThemedView';
import { useRouter } from 'expo-router';
import React from 'react';
import { View, Text, Button, StyleSheet, ScrollView } from 'react-native';

export default function DetailsScreen() {
  const router = useRouter();

  return (
    <ThemedView style={styles.container}>
      <ScrollView 
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>Trazer as compras aqui</Text>
        <Text style={styles.text}>
          Esta é uma tela sem Tabs e com o botão Voltar. Adicione aqui mais conteúdo para ver o efeito de rolagem.
        </Text>
        <Button title="Voltar" onPress={() => router.back()} />
      </ScrollView>
      {/* Rodapé */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>© 2025 Minha Aplicação</Text>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 20,
  },
  title: {
    color: '#333',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  text: {
    color: '#666',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
  footer: {
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
    borderTopWidth: 1,
  },
  footerText: {
    fontSize: 14,
    color: '#808080',
  },
});
