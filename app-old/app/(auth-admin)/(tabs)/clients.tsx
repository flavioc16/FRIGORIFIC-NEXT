import React from 'react';
import { StyleSheet } from 'react-native';
import { ThemedView } from '@/components/ThemedView';
import ThemedClientItem from '@/src/components/clients/ThemedClientItem';

export default function ClientsScreen() {

  return (
    <>
      <ThemedView style={styles.container}>
         <ThemedClientItem />
      </ThemedView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  link: {
    marginTop: 15,
    paddingVertical: 15,
  },
});
