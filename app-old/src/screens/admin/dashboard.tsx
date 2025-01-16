import React, { useContext } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';


import { AuthContext } from '@/src/context/AuthContext';
import { useTheme } from '../../context/ThemeContext';


export default function HomeScreen() {
 
  const { signOut , user} = useContext(AuthContext);
  const { themeColor, themeMode} = useTheme();

  return (
   
    <View style={[styles.container, { backgroundColor: themeColor }]}>

        <Text style={[styles.title, { color: themeMode === 'dark' ? '#fff' : '#000' }]}> Bem-vindo à Home do admin {user?.client?.[0]?.nome || 'Usuaário'}
          
        </Text>
        
        

        <Text style={[styles.title, { color: themeMode === 'dark' ? '#fff' : '#000' }]}>
          Tema atual: {themeMode === 'dark' ? 'Escuro' : 'Claro'}
        </Text>
        <Button title="Sair do app" onPress={() => signOut()} />
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
