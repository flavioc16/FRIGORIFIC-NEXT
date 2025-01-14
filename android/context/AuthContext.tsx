import React, { createContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { api } from '../services/api';

type AuthContextData = {
  user: UserProps | null;
  isAuthenticated: boolean;
  signIn: (credentials: SignInProps) => Promise<void>;
  signOut: () => Promise<void>;
  loadingAuth: boolean;
  loading: boolean;
};

type Client = {
  id: string;
  nome: string;
  endereco: string;
  referencia: string;
  email: string;
  telefone: string;
  created_at: string;
  updated_at: string;
  userId: string;
};

type UserProps =
  | {
      id: string;
      name: string;
      username: string;
      role: 'USER';
      token: string;
      client: Client[];
    }
  | {
      id: string;
      name: string;
      username: string;
      role: 'ADMIN';
      token: string;
      client: [];
    };

type AuthProviderProps = {
  children: ReactNode;
};

type SignInProps = {
  username: string;
  password: string;
};

export const AuthContext = createContext({} as AuthContextData);

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<UserProps | null>(null);
  const [loadingAuth, setLoadingAuth] = useState(false);
  const [loading, setLoading] = useState(true);

  const isAuthenticated = !!user?.token;

  useEffect(() => {
    async function getUser() {
      try {
        const userInfo = await AsyncStorage.getItem('@frigorifico');

        if (userInfo) {
          const hasUser: UserProps = JSON.parse(userInfo);

          if (hasUser?.token) {
            api.defaults.headers.common['Authorization'] = `Bearer ${hasUser.token}`;
            setUser(hasUser);
          }
        }
      } catch (error) {
        console.log('Erro ao recuperar usuário do AsyncStorage:', error);
      } finally {
        setLoading(false);
      }
    }

    getUser();
  }, []);
  async function signIn({ username, password }: SignInProps) {
    setLoadingAuth(true);
  
    if (!username || !password) {
      setLoadingAuth(false);
      throw 'Usuário ou senha não podem estar vazios.';
    }
  
    try {
      const response = await api.post('/session', {
        username,
        password,
      });
  
      const { id, name, role, token, client } = response.data;
  
      const userData = {
        id,
        name,
        username,
        role,
        token,
        client,
      };
  
      // Salvar no AsyncStorage
      await AsyncStorage.setItem('@frigorifico', JSON.stringify(userData));
  
      // Configurar o token no cabeçalho padrão da API
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  
      setUser(userData);
    } catch (error: any) {
      throw (
        error.response?.data?.message || 'Erro ao realizar o login. Tente novamente.'
      );
    } finally {
      setLoadingAuth(false);
    }
  }
  

  async function signOut() {
    await AsyncStorage.clear().then(() => {
      setUser(null);
    });
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        signIn,
        signOut,
        loadingAuth,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
