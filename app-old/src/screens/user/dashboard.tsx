import React, { useContext } from 'react';
import { View, Image, StyleSheet, TouchableOpacity, Text, SafeAreaView } from 'react-native';
import { FontAwesome } from '@expo/vector-icons'; // Ícones do FontAwesome
import { AuthContext } from '@/src/context/AuthContext';
import { useTheme } from '../../context/ThemeContext';

export default function HomeScreen() {
  const { themeColor, themeMode } = useTheme();
  const { user } = useContext(AuthContext);

  return (
    <SafeAreaView style={[styles.container]}>
      {/* Barra superior com logo e botão */}
      <View style={styles.topBar}>
        <Image 
          source={require('../../../assets/images/LOGOVERTICAL.png')} // Atualize para o caminho correto da sua logo
          style={styles.logo}
          resizeMode="contain"
        />
        <TouchableOpacity onPress={() => console.log('Notificação clicada')}>
          <FontAwesome 
            name="bell" // Ícone de notificação
            size={24} 
            color={themeMode === 'dark' ? '#fff' : '#fff'}
          />
        </TouchableOpacity>
      </View>

      <View style={[styles.bodyContentInfo, { backgroundColor: themeMode === 'dark' ? '#333' : '#f1f1f5' }]}>
        <Text style={[styles.textName, { color: themeMode === 'dark' ? '#fff' : '#000' }]}>
          Olá, {user?.client?.[0]?.nome || 'Usuário'}!
        </Text>
      </View>
      <View style={[styles.bodyContentPurchases, { backgroundColor: themeMode === 'dark' ? '#333' : '#f5f5f5' }]}>
        
      </View>
      <View style={[styles.bottomContent, { backgroundColor: themeMode === 'dark' ? '#333' : '#f5f5f5' }]}>
       

      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1, // Ocupa toda a altura da tela
    backgroundColor: '#0d0f16',
  },
  topBar: {
    flexDirection: 'row', // Organiza os itens em linha
    justifyContent: 'space-between', // Espaça os itens nos cantos
    alignItems: 'center', // Alinha verticalmente
    paddingHorizontal: 16, // Espaço nas laterais
    paddingVertical: 10, // Espaço vertical
    marginBottom: 10, // Margem para separar do topo
    
  },
  logo: {
    width: 120, // Largura da logo
    height: 50, // Altura da logo
  },
  bodyContentInfo: {
    borderTopLeftRadius: 20, 
    borderTopRightRadius: 20,
    flex: 1, // Ocupa o espaço restante da tela
    marginTop: 10, // Margem para separar do topo
    padding: 16, // Espaçamento interno
    borderBottomColor: '#f1f1f5', // Cor da borda superior
    borderBottomWidth: 2,
  },
  bodyContentPurchases: {
    flex: 1, // Ocupa o espaço restante da tela
  
    padding: 16, // Espaçamento interno
    borderBottomColor: '#f1f1f5', // Cor da borda superior
    borderBottomWidth: 2,
  },
  bottomContent: {
    flex: 1, // Ocupa o espaço restante da tela
    padding: 16, // Espaçamento interno
  },
  textName: {
    fontSize: 18,
    marginBottom: 8,
    fontWeight: 'bold',
    fontFamily: 'Poppins_500Medium',
  },
});
