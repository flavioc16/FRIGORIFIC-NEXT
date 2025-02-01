import { useEffect, useState } from 'react';
import { FlatList, View, ActivityIndicator, Text, StyleSheet, TextInput, TouchableOpacity  } from 'react-native';
import { X, Search, Tag, MapPin, Mail, Phone } from "lucide-react-native";
import { api } from '../src/services/api';
import { ThemedView } from './ThemedView';

export interface Client {
  id: string;
  nome: string;
  email?: string;
  telefone: string;
  endereco?: string;
  referencia?: string;
}

export default function ThemedClientItem() {
  const [clients, setClients] = useState<Client[]>([]);
  const [filteredClients, setFilteredClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const response = await api.get<Client[]>('/clients');
        setClients(response.data);
        setFilteredClients(response.data);
      } catch (err) {
        setError('Erro ao buscar clientes.');
      } finally {
        setLoading(false);
      }
    };

    fetchClients();
  }, []);

  // Filtra os clientes conforme qualquer campo
  useEffect(() => {
    if (search.trim() === '') {
      setFilteredClients(clients);
    } else {
      const lowerSearch = search.toLowerCase();
      const filtered = clients.filter(client =>
        Object.values(client).some(value =>
          value?.toString().toLowerCase().includes(lowerSearch)
        )
      );
      setFilteredClients(filtered);
    }
  }, [search, clients]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#ff0000" />
      </View>
    );
  }
  if (error) return <Text style={styles.error}>{error}</Text>;

  return (
    <ThemedView style={styles.themedContainer}>
      
      {/* Input de busca com ícones */}
      <ThemedView style={styles.searchContainer}>
        <Search size={20} color="#666" />
        <TextInput
          style={styles.searchInput}
          placeholder="Consultar clientes..."
          placeholderTextColor="#888"
          value={search}
          onChangeText={setSearch}
        />
        {search.length > 0 && (
          <TouchableOpacity onPress={() => setSearch("")} style={styles.clearButton}>
            <X size={20} color="#666" />
          </TouchableOpacity>
        )}
      </ThemedView>

      <FlatList
  showsVerticalScrollIndicator={false}
  showsHorizontalScrollIndicator={false}
  data={filteredClients}
  keyExtractor={(item) => item.id}
  renderItem={({ item }) => (
    <View style={styles.clientContainer}>
      <Text style={styles.name}>{item.nome}</Text>
      
      {item.referencia && (
        <View style={styles.infoRow}>
          <Tag size={16} color="#555" />
          <Text style={styles.info}>{item.referencia}</Text>
        </View>
      )}

      {item.endereco && (
        <View style={styles.infoRow}>
          <MapPin size={16} color="#555" />
          <Text style={styles.info}>{item.endereco}</Text>
        </View>
      )}

      {item.email && (
        <View style={styles.infoRow}>
          <Mail size={16} color="#555" />
          <Text style={styles.info}>{item.email}</Text>
        </View>
      )}

      <View style={styles.infoRow}>
        <Phone size={16} color="#555" />
        <Text style={styles.info}>{item.telefone}</Text>
      </View>
    </View>
  )}
  ListFooterComponent={<View style={{ height: 75 }} />} // Espaço extra no final
/>

    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  searchContainer: {
    marginTop: 40,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    borderRadius: 8,
    paddingHorizontal: 10,
    margin: 10,
    height: 40,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    paddingVertical: 8,
    paddingHorizontal: 10, // Espaço entre os ícones e o texto
    color: "#333",
  },
  clearButton: {
    padding: 5,
  },
  clientContainer: {
    backgroundColor: '#f5f5f5',
    padding: 12,
    marginVertical: 8,
    borderRadius: 8,
    marginHorizontal: 10,
  },
  name: {
    marginBottom: 4,
    fontSize: 18,
    fontWeight: 'bold',
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5, // Espaço entre o ícone e o texto (se necessário, ajuste conforme necessário)
    marginTop: 4,
  },
  info: {
    fontSize: 14,
    color: '#555',
  },
  error: {
    color: 'red',
    textAlign: 'center',
    marginTop: 10,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  themedContainer: {
    flex: 1,
  }
});
