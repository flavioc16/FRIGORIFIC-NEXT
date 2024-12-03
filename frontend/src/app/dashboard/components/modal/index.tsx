import { useRef, useEffect, useState } from "react";
import { Modal } from "react-bootstrap";
import { api } from "@/services/api";
import { getCookie } from "cookies-next";
import { toast } from "react-toastify";
import { X } from "lucide-react";
import styles from "./styles.module.scss";
import { Compra } from "../../purchases/table";

interface CreatePurchaseModalProps {
  show: boolean;
  isEdit: boolean;
  onClose: () => void;
  selectedClient: { id: string; nome: string } | null;
  selectedCompra: Compra | null; // Permitir que seja null
  dataCompra: string;
  created_at: string;
  rawValue: number;
  descricaoCompra: string | undefined;
  totalCompra: string;
  tipoCompra: string | null;  // Permitir null
  setDataCompra: React.Dispatch<React.SetStateAction<string>>;
  setCreatedAt: React.Dispatch<React.SetStateAction<string>>;
  setRawValue: React.Dispatch<React.SetStateAction<number>>;
  setDescricaoCompra: React.Dispatch<React.SetStateAction<string | undefined>>;
  setTotalCompra: React.Dispatch<React.SetStateAction<string>>;
  setTipoCompra: React.Dispatch<React.SetStateAction<string | null>>;  // Permitir null
}

