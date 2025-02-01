import React, { useContext } from 'react';
import { Button, StyleSheet } from 'react-native';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { AuthContext } from '../../../src/context/AuthContext';


export default function ReportsScreen() {

  const { signOut } = useContext(AuthContext);
  return (
    <>
      <ThemedView style={styles.container}>
        <ThemedText type="title">Reports Screen.</ThemedText>
         <Button title="Sair" onPress={signOut} />
      </ThemedView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  link: {
    marginTop: 15,
    paddingVertical: 15,
  },
});
