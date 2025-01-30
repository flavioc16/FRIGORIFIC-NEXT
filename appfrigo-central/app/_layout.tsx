import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useColorScheme } from 'react-native';
import {  AuthProvider } from '../src/context/AuthContext'; // Importe o contexto de autenticação
import { useRouter } from 'expo-router'; // Usando o useRouter para navegação
import AsyncStorage from '@react-native-async-storage/async-storage';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const router = useRouter();
  const colorScheme = useColorScheme();
 
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  const [isMounted, setIsMounted] = useState(false); // Verifica se o componente foi montado
  const [isReady, setIsReady] = useState(false); // Verifica se está pronto para navegação


  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync(); // Esconde a SplashScreen quando as fontes são carregadas
      setIsReady(true); // Indica que o layout está pronto
    }
  }, [loaded]);

  const checkUserInStorage = async () => {
    try {
      const userInfo = await AsyncStorage.getItem('@frigorifico');
      if (userInfo) {
        const parsedUser = JSON.parse(userInfo);

        if (parsedUser?.role) {
          if (parsedUser.role === 'USER') {
            router.replace('/(auth)/(tabs)/home'); // Caminho para área de cliente
          } else if (parsedUser.role === 'ADMIN') {
            router.replace('/(auth-admin)/(tabs)/home'); // Caminho para área de admin
          }
        } else {
          router.replace('/(public)/login'); // Caso o role não exista, redireciona para login
        }
      } else {
        router.replace('/(public)/login'); // Caso não exista o usuário no storage, redireciona para login
      }
    } catch (error) {
      console.error('Erro ao acessar AsyncStorage:', error);
    }
  };

  useEffect(() => {
    // Verifica se o layout está pronto, o estado de carregamento foi resolvido e o componente foi montado
    if (!isReady || !isMounted) return; // Não navega até que tudo esteja pronto

    checkUserInStorage(); // Chama a função para verificar o usuário no AsyncStorage
  }, [isReady, isMounted, router]);

  useEffect(() => {
    // Marca que o componente foi montado
    setIsMounted(true);
  }, []);

  if (!loaded || !isMounted) {
    return null; // Exibe a SplashScreen até que as fontes e o componente estejam prontos
  }

  return (
    <AuthProvider> 
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <Stack>
          {/* Defina o cabeçalho da tela de login como false */}
          <Stack.Screen 
            name="(public)" 
            options={{
              headerShown: false, 
            }} 
          />
          <Stack.Screen 
            name="(auth-admin)" 
            options={{
              headerShown: false, 
            }} 
          />
          <Stack.Screen 
            name="(auth)" 
            options={{
              headerShown: false,
            }} 
          />
          <Stack.Screen 
            name="index" 
            options={{ 
              headerShown: false 
              }} 
            />
          <Stack.Screen 
            name="+not-found"
           />
        </Stack>
        <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
      </ThemeProvider>
    </AuthProvider>
  );
}
