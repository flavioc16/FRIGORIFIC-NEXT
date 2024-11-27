"use client";

import { useEffect, useState } from "react";
import styles from "./page.module.scss";
import { api } from "@/services/api";
import { getCookie } from "cookies-next"; // Função para obter cookies
import { Table } from "./components/table";

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

export default function Dashboard() {
  const [clients, setClients] = useState<Client[]>([]); // Tipagem dos clientes
  const [loading, setLoading] = useState(true); // Estado de carregamento

  useEffect(() => {
    async function fetchClients() {
      try {
        const token = getCookie("token");
        const response = await api.get("/clients", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setClients(response.data);
      } catch (error) {
        console.error("Erro ao buscar clientes:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchClients();
  }, []);

  return (
    <main className={styles.contentArea}>
      <Table clients={clients} loading={loading} />
    </main>
  );
}
