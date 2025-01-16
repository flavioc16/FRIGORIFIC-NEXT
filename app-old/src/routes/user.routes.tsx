import React, { useEffect, useState } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { FontAwesome } from '@expo/vector-icons'; 
import { TouchableOpacity, View, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import * as SplashScreen from 'expo-splash-screen'; // Importando SplashScreen

import Inicio from '../../src/screens/user/dashboard';
import Settings from '../../src/screens/user/settings';
import Profile from '../../src/screens/user/profile';
import { useTheme } from '../context/ThemeContext';

export type StackParamList = {
  Inicio: undefined;
  Settings: undefined;
  Profile: undefined;
};

const Stack = createBottomTabNavigator<StackParamList>();

export default function UserRoutes() {
  const navigation = useNavigation();
  const { themeColor, themeMode } = useTheme();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    async function prepare() {
      try {
        // Impede que a tela de splash desapareça automaticamente
        await SplashScreen.preventAutoHideAsync();

        // Simula um carregamento ou inicialização, substitua por seu código real
        await new Promise(resolve => setTimeout(resolve, 2000));

        // Após o carregamento, marca a tela como pronta
        setIsReady(true);
      } catch (e) {
        console.warn(e);
      } finally {
        if (isReady) {
          SplashScreen.hideAsync(); // Oculta a tela de splash
        }
      }
    }

    prepare();
  }, [isReady]);

  if (!isReady) {
    return null; // Ou você pode retornar um componente de carregamento
  }

  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: themeColor,
          borderBottomWidth: 0,
        },
        headerTitleStyle: {
          color: themeMode === 'dark' ? '#fff' : '#000',
        },
        tabBarActiveTintColor: '#e91e63',
        tabBarInactiveTintColor: '#aaa',
        tabBarStyle: {
          backgroundColor: themeMode === 'dark' ? '#222' : '#fff',
          borderTopWidth: 0,
          borderBottomWidth: 0,
        },
      }}
    >
      <Stack.Screen
        name="Inicio"
        component={Inicio}
        options={{
          tabBarLabel: 'Inicio',
          tabBarIcon: ({ color, size }) => (
            <FontAwesome name="tachometer" size={size} color={color} />
          ),
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="Settings"
        component={Settings}
        options={{
          tabBarLabel: 'Configurações',
          tabBarIcon: ({ color, size }) => (
            <FontAwesome name="cogs" size={size} color={color} />
          ),
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="Profile"
        component={Profile}
        options={{
          tabBarLabel: 'Perfil',
          tabBarIcon: ({ color, size }) => (
            <FontAwesome name="user" size={size} color={color} />
          ),
          headerShown: true,
        }}
      />
    </Stack.Navigator>
  );
}
