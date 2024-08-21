"use client";
import { useEffect, useState } from "react";
import styles from "./page.module.scss";
import { api } from "@/services/api";
import { getCookie } from "cookies-next"; // Função para obter cookies
import { TableClients } from "./components/tableClients";

export default function Dashboard() {
  const [clients, setClients] = useState([]);

  useEffect(() => {
    // Fazendo a chamada à API para obter os dados dos clientes
    async function fetchClients() {
      try {
        const token = getCookie("token"); // Obtém o token dos cookies
        const response = await api.get("/clients", {
          headers: {
            Authorization: `Bearer ${token}`, // Inclui o token no cabeçalho da requisição
          },
        });
        setClients(response.data);
      } catch (error) {
        console.error("Erro ao buscar clientes:", error);
      }
    }

    fetchClients();
  }, []);

 return (
    <>
    
    <main className={styles.contentArea}>
        <TableClients clients={clients}/>
    </main>
  
  </>
  );
}
