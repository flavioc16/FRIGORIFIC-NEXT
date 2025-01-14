import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { FontAwesome } from '@expo/vector-icons'; // Biblioteca de ícones

import { useTheme } from '@/context/ThemeContext'; 

import Dashboard from '@/screens/admin/dashboard'; // Exemplo de página de Dashboard do Admin
import Settings from '@/screens/admin/settings'; // Exemplo de página de Configurações do Admin
import Profile from '@/screens/admin/profile'; // Exemplo de página de Perfil

export type StackParamList = {
  Dashboard: undefined;
  Settings: undefined;
  Profile: undefined;
}

const Stack = createBottomTabNavigator();

export default function AdminRoutes() {
  const { themeColor, themeMode } = useTheme(); // Pega o tema atual do contexto

  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: themeColor, // Usando diretamente a cor do tema
          borderBottomWidth: 0
        },
        headerTitleStyle: {
          color: themeMode === 'dark' ? '#fff' : '#000', // Usando uma cor de título dependendo do tema
        },
        tabBarActiveTintColor: '#e91e63', // Cor do ícone quando ativo
        tabBarInactiveTintColor: '#aaa', // Cor do ícone quando inativo
        tabBarStyle: {
          backgroundColor: themeMode === 'dark' ? '#222' : '#fff', // Usando a cor de fundo com base no tema
          borderTopWidth: 0, // Remove a borda superior da barra de navegação
         
        },
      }}
    >
      <Stack.Screen
        name="dashboard"
        component={Dashboard}
        options={{
          tabBarLabel: 'Dashboard', // Rótulo da aba
          tabBarIcon: ({ color, size }) => (
            <FontAwesome name="tachometer" size={size} color={color} /> // Ícone do Dashboard
          ),
          headerShown: false, // Exibe o cabeçalho apenas na tela Dashboard
        }}
      />
      <Stack.Screen
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
      <Stack.Screen
        name="profile"
        component={Profile}
        options={{
          tabBarLabel: 'Perfil', // Rótulo da aba
          tabBarIcon: ({ color, size }) => (
            <FontAwesome name="user" size={size} color={color} /> // Ícone de Perfil
          ),
          headerShown: true, // Exibe o cabeçalho apenas na tela Profile
        }}
      />
    </Stack.Navigator>
  );
}
