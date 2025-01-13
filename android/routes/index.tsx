import React, { useContext } from "react";
import { AuthContext } from '@/context/AuthContext'; // Importando o contexto de autenticação
import { useTheme } from '@/context/ThemeContext'; // Importando o contexto de tema
import AuthRoutes from "./auth.routes";
import AppRoutes from "./app.routes";
import { View, ActivityIndicator } from "react-native";

function Routes() {
  const { isAuthenticated, loading } = useContext(AuthContext); // Contexto de autenticação
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

  // Exibe as rotas de autenticação ou da aplicação principal com base no estado de autenticação
  return isAuthenticated ? <AppRoutes /> : <AuthRoutes />;
}

export default Routes;
