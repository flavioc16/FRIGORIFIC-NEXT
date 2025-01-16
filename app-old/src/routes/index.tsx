import React, { useContext } from "react";
import { AuthContext } from '@/src/context/AuthContext'; // Contexto de autenticação
import { useTheme } from '../context/ThemeContext'; // Contexto de tema

import AuthRoutes from "./auth.routes"; // Rota para autenticação
import AdminRoutes from "./admin.routes"; // Rotas para admin
import UserRoutes from "./user.routes"; // Rotas para usuário comum


import { View, ActivityIndicator } from "react-native";

function Routes() {
  const { isAuthenticated, loading, user } = useContext(AuthContext); // Contexto de autenticação
  const { themeColor, themeMode } = useTheme(); // Contexto de tema

  if (loading) {
    return (
      <View 
        style={{ 
          backgroundColor: themeColor, // Usa a cor do tema como fundo
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <ActivityIndicator 
          size={60} 
          color={themeMode === 'dark' ? '#fff' : '#000'} // Usa a cor do spinner com base no tema
        />
      </View>
    );
  }

  // Exibe as rotas baseadas no tipo de usuário (admin ou user)
  if (isAuthenticated) {
    if (user?.role === 'ADMIN') {
      return <AdminRoutes />; // Direciona para as rotas de admin
    } else if (user?.role === 'USER') {
      return <UserRoutes />; // Direciona para as rotas de user
    }
  }

  return <AuthRoutes />; // Se não estiver autenticado, exibe as rotas de autenticação
}

export default Routes;