export default function CreatePurchaseModal({
  show,
  isEdit,
  onClose,
  selectedClient,
  dataCompra,
  selectedCompra,
  created_at,
  rawValue,
  descricaoCompra,
  totalCompra,
  tipoCompra,
  setDataCompra,
  setCreatedAt,
  setRawValue,
  setDescricaoCompra,
  setTotalCompra,
  setTipoCompra,
}: CreatePurchaseModalProps) {

  const inputRef = useRef<HTMLInputElement | null>(null);

  const [checkbox, setCheckbox] = useState(false);

  const descricaoInputRef = useRef<HTMLInputElement | null>(null);

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCheckbox(e.target.checked);
    descricaoInputRef.current?.focus();
  };

  useEffect(() => {
    if (checkbox) {
      descricaoInputRef.current?.focus(); // Foca no input quando checkbox está true
    }
  }, [checkbox]); 
  

  useEffect(() => {
    if (show) {
        let formattedDate = "";

        if (isEdit && created_at) {
            const date = new Date(created_at);
            // Garantir que a data seja no formato 'yyyy-MM-dd'
            formattedDate = date.toISOString().split('T')[0]; // Isso vai garantir o formato correto
        } else {
            const today = new Date();
            formattedDate = today.toISOString().split('T')[0]; // Isso vai garantir o formato correto
        }

        setCreatedAt((prevDate) => {
            if (prevDate !== formattedDate) {
                return formattedDate; // Atualiza apenas se for diferente para evitar loop
            }
            return prevDate; // Não atualiza se já estiver no formato correto
        });
    }
}, [show, isEdit, setCreatedAt]);
  
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
  
    toast.dismiss();

    if (isEdit && !selectedCompra?.id) {
      toast.error("Nenhuma compra selecionada.");
      return;
    }
    
    if (parseFloat(totalCompra.replace(",", ".")) === 0) {
      toast.error("Digite um valor válido para a compra.");
      inputRef.current?.focus();
      return;
    }
  
    const token = getCookie("token");
    if (!token) {
      toast.error("Token de autenticação não encontrado. Faça login novamente.");
      return;
    }
    if (!selectedClient?.id) {
      toast.error("Nenhum cliente selecionado.");
      return;
    }
    if (!selectedCompra?.id && isEdit) {  // Verifica se a compra está selecionada no modo de edição
      toast.error("Nenhuma compra selecionada.");
      return;
    }
    if (totalCompra === "0,00") {
      toast.error("Digite um valor válido para a compra.");
      inputRef.current?.focus();
      return;
    }
  
    try {
      const tipoCompraValor = tipoCompra ? parseInt(tipoCompra, 10) : 0;
  
      const compraData = {
        id: selectedCompra?.id,  // Envia a id da compra (no modo edição)
        descricaoCompra,
        totalCompra: parseFloat(totalCompra.replace(/\./g, "").replace(",", ".")),
        tipoCompra: tipoCompraValor,
        statusCompra: 0,
        created_at: created_at, // Certifique-se de enviar a data no formato ISO 8601
        dataDaCompra: created_at, // Ou outra data conforme necessário
        clienteId: selectedClient.id,
      };
  
      if (isEdit) {
        // Chamada para atualização
        await api.put(`/compras`, compraData, {
          headers: { Authorization: `Bearer ${token}` },
        });
        toast.success(`Compra de ${selectedClient.nome} atualizada com sucesso.`);
      } else {
        // Chamada para criação
        await api.post("/compras", compraData, {
          headers: { Authorization: `Bearer ${token}` },
        });
        toast.success(`Compra de ${selectedClient.nome} cadastrada com sucesso.`);
      }

      if (!checkbox) {
        onClose(); // Fecha o modal se o checkbox não estiver marcado
      } else {
        // Foca no input Descrição
        descricaoInputRef.current?.focus();
      
        // Apenas se não estiver no modo de edição, zera os campos
        if (!isEdit) {
          setDescricaoCompra("");
          setTotalCompra("0,00");
          setTipoCompra("0");
          setCreatedAt(new Date().toISOString().split('T')[0]);
        }
      }
      
    } catch (error) {
      console.error(error);  // Para inspecionar o erro real da requisição
      toast.error(isEdit ? "Erro ao atualizar compra." : "Erro ao cadastrar compra.");
    }
  };
  
  const capitalizeWords = (value: string): string => {
    return value
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    let value = event.target.value;
  
    // Remove tudo que não for número
    const numericValue = value.replace(/[^\d]/g, "");
  
    // Converte o valor para número bruto (dividido por 100 para considerar casas decimais)
    const rawNumber = parseFloat(numericValue) / 100;
  
    // Atualiza o estado bruto
    setRawValue(isNaN(rawNumber) ? 0 : rawNumber);
  
    // Formata o valor para exibição imediata
    const formattedValue = isNaN(rawNumber)
      ? "0,00"
      : rawNumber.toLocaleString("pt-BR", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        });
  
    setTotalCompra(formattedValue); // Atualiza o valor formatado no input
  };

  const handleBlur = () => {
    // Reaplica a formatação ao perder o foco
    const formattedValue = rawValue.toLocaleString("pt-BR", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
    setTotalCompra(formattedValue); // Garante que o valor exibido é formatado corretamente
  };

  return (
    <>
      <Modal
        show={show}
        onHide={onClose}
        className={styles.customModal}
        size="lg"
        backdrop={false}
        keyboard={!checkbox}
      >
        <div className={styles.customModalHeader}>
          <h2> {selectedClient?.nome}</h2>
            <button onClick={onClose} className={styles.closeButton}>
              <X size={24} color="var(--white)" />
            </button>
        </div>
        <div className={styles.customModalBody}>
          <form onSubmit={handleSubmit}>
            <div className={styles.formGroup}>
              <label htmlFor="dataCompra" className={styles.customFormLabel}>Data da compra</label>
              <input
                id="dataCompra"
                type="date"
                required
                value={created_at || ""}
                onChange={(e) => setCreatedAt(e.target.value)} // Atualiza `created_at`
                className={styles.customFormControl}
              />

            </div>
            <div className={styles.formGroup}>
              <label htmlFor="descricaoCompra" className={styles.customFormLabel}>Descrição</label>
              <input
                id="descricaoCompra"
                ref={descricaoInputRef}
                type="text"
                required
                placeholder="Descrição"
                value={descricaoCompra}
                onChange={(e) => setDescricaoCompra(capitalizeWords(e.target.value))}
                autoFocus
                className={styles.customFormControl}
              />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="totalCompra" className={styles.customFormLabel}>Total</label>
              <input
                id="totalCompra"
                type="text"
                value={totalCompra}  // Valor formatado para exibição
                onBlur={handleBlur}
                onChange={handleChange}  // Atualiza o valor durante a digitação
                className={styles.customFormControl}
                placeholder="Valor"
                ref={inputRef} // Atribui a ref ao input
                required
              />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="tipoCompra" className={styles.customFormLabel}>Tipo de Serviço</label>
              <select
                id="tipoCompra"
                required
                value={tipoCompra ?? '0'} // Se tipoCompra for null, '0' será usado
                onChange={(e) => setTipoCompra(e.target.value)}
                className={styles.customFormControl}
              >
                <option value="0">Compra</option>
                <option value="1">Restante</option>
              </select>
            </div>
            <div className={styles.buttonContainer}>
              <div className={styles.rememberMeContainer}>
                <label>
                  <input
                    type="checkbox"
                    checked={checkbox}
                    onChange={handleCheckboxChange} // Aqui é onde usamos a função
                  />
                  <div className={styles.rememberMeText}>
                    Adicionar outra compra
                  </div>
                </label>
              </div>
              
              <div className={styles.buttonGroup}>
                <button type="submit" className={styles.customBtnPrimary}>
                  {isEdit ? "Editar" : "Cadastrar"}
                </button>
                <button type="button" onClick={onClose} className={styles.customBtnSecondary}>
                  Cancelar
                </button>
              </div>
            </div>
          </form>
        </div>
      </Modal>
    </>
  );
}