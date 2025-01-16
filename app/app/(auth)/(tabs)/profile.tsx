import React, { useContext } from 'react';
import { StyleSheet, Button } from 'react-native';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { AuthContext } from '../../../src/context/AuthContext'; // Certifique-se de ajustar o caminho

export default function ProfileScreen() {
  // Use useContext para acessar o AuthContext
  const { signOut } = useContext(AuthContext);

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title">Profile Screen</ThemedText>
      <Button title="Sair" onPress={signOut} />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
});
