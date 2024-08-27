"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./page.module.scss";
import { api } from "@/services/api";
import { getCookie } from "cookies-next"; // Função para obter cookies
import { TableClients } from "./components/tableClients";

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
  const [activeElement, setActiveElement] = useState<string | null>(null); // Estado para rastrear o elemento focado
  const inputRef = useRef<HTMLInputElement>(null);
  const intervalIdRef = useRef<number | null>(null);

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

  useEffect(() => {
const resetFocusInterval = () => {
      if (intervalIdRef.current) clearInterval(intervalIdRef.current);
      intervalIdRef.current = window.setInterval(() => {
        if (activeElement !== "menuSearch") {
          inputRef.current?.focus();
        }
      }, 3000);
    };

    if (activeElement !== "menuSearch") {
      resetFocusInterval();
    }

    const handleMouseMove = () => resetFocusInterval();
    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      if (intervalIdRef.current) clearInterval(intervalIdRef.current);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [activeElement]);

  return (
    <main className={styles.contentArea}>
      <TableClients clients={clients} loading={loading} />
    </main>
  );
}
