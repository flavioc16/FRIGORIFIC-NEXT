import React from 'react';
import Routes from '@/routes'; // As rotas definidas pelo expo-router

import { AuthProvider } from '@/context/AuthContext'; 
import { ThemeProvider } from '@/context/ThemeContext';

export default function Layout() {
  
  return (
    <AuthProvider>
      <ThemeProvider>
        <Routes />
      </ThemeProvider>
    </AuthProvider>
  );
}
