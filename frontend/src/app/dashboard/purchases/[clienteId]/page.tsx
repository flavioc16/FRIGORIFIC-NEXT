"use client"
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
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

export default function ClientPurchases() {
  const { clienteId } = useParams(); // Pega o clienteId da URL
  const [compras, setCompras] = useState<Compra[]>([]); // Estado para armazenar as compras
  const [loading, setLoading] = useState(true); // Estado de carregamento
  const [cliente, setCliente] = useState<Client | null>(null); // Estado para armazenar o cliente
  const [somaTotalCompras, setSomaTotalCompras] = useState<number>(0);

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
        setSomaTotalCompras(responseCompras.data.somaTotalCompras); // Atualiza somaTotalCompras
        // Busca o cliente inteiro, incluindo nome, referência e outros dados
        const responseCliente = await api.get(`/clients/${clienteId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setCliente(responseCliente.data); // Atualiza o estado com todos os dados do cliente
      } catch (error) {
        console.error("Erro ao buscar compras ou cliente:", error);
      } finally {
        setLoading(false); // Finaliza o carregamento
      }
    }

    fetchData(); // Chama a função para buscar os dados
  }, [clienteId, compras]); // Executa sempre que o clienteId mudar

  

  return (
    <main className={styles.contentArea}>
      <TableCompras
        compras={compras}
        somaTotalCompras={somaTotalCompras} // Passa a soma total como prop
        cliente={cliente} // Passa o cliente inteiro para o componente TableCompras
        loading={loading}
      />
    </main>
  );
}
