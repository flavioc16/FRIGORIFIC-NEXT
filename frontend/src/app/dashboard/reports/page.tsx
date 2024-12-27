"use client"

import { useEffect, useState } from "react";
import styles from "./styles.module.scss";
import { api } from "@/services/api";
import { getCookie } from "cookies-next"; // Função para obter cookies
import { TableRelatorio } from "./components/tableRelatorio";

// Interfaces para a tipagem
export interface Cliente {
  nome: string;
}

export interface Juros {
  // Caso possua campos adicionais, defina-os aqui
}

export interface Pagamento {
  id: string;
  valorPagamento: number;
  clienteId: string;
  userId: string;
  created_at: string;
  updated_at: string;
  compraId: string;
}

export interface Compra {
  id: string;
  descricaoCompra: string;
  totalCompra: number;
  valorInicialCompra: number;
  tipoCompra: number;
  statusCompra: number;
  created_at: string;
  updated_at: string;
  dataDaCompra: string;
  dataVencimento: string;
  isVencida: number;
  userId: string;
  clienteId: string;
  pagamentoId: string | null;
  cliente: Cliente;
  juros: Juros[];
  pagamentos: Pagamento[];
}

export interface RelatorioComprasResponse {
  compras: Compra[];
  somaTotalCompras: number;
}

export default function Relatorios() {
  const [compras, setCompras] = useState<Compra[]>([]); // Tipagem das compras
  const [loading, setLoading] = useState(false); // Estado de carregamento
  const [dataInicio, setDataInicio] = useState(""); // Data de início
  const [dataFim, setDataFim] = useState(""); // Data de fim
  const [somaTotalCompras, setSomaTotalCompras] = useState(0); // Soma total das compras

  // UseEffect que define as datas padrão e chama a função de busca uma única vez, quando o componente é montado
  useEffect(() => {
    const hoje = new Date();
    const dataAtualFormatada = hoje.toISOString().split("T")[0]; // Formata como YYYY-MM-DD

    setDataInicio(dataAtualFormatada);
    setDataFim(dataAtualFormatada);
    fetchRelatorios(dataAtualFormatada, dataAtualFormatada); // Chama a função com as datas padrão
  }, []); // Esse useEffect é executado apenas uma vez, quando o componente é montado.

  // Função para buscar os relatórios
  async function fetchRelatorios(dataInicio: string, dataFim: string) {
    setLoading(true); // Ativa o estado de carregamento
    try {
      const token = getCookie("token"); // Obtém o token dos cookies
  
      const response = await api.get<RelatorioComprasResponse>("/relatorio/compras", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          dataInicio,
          dataFim,
        },
      });
  
      setCompras(response.data.compras);
      setSomaTotalCompras(response.data.somaTotalCompras);
    } catch (error) {
      console.error("Erro ao buscar relatório:", error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className={styles.contentArea}>
      <div className={styles.filterContainer}>
        <form
          onSubmit={(e) => {
            e.preventDefault(); // Evita o reload da página
            fetchRelatorios(dataInicio, dataFim); // Chama a função para buscar os relatórios
          }}
        >
          <div className={styles.dateInputs}>
            <div className={styles.formGroup}>
              <label htmlFor="dataInicio" className={styles.customFormLabel}>
                Data Início:
              </label>
              <input
                id="dataInicio"
                type="date"
                value={dataInicio}
                onChange={(e) => setDataInicio(e.target.value)}
                required
                className={styles.customFormControl}
              />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="dataFim" className={styles.customFormLabel}>
                Data Fim:
              </label>
              <input
                id="dataFim"
                type="date"
                value={dataFim}
                onChange={(e) => setDataFim(e.target.value)}
                required
                className={styles.customFormControl}
              />
            </div>
          </div>
          <div className={styles.buttonContainer}>
            <button type="submit" className={styles.searchButton}>
              Buscar
            </button>
          </div>
        </form>
      </div>
      <TableRelatorio compras={compras} somaTotalCompras={somaTotalCompras} loading={loading} />
    </main>

  );
}
