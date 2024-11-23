import { useState, useEffect, useRef, useMemo } from 'react';
import { Search, X, ChevronLeft, ChevronRight, Plus, Info } from 'lucide-react';
import styles from './styles.module.scss';
import { useFocus } from '@/app/context/FocusContext';
import { getCookie } from 'cookies-next';

import 'react-toastify/dist/ReactToastify.css';
import { toast, ToastContainer } from 'react-toastify';

import axios from 'axios';
import { api } from '@/services/api';

import Link from 'next/link';
import { Modal, OverlayTrigger, Tooltip } from 'react-bootstrap';

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

interface TableClientsProps {
  clients: Client[];
  loading: boolean;
}

export function Table ({ clients, loading }: TableClientsProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [clientsPerPage, setClientsPerPage] = useState(10);

  const inputRef = useRef<HTMLInputElement>(null);
  const { isMenuInputFocused, setIsMenuInputFocused } = useFocus();

  const [mouseMoved, setMouseMoved] = useState(false);

  const [showModalCreateCompra, setShowModalCreateCompra] = useState(false);


  const [dataCompra, setDataCompra] = useState(() => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  });
  const [descricaoCompra, setDescricaoCompra] = useState<string | undefined>();
  const [totalCompra, setTotalCompra] = useState<string | undefined>();
  const [tipoCompra, setTipoCompra] = useState('');
  const [statusCompra, setStatusCompra] = useState<string | undefined>();

  const [selectedClient, setSelectedClient] = useState<Client | null>(null);


  const handleOpenModalCreateCompra  = (client: Client) => {
    
    setDescricaoCompra('');
    setTotalCompra('');
    setTipoCompra('');
    setStatusCompra('');
    setSelectedClient(client);
    setShowModalCreateCompra(true);

  };

  const handleCloseModalCreateCompra = () => {
    setShowModalCreateCompra(false);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
  
    const token = getCookie("token");
  
    if (!token) {
      toast.error("Token de autenticação não encontrado. Faça login novamente.");
      return;
    }
  
    try {
      // Monta o objeto de dados da compra a partir dos estados dos inputs
      const compraData = {
        dataCompra,
        descricaoCompra,
        totalCompra,
        tipoCompra,
        statusCompra,
        // Se necessário, pode incluir o ID do cliente ou outro dado relevante
        clientId: selectedClient?.id,
      };

      // Envia os dados para a API
      const response = await api.post("/compras", compraData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      const newCompraDescription = response.data.descricaoCompra || "Compra";
      toast.success(`Compra de ${newCompraDescription} cadastrada com sucesso.`);
      console.log("Compra cadastrada com sucesso:", response.data);
  
      // Reseta os campos do formulário após o envio
      setDataCompra('');
      setDescricaoCompra('');
      setTotalCompra('');
      setTipoCompra('');
      setStatusCompra('');
  
      handleCloseModalCreateCompra(); // Fecha o modal após a ação
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const errorMessage = error.response?.data?.error || "Erro ao cadastrar compra.";
        toast.error(errorMessage);
        console.error("Erro ao processar compra:", error.response?.data);
      } else {
        toast.error("Erro desconhecido.");
        console.error("Erro desconhecido:", error);
      }
    }
  };
  

  const applyFocus = () => {
    if (!isMenuInputFocused && inputRef.current && !mouseMoved) {
      inputRef.current.focus();
    }
  };

  useEffect(() => {
    applyFocus();
  }, []);

  useEffect(() => {
    const intervalId = setInterval(() => applyFocus());
    return () => clearInterval(intervalId);
  }, [isMenuInputFocused, mouseMoved]);

  useEffect(() => {
    const handleUserInteraction = () => {
      setMouseMoved(true);
      setTimeout(() => setMouseMoved(false), 3000);
    };
  
    window.addEventListener('mousemove', handleUserInteraction);
    window.addEventListener('click', handleUserInteraction); // Captura cliques
  
    return () => {
      window.removeEventListener('mousemove', handleUserInteraction);
      window.removeEventListener('click', handleUserInteraction);
    };
  }, []);
  
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isMenuInputFocused) {
        setSearchTerm('');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isMenuInputFocused]);

  const handleClientsPerPageChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setClientsPerPage(Number(event.target.value));
    setCurrentPage(1);
  };

  const handleSelectFocus = (event: React.FocusEvent<HTMLSelectElement>) => {
    event.target.classList.add(styles.dropdownExpanded);
  };

  const handleSelectBlur = (event: React.FocusEvent<HTMLSelectElement>) => {
    event.target.classList.remove(styles.dropdownExpanded);
  };

  const handleSearchClear = () => setSearchTerm('');

  // Memoized filtered clients to optimize performance
  const filteredClients = useMemo(() => {
    return clients.filter((client) =>
      client.nome.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [clients, searchTerm]);

  const indexOfLastClient = currentPage * clientsPerPage;
  const indexOfFirstClient = indexOfLastClient - clientsPerPage;
  const currentClients = filteredClients.slice(indexOfFirstClient, indexOfLastClient);
  const totalPages = Math.ceil(filteredClients.length / clientsPerPage);

  const handlePageChange = (pageNumber: number) => setCurrentPage(pageNumber);

  const generatePagination = (): (number | string)[] => {
    const pagination: (number | string)[] = [];
    const maxPagesToShow = 5;
    const firstPage = 1;
    const lastPage = totalPages;

    if (totalPages <= maxPagesToShow) {
      for (let i = 1; i <= totalPages; i++) {
        pagination.push(i);
      }
    } else {
      if (currentPage <= maxPagesToShow - 2) {
        for (let i = 1; i <= maxPagesToShow; i++) {
          pagination.push(i);
        }
        pagination.push('...', lastPage);
      } else if (currentPage >= totalPages - (maxPagesToShow - 2)) {
        pagination.push(firstPage, '...');
        for (let i = totalPages - (maxPagesToShow - 1); i <= totalPages; i++) {
          pagination.push(i);
        }
      } else {
        pagination.push(firstPage, '...');
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pagination.push(i);
        }
        pagination.push('...', lastPage);
      }
    }

    const filteredPagination: (number | string)[] = [];
    pagination.forEach((page, index) => {
      if (page === '...') {
        if (filteredPagination[filteredPagination.length - 1] !== '...') {
          filteredPagination.push(page);
        }
      } else {
        filteredPagination.push(page);
      }
    });

    return filteredPagination;
  };

  return (
    <div className={styles.tableWrapper}>
      {loading ? (
        <div className={styles.loadingSpinner}>
          <div className={styles.spinner}></div>
        </div>
      
      ) : (
        <>
          <div className={styles.header}>
            <h1>CLIENTES CADASTRADOS</h1>
            <div className={styles.headerControls}>
              <div className={styles.resultsPerPage}>
                <label htmlFor="resultsPerPage">Exibir:</label>
                <select
                  id="resultsPerPage"
                  value={clientsPerPage}
                  onChange={handleClientsPerPageChange}
                  onFocus={handleSelectFocus}
                  onBlur={handleSelectBlur}
                  className={styles.customSelect}
                  aria-label="Número de clientes por página"
                >
                  <option value={10}>10</option>
                  <option value={50}>50</option>
                  <option value={100}>100</option>
                </select>
                <label htmlFor="resultsPerPage" className={styles.ppage}>
                  por página
                </label>
              </div>
              <div className={styles.searchContainer}>
                <input
                  type="text"
                  placeholder="Buscar Cliente"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className={styles.filterInput}
                  ref={inputRef}
                  aria-label="Buscar Cliente"
                />
                {searchTerm ? (
                  <X
                    className={styles.clearIcon}
                    onClick={handleSearchClear}
                    role="button"
                    aria-label="Limpar pesquisa"
                  />
                ) : (
                  <Search className={styles.searchIcon} aria-hidden="true" />
                )}
              </div>
            </div>
          </div>
          <div className={styles.tableContainer}>
            <table className={styles.clientsTable}>
              <thead>
                <tr>
                  <th>Nome</th>
                  <th>Referência</th>
                  <th>Telefone</th>
                  <th>Endereço</th>
                  <th>Ação</th>
                </tr>
              </thead>
              <tbody>
                {currentClients.length > 0 ? (
                  currentClients.map((client) => (
                    <tr key={client.id}>
                      <td>{client.nome}</td>
                      <td>{client.referencia || ''}</td>
                      <td>{client.telefone}</td>
                      <td>{client.endereco || ''}</td>
                      <td className={styles.actionIcons}>
                        
                      <OverlayTrigger
                        trigger={['hover', 'focus']}
                        placement="top"
                        overlay={
                          <Tooltip id={`tooltip-plus-${client.id}`} className={styles.customTooltip}>
                            Adicionar em {client.nome}
                          </Tooltip>
                        }
                      >
                        <Plus
                          className={styles.iconPlus}
                          onClick={() => handleOpenModalCreateCompra(client)}
                          role="button"
                          aria-label={`Adicionar ${client.nome}`}
                        />
                      </OverlayTrigger>

                      <OverlayTrigger
                        trigger={['hover', 'focus']}
                        placement="top"
                        overlay={
                          <Tooltip id={`tooltip-info-${client.id}`} className={styles.customTooltip}>
                            Compras de {client.nome}
                          </Tooltip>
                        }
                      >
                        <Link href={`/dashboard/purchases/${client.id}`}>
                          <Info
                            className={styles.iconInfo}
                            role="button"
                            aria-label={`Informações sobre ${client.nome}`}
                          />
                        </Link>
                      </OverlayTrigger>

                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className={styles.noRecords}>
                      Nenhum registro encontrado
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <div
            className={`${styles.pagination} ${
              currentClients.length ? '' : styles.hidden
            }`}
          >
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              aria-label="Página anterior"
            >
              <ChevronLeft />
            </button>
            {generatePagination().map((page, index) =>
              typeof page === 'number' ? (
                <span
                  key={index}
                  className={`${styles.pageNumber} ${
                    currentPage === page ? styles.activePage : ''
                  }`}
                  onClick={() => handlePageChange(page)}
                  aria-current={currentPage === page ? 'page' : undefined}
                  role="button"
                >
                  {page}
                </span>
              ) : (
                <span key={index} className={styles.ellipsis} aria-hidden="true">
                  {page}
                </span>
              )
            )}
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              aria-label="Próxima página"
            >
              <ChevronRight />
            </button>


             {/* Modal personalizado */}
            <Modal
              show={showModalCreateCompra}
              onHide={handleCloseModalCreateCompra}
              className={styles.customModal}
              size="lg"
            >
              <div className={styles.customModalHeader}>
              <h2> {selectedClient?.nome}</h2>
              
                <button onClick={handleCloseModalCreateCompra} className={styles.closeButton}>
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
                  value={dataCompra}
                  onChange={(e) => setDataCompra(e.target.value)}
                  className={styles.customFormControl}
                />
              </div>

                <div className={styles.formGroup}>
                  <label htmlFor="descricaoCompra" className={styles.customFormLabel}>Descrição</label>
                  <input
                    id="descricaoCompra"
                    type="text"
                    required
                    placeholder="Descrição"
                    value={descricaoCompra}
                    onChange={(e) => setDescricaoCompra(e.target.value)}
                    autoFocus
                    className={styles.customFormControl}
                  />
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="totalCompra" className={styles.customFormLabel}>Total</label>
                  <input
                    id="totalCompra"
                    type="text"
                    required
                    placeholder="Valor"
                    value={totalCompra}
                    onChange={(e) => setTotalCompra(e.target.value)}
                    className={styles.customFormControl}
                  />
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="tipoCompra" className={styles.customFormLabel}>Tipo de Compra</label>
                  <select
                    id="tipoCompra"
                    required
                    value={tipoCompra}
                    onChange={(e) => setTipoCompra(e.target.value)}
                    className={styles.customFormControl}
                  >
                    <option value="" disabled>Selecione o tipo</option>
                    <option value="Produto">Produto</option>
                    <option value="Serviço">Serviço</option>
                  </select>
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="statusCompra" className={styles.customFormLabel}>Status</label>
                  <input
                    id="statusCompra"
                    type="text"
                    required
                    placeholder="Status"
                    value={statusCompra}
                    onChange={(e) => setStatusCompra(e.target.value)}
                    className={styles.customFormControl}
                  />
                </div>

                <div className={styles.buttonContainer}>
                  <button type="submit" className={styles.customBtnPrimary}>
                  Cadastrar Compra
                  </button>
                  <button type="button" onClick={handleCloseModalCreateCompra} className={styles.customBtnSecondary}>
                    Fechar
                  </button>
                </div>
              </form>

              </div>
            
            </Modal>

            
          </div>
          <ToastContainer />
        </>
      )}
    </div>
  );
  
}
