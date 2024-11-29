'use client';

import { useEffect, useState } from "react";
import { useParams } from "next/navigation"; // Utilizando useParams
import styles from "../styles.module.scss";
import { api } from "@/services/api";
import { getCookie } from "cookies-next";

import { TableCompras } from "../table";

export interface Compra {
  id: string;
  descricaoCompra: string;
  totalCompra: number;
  tipoCompra: number;
  statusCompra: number;
  created_at: string;
  updated_at: string;
  clienteId: string;
}

export default function ClientPurchases() {
  const { clienteId } = useParams(); // Pega o clienteId da URL
  const [compras, setCompras] = useState<Compra[]>([]); // Estado para armazenar as compras
  const [loading, setLoading] = useState(true); // Estado de carregamento
  const [clienteNome, setClienteNome] = useState<string | null>(null); // Nome do cliente

  useEffect(() => {
    async function fetchData() {
      if (!clienteId) return; // Garante que o clienteId exista

      const token = getCookie("token");

      try {
        // Busca as compras do cliente
        const responseCompras = await api.get(`/clients/purchases/${clienteId}/compras`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setCompras(responseCompras.data.compras); // Atualiza o estado com as compras

        // Busca o nome do cliente, independente das compras
        const responseCliente = await api.get(`/clients/${clienteId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        console.log("Nome do cliente:", responseCliente.data.nome); // Verifique no console se o nome está correto
        setClienteNome(responseCliente.data.nome); // Atualiza o estado com o nome do cliente
      } catch (error) {
        console.error("Erro ao buscar compras ou cliente:", error);
      } finally {
        setLoading(false); // Finaliza o carregamento
      }
    }

    fetchData(); // Chama a função para buscar os dados
  }, [clienteId]); // Executa sempre que o clienteId mudar
  
  return (
    <main className={styles.contentArea}>
      <TableCompras compras={compras} clienteNome={clienteNome} loading={loading} />
    </main>
  );
}
