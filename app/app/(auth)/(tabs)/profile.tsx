import React, { useContext, useEffect, useState } from 'react';
import {
  StyleSheet,
  Button,
  TextInput,
  ScrollView,
  View,
  ActivityIndicator,
  SafeAreaView,
} from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { AuthContext } from '../../../src/context/AuthContext'; // Ajuste o caminho se necessário
import { api } from '../../../src/services/api';

interface Cliente {
  nome: string;
  email: string;
  telefone: string;
  endereco: string;
}

export default function TabThreeScreen() {
  const { signOut, user } = useContext(AuthContext); // Pega os dados do contexto
  const [cliente, setCliente] = useState<Cliente | null>(null); // Estado para armazenar os dados do cliente
  const [loading, setLoading] = useState(true); // Estado de carregamento
  const [error, setError] = useState<string | null>(null); // Estado para mensagens de erro

  // Chamada à API para buscar os dados do cliente
  useEffect(() => {
    const fetchCliente = async () => {
      try {
        if (!user?.client || !user.client[0]?.id) {
          setError('Usuário ou cliente não encontrado.');
          setLoading(false);
          return;
        }

        const response = await api.get(`/cliente/${user.client[0].id}`, {
          headers: { Authorization: `Bearer ${user.token}` },
        });

        if (response.data) {
          setCliente(response.data); // Define os dados do cliente
          setError(null); // Limpa erros anteriores
        } else {
          setError('Dados do cliente não encontrados.');
        }
      } catch (err) {
        console.error('Erro ao buscar os dados do cliente:', err);
        setError('Erro ao buscar os dados do cliente. Tente novamente mais tarde.');
      } finally {
        setLoading(false); // Finaliza o carregamento
      }
    };

    fetchCliente();
  }, [user]);

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <ThemedText type="title" style={styles.title}>
            Perfil
          </ThemedText>

          {loading ? (
            <ActivityIndicator size="large" color="#ae2121" style={styles.loading} />
          ) : error ? (
            <ThemedText style={styles.errorText}>{error}</ThemedText>
          ) : cliente ? (
            <>
              <TextInput
                style={styles.input}
                value={cliente.nome}
                editable={false} // Não permite edição
                placeholder="Nome"
              />
              <TextInput
                style={styles.input}
                value={cliente.email}
                editable={false}
                placeholder="E-mail"
              />
              <TextInput
                style={styles.input}
                value={cliente.telefone}
                editable={false}
                placeholder="Telefone"
              />
              <TextInput
                style={styles.input}
                value={cliente.endereco}
                editable={false}
                placeholder="Endereço"
              />
            </>
          ) : (
            <ThemedText style={styles.errorText}>Dados do cliente não disponíveis.</ThemedText>
          )}

          <View style={styles.buttonContainer}>
            <Button title="Sair" onPress={signOut} color="#ae2121" />
          </View>
        </ScrollView>
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  scrollContainer: {
    padding: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    width: '100%',
    height: 50,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 15,
    backgroundColor: '#f5f5f5',
    color: '#333',
  },
  buttonContainer: {
    marginTop: 20,
    width: '100%',
  },
  loading: {
    marginTop: 20,
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginTop: 20,
  },
});
