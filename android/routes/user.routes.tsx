import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { FontAwesome } from '@expo/vector-icons'; // Biblioteca de ícones
import { TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native'; // Para navegar

import Dashboard from '@/screens/user/dashboard';
import Settings from '@/screens/user/settings';
import Profile from '@/screens/user/profile';

const Tab = createBottomTabNavigator();

export default function UserRoutes() {
  const navigation = useNavigation();

  return (
    <Tab.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: '#222', // Cor de fundo do cabeçalho
          borderBottomWidth: 0
        },
        headerTitleStyle: {
          color: '#fff', // Cor do título
        },
        tabBarActiveTintColor: '#e91e63', // Cor do ícone quando ativo
        tabBarInactiveTintColor: '#aaa', // Cor do ícone quando inativo
        tabBarStyle: {
          backgroundColor: '#222', // Cor de fundo da barra de navegação
          borderTopWidth: 0, // Remove a borda superior da barra de navegação
          borderBottomWidth: 0
        },
      }}
    >
      <Tab.Screen
        name="dashboard"
        component={Dashboard}
        options={{
          tabBarLabel: 'Dashboard', // Rótulo da aba
          tabBarIcon: ({ color, size }) => (
            <FontAwesome name="tachometer" size={size} color={color} /> // Ícone do Dashboard
          ),
          headerShown: false, // Exibe o cabeçalho na tela Dashboard
          headerLeft: () => (
            <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginLeft: 10 }}>
              <FontAwesome name="arrow-left" size={24} color="#fff" />
            </TouchableOpacity>
          ), // Seta de voltar
        }}
      />
      <Tab.Screen
        name="settings"
        component={Settings}
        options={{
          tabBarLabel: 'Configurações', // Rótulo da aba
          tabBarIcon: ({ color, size }) => (
            <FontAwesome name="cogs" size={size} color={color} /> // Ícone de Configurações
          ),
          headerShown: false, // Não exibe cabeçalho na tela Settings
        }}
      />
      <Tab.Screen
        name="profile"
        component={Profile}
        options={{
          tabBarLabel: 'Perfil', // Rótulo da aba
          tabBarIcon: ({ color, size }) => (
            <FontAwesome name="user" size={size} color={color} /> // Ícone de Perfil
          ),
          headerShown: true, // Exibe o cabeçalho na tela Profile
          headerLeft: () => (
            <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginLeft: 10 }}>
              <FontAwesome name="arrow-left" size={24} color="#fff" />
            </TouchableOpacity>
          ), // Seta de voltar
        }}
      />
    </Tab.Navigator>
  );
}
