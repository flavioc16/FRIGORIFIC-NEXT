"use client";

import { useState, useMemo, useRef, useEffect } from 'react';
import { Search } from 'lucide-react';
import styles from './styles.module.scss';
import { api } from '@/services/api'; 

interface Client {
  id: string;
  nome: string;
  email: string;
  telefone: string;
  created_at: string;
  updated_at: string;
  userId: string;
  user: {
    id: string;
    name: string;
    username: string;
    password: string;
    created_at: string;
    updated_at: string;
  };
}

export function Clients() {
  const [searchTerm, setSearchTerm] = useState('');
  const [clients, setClients] = useState<Client[]>([]);
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    async function fetchClients() {
      try {
        const token = localStorage.getItem('token'); // Obtenha o token do armazenamento local
        const response = await api.get<Client[]>('/clients', {
          headers: {
            Authorization: `Bearer ${token}` // Adiciona o token nos cabeçalhos
          }
        });
        setClients(response.data);
      } catch (error) {
        console.error("Error fetching clients:", error);
      }
    }
    fetchClients();
  }, []);

  const filteredClients = useMemo(() => {
    return clients.filter(client =>
      client.nome.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm, clients]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }, 10000);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <main className={styles.container}>
      <section className={styles.containerHeader}>
        <h1>Clientes Cadastrados</h1>
        <div className={styles.searchContainer}>
          <Search className={styles.searchIcon} />
          <input
            type="text"
            placeholder="Pesquisar Clientes"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={styles.searchInput}
            ref={inputRef}
          />
        </div>
      </section>

      <section className={styles.listClients}>
        {filteredClients.map((client, index) => (
          <button key={client.id} className={styles.clientItem}>
            <div className={styles.tag}></div>
            <span>{client.nome}</span>
          </button>
        ))}
      </section>
    </main>
  );
}
