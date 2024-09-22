"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation"; // Novo hook para rotas dinâmicas
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
  const { clienteId } = useParams(); // Obtém o clienteId da rota
  const [compras, setCompras] = useState<Compra[]>([]); // Estado para armazenar as compras
  const [loading, setLoading] = useState(true); // Estado de carregamento

  const [clienteNome, setClienteNome] = useState<string | null>(null);

  useEffect(() => {
    async function fetchPurchases() {
        try {
            const token = getCookie("token");
            const response = await api.get(`/clients/purchases/${clienteId}/compras`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setCompras(response.data.compras);
            // Assume que o nome do cliente está na primeira compra
            if (response.data.compras.length > 0) {
                setClienteNome(response.data.compras[0].cliente.nome);
            }
        } catch (error) {
            console.error("Erro ao buscar compras:", error);
        } finally {
            setLoading(false);
        }
    }

    if (clienteId) {
        fetchPurchases();
    }
  }, [clienteId]);

  if (loading) {
    return <p>Carregando...</p>;
  }

  return (
    <main className={styles.contentArea}>
      <TableCompras compras={compras} clienteNome={clienteNome} loading={loading} />
    </main>
  );
}
