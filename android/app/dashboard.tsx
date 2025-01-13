import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';


export default function Dashboard() {
  const router = useRouter();

  return (

      <View style={styles.container}>
        <Text style={styles.title}>Bem-vindo ao Dashboard!</Text>
        <Button title="Login" onPress={() => router.replace('/')} />
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
