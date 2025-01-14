import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { FontAwesome } from '@expo/vector-icons'; // Biblioteca de ícones
import { TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native'; // Para navegar

import Dashboard from '@/screens/user/dashboard';
import Settings from '@/screens/user/settings';
import Profile from '@/screens/user/profile';
import { useTheme } from '@/context/ThemeContext';

export type StackParamList = {
  Dashboard: undefined;
  Settings: undefined;
  Profile: undefined;
};

const Stack = createBottomTabNavigator<StackParamList>();

export default function UserRoutes() {
  const navigation = useNavigation();
  const { themeColor, themeMode } = useTheme(); 

  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: themeColor, // Cor de fundo do cabeçalho
          borderBottomWidth: 0,
        },
        headerTitleStyle: {
          color: themeMode === 'dark' ? '#fff' : '#000',
        },
        tabBarActiveTintColor: '#e91e63', // Cor do ícone quando ativo
        tabBarInactiveTintColor: '#aaa', // Cor do ícone quando inativo
        tabBarStyle: {
          backgroundColor: themeMode === 'dark' ? '#222' : '#fff', 
          borderTopWidth: 0, // Remove a borda superior da barra de navegação
          borderBottomWidth: 0
        },
      }}
    >
      <Stack.Screen
        name="Dashboard"
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
      <Stack.Screen
        name="Settings"
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
        name="Profile"
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
    </Stack.Navigator>
  );
}
