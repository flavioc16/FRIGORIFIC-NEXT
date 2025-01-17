import React, { useContext, useEffect, useState } from 'react';
import { StyleSheet, FlatList, View, ActivityIndicator, Text } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { AuthContext } from '../../../src/context/AuthContext';
import { api } from '../../../src/services/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ThemedPurchaseItem from '@/components/ThemedPurchaseItem';

interface Compra {
  id: string;
  descricaoCompra: string;
  totalCompra: number;
  valorInicialCompra: number;
  tipoCompra: number;
  statusCompra: number;
  created_at: string;
  updated_at: string;
  dataDaCompra: string;
  dataVencimento: string;
  isVencida: number;
}

export default function TabThreeScreen() {
  const { user } = useContext(AuthContext); // Pega o usuário do contexto de autenticação
  const [currentUser, setCurrentUser] = useState<any>(null); // Para armazenar o usuário
  const [compras, setCompras] = useState<{ compras: Compra[]; somaTotalCompras: number }>({
    compras: [],
    somaTotalCompras: 0,
  });
  const [loading, setLoading] = useState(true); // Estado para gerenciar o carregamento

  // Buscar o usuário no AsyncStorage ou pegar do contexto
  useEffect(() => {
    const fetchUser = async () => {
      const userFromStorage = await AsyncStorage.getItem('@frigorifico');
      if (userFromStorage) {
        setCurrentUser(JSON.parse(userFromStorage)); // Define o usuário do AsyncStorage
      } else {
        setCurrentUser(user); // Caso contrário, pega do contexto
      }
      setLoading(false); // Finaliza o carregamento após definir o usuário
    };

    fetchUser();
  }, [user]); // Depende do `user` do contexto

  // Buscar as compras para o usuário
  useEffect(() => {
    const fetchCompras = async () => {
      if (!currentUser?.client || !currentUser?.client[0]?.id) {
        console.log('Cliente não encontrado ou ID inválido');
        return;
      }

      try {
        const response = await api.get(`/cliente/${currentUser?.client[0]?.id}`, {
          headers: {
            Authorization: `Bearer ${currentUser?.token}`,
          },
        });

        setCompras({
          compras: response.data.compras,
          somaTotalCompras: response.data.somaTotalCompras,
        });
      } catch (error: unknown) {
        if (error instanceof Error) {
          console.error('Erro ao buscar compras:', error.message);
        } else {
          console.error('Erro desconhecido', error);
        }
      } finally {
        setLoading(false);
      }
    };

    if (currentUser) {
      fetchCompras();
    }
  }, [currentUser]);

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title" style={{ marginTop: 60, marginBottom: 10 }}>
        Compras
      </ThemedText>
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#ae2121" />
        </View>
      ) : (
        <>
          {compras.compras.length > 0 ? (
            <>
              <FlatList
                data={compras.compras}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                  <ThemedPurchaseItem
                    id={item.id}
                    descricaoCompra={item.descricaoCompra}
                    totalCompra={item.totalCompra}
                    valorInicialCompra={item.valorInicialCompra}
                    tipoCompra={item.tipoCompra}
                    statusCompra={item.statusCompra}
                    created_at={item.created_at}
                    updated_at={item.updated_at}
                    dataDaCompra={item.dataDaCompra}
                    dataVencimento={item.dataVencimento}
                    isVencida={item.isVencida}
                  />
                )}
                ListFooterComponent={
                  <View style={styles.totalContainer}>
                    <Text style={styles.totalText}>
                      Valor Total das Compras: R${compras.somaTotalCompras.toFixed(2)}
                    </Text>
                  </View>
                }
              />
            </>
          ) : (
            <ThemedText style={styles.item}>Nenhuma compra encontrada.</ThemedText>
          )}
        </>
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    marginBottom: 100,
    alignItems: 'center', // Centraliza horizontalmente
  },
  item: {
    marginTop: 10,
    fontSize: 16,
  },
  totalContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  totalText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff', // Para garantir que a cor do texto seja visível
  },
});
