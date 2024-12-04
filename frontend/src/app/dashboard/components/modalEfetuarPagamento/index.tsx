import { Modal } from "react-bootstrap";
import { X } from "lucide-react";
import { useState } from "react";
import stylesModal from "./stylesModal.module.scss";

interface PaymentModalProps {
  showModalPayment: boolean;
  handleCloseModalPayment: () => void;
  handleConfirmPayment: (clienteId: string, valorPagamento: number) => void;
  modalTitle: string;
  clientes: { id: string; nome: string }[];
}

export default function PaymentModal({
  showModalPayment,
  handleCloseModalPayment,
  handleConfirmPayment,
  modalTitle,
  clientes,
}: PaymentModalProps) {
  const [clienteId, setClienteId] = useState<string>("");
  const [valorPagamento, setValorPagamento] = useState<number>(0);

  const handleSubmit = () => {
    handleConfirmPayment(clienteId, valorPagamento);
    setClienteId("");
    setValorPagamento(0);
  };

  return (
    <Modal
      show={showModalPayment}
      onHide={handleCloseModalPayment}
      className={stylesModal.customModal}
      size="lg"
    >
      <div className={stylesModal.customModalHeader}>
        <h2>{modalTitle}</h2>
        <button onClick={handleCloseModalPayment} className={stylesModal.closeButton}>
          <X size={24} color="var(--white)" />
        </button>
      </div>
      <div className={stylesModal.customModalBody}>
        <div className={stylesModal.fieldContainer}>
          <label htmlFor="cliente">Cliente:</label>
          <select
            id="cliente"
            value={clienteId}
            onChange={(e) => setClienteId(e.target.value)}
          >
            <option value="">Selecione um cliente</option>
            {clientes.map((cliente) => (
              <option key={cliente.id} value={cliente.id}>
                {cliente.nome}
              </option>
            ))}
          </select>
        </div>
        <div className={stylesModal.fieldContainer}>
          <label htmlFor="valorPagamento">Valor do Pagamento:</label>
          <input
            type="number"
            id="valorPagamento"
            value={valorPagamento}
            onChange={(e) => setValorPagamento(parseFloat(e.target.value))}
          />
        </div>
        <div className={stylesModal.buttonContainer}>
          <button onClick={handleSubmit} className={stylesModal.customBtnPrimary}>
            Confirmar Pagamento
          </button>
          <button
            onClick={handleCloseModalPayment}
            className={stylesModal.customBtnSecondary}
          >
            Cancelar
          </button>
        </div>
      </div>
    </Modal>
  );
}
