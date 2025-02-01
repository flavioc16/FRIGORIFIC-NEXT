import React, { useEffect, useState } from 'react';
import { FlatList, View, ActivityIndicator, Text, StyleSheet, TextInput, TouchableOpacity, useColorScheme } from 'react-native';
import { X, Search, Tag, MapPin, Phone } from "lucide-react-native";
import AsyncStorage from '@react-native-async-storage/async-storage'; // Importa AsyncStorage
import { api } from '../../../src/services/api';
import { ThemedView } from '@/components/ThemedView';

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
  const [isThemeLoaded, setIsThemeLoaded] = useState(false); // Estado para verificar se o tema foi carregado
  const [theme, setTheme] = useState<'light' | 'dark' | null>(null); // Estado do tema persistente
  
  const systemTheme = useColorScheme(); // Detecta o tema (light ou dark)

  // Cores para tema claro e escuro
  const colors = theme === 'dark' ? {
    background: '#0D0F16',
    text: '#fff',
    inputBackground: '#555',
    inputText: '#fff',
    placeholderText: '#bbb',
    iconColor: '#fff',
    clientBackground: '#444',
    clientText: '#ddd',
    noResultsText: '#aaa',
  } : {
    background: '#fff',
    text: '#333',
    inputBackground: '#f5f5f5',
    inputText: '#333',
    placeholderText: '#888',
    iconColor: '#666',
    clientBackground: '#f5f5f5',
    clientText: '#555',
    noResultsText: '#888',
  };

  // Carrega o tema do AsyncStorage ou usa o tema do sistema
  useEffect(() => {
    const loadTheme = async () => {
      try {
        const savedTheme = await AsyncStorage.getItem('theme');
        if (savedTheme === 'light' || savedTheme === 'dark') {
          setTheme(savedTheme);
        } else {
          setTheme(systemTheme || 'light'); // Usa o tema do sistema se não houver tema salvo
        }
      } catch (e) {
        setTheme(systemTheme || 'light'); // Se ocorrer erro, usa o tema do sistema
      } finally {
        setIsThemeLoaded(true); // Marca o tema como carregado
      }
    };

    loadTheme();
  }, [systemTheme]);

  // Salva o tema no AsyncStorage quando ele for alterado
  useEffect(() => {
    const saveTheme = async () => {
      if (theme) {
        try {
          await AsyncStorage.setItem('theme', theme); // Salva o tema persistente
        } catch (e) {
          console.error('Erro ao salvar o tema', e);
        }
      }
    };

    if (theme) {
      saveTheme();
    }
  }, [theme]);

  // Carrega os dados dos clientes
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

  // Se o tema não estiver carregado, mostra um carregando
  if (!isThemeLoaded) {
    return <ThemedView style={styles.loadingContainer}><ActivityIndicator size="large" color="#b62828" /></ThemedView>;
  }

  if (loading) {
    return (
      <ThemedView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#b62828" />
      </ThemedView>
    );
  }

  if (error) return <Text style={[styles.error, { color: "#b62828" }]}>{error}</Text>;

  return (
    <View style={[styles.themedContainer, { backgroundColor: colors.background }]}>

      <View style={[styles.searchContainer, { backgroundColor: colors.inputBackground }]}>
        <TextInput
          style={[styles.searchInput, { color: colors.inputText }]}
          placeholder="Buscar cliente por nome, endereço ou referência"
          placeholderTextColor={colors.placeholderText}
          value={search}
          onChangeText={setSearch}
        />
      
        {search.length > 0 ? (
          <TouchableOpacity onPress={() => setSearch('')} style={styles.clearButton}>
            <X size={20} color={colors.iconColor} />
          </TouchableOpacity>
        ) : (
          <Search size={20} color={colors.iconColor} />
        )}
      </View>


      {filteredClients.length === 0 && search.length > 0 && (
        <Text style={[styles.noResults, { color: colors.noResultsText }]}>Nenhum cliente encontrado</Text>
      )}

      <FlatList
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
        data={filteredClients}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={[styles.clientContainer, { backgroundColor: colors.clientBackground }]}>
            <Text style={[styles.name, { color: colors.clientText }]}>{item.nome}</Text>

            {item.referencia && (
              <View style={styles.infoRow}>
                <Tag size={16} color={colors.iconColor} />
                <Text style={[styles.info, { color: colors.clientText }]}>{item.referencia}</Text>
              </View>
            )}

            {item.endereco && (
              <View style={styles.infoRow}>
                <MapPin size={16} color={colors.iconColor} />
                <Text style={[styles.info, { color: colors.clientText }]}>{item.endereco}</Text>
              </View>
            )}

            <View style={styles.infoRow}>
              <Phone size={16} color={colors.iconColor} />
              <Text style={[styles.info, { color: colors.clientText }]}>{item.telefone}</Text>
            </View>
          </View>
        )}
        ListFooterComponent={<View style={{ height: 92 }} />} // Espaço extra no final
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  searchContainer: {
    marginTop: 55,
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 8,
    paddingHorizontal: 10,
    margin: 10,
    height: 40,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    paddingVertical: 8,
    paddingHorizontal: 10,
  },
  clearButton: {
    padding: 5,
  },
  clientContainer: {
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
    gap: 5,
    marginTop: 4,
  },
  info: {
    fontSize: 14,
  },
  error: {
    textAlign: 'center',
    marginTop: 10,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  themedContainer: {
    flex: 1,
  },
  noResults: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: 16,
    textAlign: 'center',
  },
});
