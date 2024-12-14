import { useEffect, useState } from "react";
import { Modal } from "react-bootstrap";
import { X } from "lucide-react";
import styles from "./styles.module.scss";
import { getCookie } from "cookies-next";
import { api } from "@/services/api";

interface PurchaseInfoModalProps {
  showModalInfo: boolean;
  handleCloseModalInfo: () => void;
  purchaseId: string; // ID da compra recebida via prop
}

interface PurchaseInfo {
    id: string; // ID da compra
    descricaoCompra: string; // Descrição do item comprado
    totalCompra: number; // Valor total da compra
    valorInicialCompra: number; // Valor inicial da compra
    tipoCompra: number; // Tipo da compra (0 ou 1)
    statusCompra: number; // Status da compra (ex: 0 - pendente, 1 - pago)
    created_at: string; // Data de criação
    updated_at: string; // Data de atualização
    dataDaCompra: string; // Data da compra
  }

export default function PurchaseInfoModal({
  showModalInfo,
  handleCloseModalInfo,
  purchaseId,
}: PurchaseInfoModalProps) {
  const [purchaseInfo, setPurchaseInfo] = useState<PurchaseInfo | null>(null);

  useEffect(() => {
    if (purchaseId && showModalInfo) {
      // Simulando a chamada à API para obter as informações da compra
      // Troque isso pela chamada real à API
      const fetchPurchaseInfo = async () => {
        try {
          const token = getCookie("token");
          const response = await api.get(`/compras/${purchaseId}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
  
          setPurchaseInfo(response.data);
        } catch (error) {
          console.error("Erro ao carregar as informações da compra:", error);
        }
      };
      
      fetchPurchaseInfo();
    }
  }, [purchaseId, showModalInfo]);
  
  return (
    <Modal
      show={showModalInfo}
      onHide={handleCloseModalInfo}
      className={styles.customModal}
      keyboard={true}
      size="lg"
    >
      <div className={styles.customModalHeader}>
        <h2>Informações da Compra</h2>

        <button onClick={handleCloseModalInfo} className={styles.closeButton}>
          <X size={24} color="var(--white)" />
        </button>
      </div>
      <div className={styles.customModalBody}>
        {purchaseInfo ? (
          <div>
            <div className={styles.infoRow}>
              <strong>Descrição:</strong> {purchaseInfo.descricaoCompra}
            </div>
            <div className={styles.infoRow}>
              <strong>Data:</strong> 
              {new Date(purchaseInfo.dataDaCompra).toLocaleString('pt-BR', {
                weekday: 'long',  
                year: 'numeric',  
                month: 'long',    
                day: 'numeric',   
                hour: '2-digit',  
                minute: '2-digit', 
              })}
            </div>
            <div className={styles.infoRow}>
              <strong>Valor inicial:</strong> {purchaseInfo.valorInicialCompra.toLocaleString("pt-BR", {
                style: "currency",
                currency: "BRL",
              })}
            </div>
            <div className={styles.infoRow}>
              <strong>Valor atual:</strong> {purchaseInfo.totalCompra.toLocaleString("pt-BR", {
                style: "currency",
                currency: "BRL",
              })}
            </div>
            <div className={styles.buttonContainer}>
              <div className={styles.buttonGroup}>
                <button
                  type="button"
                  onClick={handleCloseModalInfo}
                  className={styles.customBtnSecondary}
                >
                  Fechar
                </button>
              </div>
            </div>
            {/* Adicione mais campos conforme necessário */}
          </div>
      
        ) : (
          <p>Carregando informações...</p>
        )}
      </div>
    </Modal>
  );
}
