import { Tabs } from 'expo-router';
import React from 'react';
import { Platform } from 'react-native';

import { HapticTab } from '@/components/HapticTab';
import { useColorScheme } from '@/hooks/useColorScheme';
import TabBarBackground from '@/components/ui/TabBarBackground';
import { Colors } from '@/constants/Colors';
// Importando ícones do lucide-react-native
import { House, User, ScanBarcode, Bell, CalendarCheck, HandCoins } from 'lucide-react-native';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarBackground: TabBarBackground,
        tabBarStyle: Platform.select({
          ios: {
            position: 'absolute',
          },
          default: {},
        }),
      }}>
      <Tabs.Screen
        name="home"
        options={{
          title: 'Inicio',
          tabBarIcon: ({ color, size }) => (
            <House size={size} color={color} /> 
          ),
        }}
      />
      <Tabs.Screen
        name="clients"
        options={{
          title: 'Cliente',
          tabBarIcon: ({ color, size }) => (
            <User size={size} color={color} /> 
          ),
        }}
      />
      <Tabs.Screen
        name="products"
        options={{
          title: 'Produto',
          tabBarIcon: ({ color, size }) => (
            <ScanBarcode size={size} color={color} /> 
          ),
        }}
      />
      <Tabs.Screen
        name="reminders"
        options={{
          title: 'Lembrete',
          tabBarIcon: ({ color, size }) => (
            <Bell size={size} color={color} /> 
          ),
        }}
      />
   
      <Tabs.Screen
        name="reports"
        options={{
          title: 'Relatório',
          tabBarIcon: ({ color, size }) => (
            <CalendarCheck size={size} color={color} /> 
          ),
        }}
      />
      <Tabs.Screen
        name="payments"
        options={{
          title: 'Pagamento',
          tabBarIcon: ({ color, size }) => (
            <HandCoins size={size} color={color} /> 
          ),
        }}
      />
    </Tabs>
  );
}
