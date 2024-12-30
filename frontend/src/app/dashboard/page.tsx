"use client";

import { useEffect, useState } from "react";
import { api } from "@/services/api";
import { getCookie } from "cookies-next";
import { Table } from "./components/table";
import FeaturedCard from "./components/featuredCard";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

import styles from "./page.module.scss";

import { ShoppingCart, DollarSign, UserPlus, ScanBarcode } from "lucide-react"; // Supondo que você esteja usando os ícones do Lucide

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
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);

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
      <Row className={`${styles.rowCustom} g-4`}>
        <Col md={3} className="px-10" style={{ marginRight: '3px', marginLeft: '3px', marginTop: '2rem' }}>
          <FeaturedCard icon={<ShoppingCart size={40} />} />
        </Col>
        <Col md={3} className="px-0" style={{ marginRight: '-7px', marginTop: '2rem' }}>
          <FeaturedCard icon={<DollarSign size={40} />} />
        </Col>
        <Col md={3} className="px-0" style={{ marginRight: '-20px', marginTop: '2rem' }}>
          <FeaturedCard icon={<UserPlus size={40} />} />
        </Col>
        <Col md={3} className="px-10" style={{ marginRight: '-1px', marginTop: '2rem' }}>
          <FeaturedCard icon={<ScanBarcode size={40} />} />
        </Col>
      </Row>
      <Table clients={clients} loading={loading} />
    </main>
  );
}
