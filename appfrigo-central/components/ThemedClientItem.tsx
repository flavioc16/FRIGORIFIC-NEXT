import { useEffect, useState } from 'react';
import { FlatList, View, ActivityIndicator, Text, StyleSheet } from 'react-native';
import { api } from '../src/services/api';

export interface Client {
  id: string;
  nome: string;
  email?: string;
  telefone: string;
  endereco?: string;
  referencia?: string;
  created_at: string;
  updated_at: string;
  userId: string;
}

export default function ThemedClientItem() {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const response = await api.get<Client[]>('/clients');
        setClients(response.data);
      } catch (err) {
        setError('Erro ao buscar clientes.');
      } finally {
        setLoading(false);
      }
    };

    fetchClients();
  }, []);

  if (loading) return <ActivityIndicator size="large" color="#ff0000" />;
  if (error) return <Text style={styles.error}>{error}</Text>;

  return (
    <FlatList
      data={clients}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <View style={styles.clientContainer}>
          <Text style={styles.name}>{item.nome}</Text>
          {item.email && <Text style={styles.info}>📧 {item.email}</Text>}
          <Text style={styles.info}>📞 {item.telefone}</Text>
          {item.endereco && <Text style={styles.info}>🏠 {item.endereco}</Text>}
          {item.referencia && <Text style={styles.info}>📍 {item.referencia}</Text>}
          <Text style={styles.date}>🕒 Cadastrado em: {new Date(item.created_at).toLocaleDateString()}</Text>
        </View>
      )}
    />
  );
}

const styles = StyleSheet.create({
  clientContainer: {
    backgroundColor: '#f5f5f5',
    padding: 12,
    marginVertical: 8,
    borderRadius: 8,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  info: {
    fontSize: 14,
    color: '#555',
  },
  date: {
    fontSize: 12,
    color: '#777',
    marginTop: 5,
  },
  error: {
    color: 'red',
    textAlign: 'center',
    marginTop: 10,
  },
});
