import React, { useEffect, useState } from 'react';
import { useFonts } from 'expo-font'; // Para carregar fontes
import { Poppins_400Regular, Poppins_500Medium, Poppins_700Bold } from '@expo-google-fonts/poppins';
import * as SplashScreen from 'expo-splash-screen'; // Importando SplashScreen
import Routes from '@/src/routes'; // As rotas definidas pelo expo-router

import { AuthProvider } from '../src/context/AuthContext'; 
import { ThemeProvider } from '../src/context/ThemeContext';

// Impede a SplashScreen de desaparecer automaticamente antes que tudo esteja pronto
SplashScreen.preventAutoHideAsync();

export default function Layout() {
  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_700Bold,
  });

  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Quando as fontes estiverem carregadas, podemos esconder a SplashScreen
    if (fontsLoaded) {
      SplashScreen.hideAsync(); // Oculta a SplashScreen
      setIsReady(true); // Agora podemos renderizar o app
    }
  }, [fontsLoaded]);

  if (!isReady) {
    return null; // Aqui você pode retornar algum componente de loading se desejar
  }

  return (
    <AuthProvider>
      <ThemeProvider>
        <Routes />
      </ThemeProvider>
    </AuthProvider>
  );
}
