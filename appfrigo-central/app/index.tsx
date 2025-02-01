import React from 'react';
import { StyleSheet, ActivityIndicator } from 'react-native';

import { ThemedView } from '@/components/ThemedView';

export default function IndexScreen() {
  return (
    <ThemedView style={styles.container}>
      <ActivityIndicator size="large" color="#ae2121" />
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
