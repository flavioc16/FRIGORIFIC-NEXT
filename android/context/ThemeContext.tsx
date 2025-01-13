import React, { createContext, useState, useEffect, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

type ThemeContextProps = {
  themeColor: string;
  themeMode: 'light' | 'dark';
  toggleTheme: () => void;
  resetTheme: () => void;
};

const ThemeContext = createContext<ThemeContextProps | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [themeColor, setThemeColor] = useState<string>('#ffffff'); // Cor padrão
  const [themeMode, setThemeMode] = useState<'light' | 'dark'>('light'); // Modo padrão

  // Carregar tema salvo do AsyncStorage ao iniciar
  useEffect(() => {
    const loadTheme = async () => {
      try {
        const savedThemeMode = await AsyncStorage.getItem('@themeMode');
        const savedThemeColor = await AsyncStorage.getItem('@themeColor');

        if (savedThemeMode && savedThemeColor) {
          setThemeMode(savedThemeMode as 'light' | 'dark');
          setThemeColor(savedThemeColor);
        }
      } catch (error) {
        console.error('Erro ao carregar o tema do AsyncStorage:', error);
      }
    };

    loadTheme();
  }, []);

  // Alternar entre tema claro e escuro
  const toggleTheme = async () => {
    try {
      const newThemeMode = themeMode === 'light' ? 'dark' : 'light';
      const newThemeColor = newThemeMode === 'dark' ? '#0d0f16' : '#ffffff';

      setThemeMode(newThemeMode);
      setThemeColor(newThemeColor);

      await AsyncStorage.setItem('@themeMode', newThemeMode);
      await AsyncStorage.setItem('@themeColor', newThemeColor);
    } catch (error) {
      console.error('Erro ao alternar o tema no AsyncStorage:', error);
    }
  };

  // Resetar para o tema padrão
  const resetTheme = async () => {
    try {
      setThemeMode('light');
      setThemeColor('#ffffff');

      await AsyncStorage.setItem('@themeMode', 'light');
      await AsyncStorage.setItem('@themeColor', '#ffffff');
    } catch (error) {
      console.error('Erro ao resetar o tema no AsyncStorage:', error);
    }
  };

  return (
    <ThemeContext.Provider value={{ themeColor, themeMode, toggleTheme, resetTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

// Hook para acessar o contexto
export const useTheme = (): ThemeContextProps => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme deve ser usado dentro de um ThemeProvider');
  }
  return context;
};
