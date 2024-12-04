import { useState, useEffect, useRef, useMemo } from 'react';
import { Search, X, ChevronLeft, ChevronRight, Info, FilePenLine, Trash, Plus } from 'lucide-react';
import styles from './styles.module.scss';

import Link from 'next/link';
import { OverlayTrigger, Popover, Tooltip } from 'react-bootstrap';
import ButtonAdd from '@/app/dashboard/components/buttonAdd';

import { getCookie } from 'cookies-next';

import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { api } from '@/services/api';
import axios from 'axios';
import CreatePurchaseModal from '../../components/modalEfetuarCompra';
import DeleteModal from '../../components/modalDelete';

export interface Compra {
  id: string;
  descricaoCompra: string;
  dataDaCompra?: string;  // Torne-a opcional se não for sempre preenchida
  totalCompra: number;
  tipoCompra: number;
  statusCompra: number;
  created_at: string;
  updated_at: string;
  clienteId: string;
  cliente?: {
    nome: string;
  };
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


export interface TableComprasProps {
  compras: Compra[];
  cliente: Client | null; // Agora o cliente pode ser um objeto ou null
  loading: boolean;
}

export function TableCompras({ compras, loading, cliente}: TableComprasProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [comprasPerPage, setComprasPerPage] = useState(10);
  const [somaAtual, setSomaAtual] = useState<number>(0);
  const [showModalDelete, setShowModalDelete] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [isEdit, setIsEdit] = useState(false); // Novo estado para controlar se é edição
  const [id, setCompraId] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const [dataCompra, setDataCompra] = useState('');
  const [created_at, setCreatedAt] = useState('');
  const [descricaoCompra, setDescricaoCompra] = useState<string | undefined>();
  const [totalCompra, setTotalCompra] = useState<string>("0,00"); // Inicializa vazio
  const [rawValue, setRawValue] = useState<number>(0);
  const [tipoCompra, setTipoCompra] = useState<string | null>('');  
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [selectedCompra, setSelectedCompra] = useState<Compra | null>(null);



 


  useEffect(() => {
    if (cliente) {
      setSelectedClient(cliente);
    }
  }, [cliente]);

  const handleOpenCreatePurshasesModal  = () => {
    setIsEdit(false); // Modo de cadastro
    setShowModal(true);
    setDescricaoCompra('');
    setTotalCompra("0,00");
    setTipoCompra('');
  };

  const handleOpenEditPurchaseModal = (compra: Compra) => {
    setSelectedCompra(compra);  // Atualiza o estado da compra selecionada
  
    // Agora você pode usar esse estado para preencher o formulário do modal
    setIsEdit(true);
    setDataCompra(compra.dataDaCompra || ""); // Garante um valor padrão
    setCreatedAt(compra.created_at);
    setDescricaoCompra(compra.descricaoCompra || "");
    setRawValue(compra.totalCompra || 0);
    setTotalCompra(
      (compra.totalCompra || 0).toLocaleString("pt-BR", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })
    );
    setTipoCompra(compra.tipoCompra?.toString() || null); // Converte para string ou null
    setShowModal(true);
  };
  
  

  const handleCloseCreatePurshasesModal =  () => {
    setIsEdit(false); // Modo de cadastro
    setShowModal(false);
  };

  const popoverContent = (
    <Popover id="popover-basic" className={styles.Popover}>
      <Popover.Header as="h3" className={styles.PopoverHeader}>
        Cadastrar nova compra
      </Popover.Header>
      <Popover.Body className={styles.PopoverBody}>
        Click para adicionar novas compras!
      </Popover.Body>
    </Popover>
  );

  const handleOpenModalDelete = (id: string) => {
    setCompraId(id);
    setShowModalDelete(true);
  };

  const handleCloseModalDelete = () => {
    setShowModalDelete(false);
    setCompraId('');
  };
  
  const handleConfirmDelete = async () => {

    toast.dismiss();
    try {
      const token = getCookie('token'); // Obtém o token de autenticação
  
      if (!token) {
        toast.error('Token de autenticação não encontrado. Faça login novamente.');
        return;
      }
  
      // Envia a requisição DELETE para a API
      const response = await api.delete('/compras', {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        data: {
          id: id, // Envia o ID da compra no corpo da requisição
        },
      });
  
      toast.success(`Compra excluída com sucesso.`);
      console.log('Compra excluída com sucesso:', response.data);
  
      // Feche o modal ou atualize a UI conforme necessário
      handleCloseModalDelete(); 
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const errorMessage = error.response?.data?.error || 'Erro ao excluir compra.';
        toast.error(errorMessage);
        console.error('Erro ao excluir compra:', error.response?.data);
      } else {
        toast.error('Erro desconhecido.');
        console.error('Erro desconhecido:', error);
      }
    }
  };

  const modalTitle = "Deseja realmente excluir esta compra?"; // Título dinâmico

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Verifica se o modal está fechado e o input do menu está focado
      if (event.key === 'Escape' ) {
        setSearchTerm(''); // Reseta o searchTerm apenas quando o modal estiver fechado
      }
    };
  
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []); // Dependência de isModalOpen

  useEffect(() => {
    setCurrentPage(1); // Reseta para a primeira página quando o termo de busca muda
  }, [searchTerm]);

  function formatDate(dateString: string): string {
    if (!dateString) return '';
  
    const date = new Date(dateString);
    // Ajusta a data conforme o fuso horário universal
    date.setMinutes(date.getMinutes() + date.getTimezoneOffset());
  
    // Retorna a data formatada no padrão brasileiro
    return date.toLocaleDateString('pt-BR');
  }

  function adjustDate(dateString: string): string {
    return formatDate(dateString); // Utiliza a mesma função de formatação
  }
  
  const filteredCompras = useMemo(() => {
    const filtered = compras.filter((compra) => {
      const searchLower = searchTerm.toLowerCase();
  
      // Utilize a função unificada para formatar a data
      const formattedDate = formatDate(compra.created_at);
  
      const formatCurrency = (value: number): string => {
        return value
          .toFixed(2)
          .replace('.', ',');
      };
  
      return (
        compra.descricaoCompra.toLowerCase().includes(searchLower) ||
        formattedDate.includes(searchLower) ||
        formatCurrency(compra.totalCompra).includes(searchLower)
      );
    });
  
    const total = filtered.reduce((acc, compra) => acc + compra.totalCompra, 0);
    setSomaAtual(total);
  
    return filtered;
  }, [compras, searchTerm]);
  
  const indexOfLastCompra = currentPage * comprasPerPage;
  const indexOfFirstCompra = indexOfLastCompra - comprasPerPage;
  const currentCompras = filteredCompras.slice(indexOfFirstCompra, indexOfLastCompra);
  const totalPages = Math.ceil(filteredCompras.length / comprasPerPage);

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

    return pagination;
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
          
          <h1>{cliente ? `${cliente.nome} - ${cliente.referencia}` : 'Cliente não encontrado'}</h1>
          
            <div className={styles.headerControls}>
              <div className={styles.resultsPerPage}>
                <ButtonAdd
                  onClick={handleOpenCreatePurshasesModal}
                  label="Cadastrar compra"
                  icon={<Plus style={{ width: '19px', height: '18px' }} />}
                  iconStyle={{
                    fontSize: '20px', // Ajusta o tamanho do ícone
                    marginLeft: '4px', // Ajusta o espaçamento do ícone
                    marginRight: '-4px', // Ajusta o espaçamento do ícone
                    marginBottom:'3px'
                  }}
                  popover={popoverContent}
                  
                  // Passa o conteúdo do Popover
                />
                <label htmlFor="resultsPerPage">Exibir:</label>
                <select
                  id="resultsPerPage"
                  value={comprasPerPage}
                  onChange={(e) => setComprasPerPage(Number(e.target.value))}
                  className={styles.customSelect}
                  aria-label="Número de compras por página"
                >
                  <option value={10}>10</option>
                  <option value={50}>50</option>
                  <option value={100}>100</option>
                </select>
                <label htmlFor="resultsPerPage" className={styles.ppage}>por página</label>
              </div>
              <div className={styles.searchContainer}>
                <input
                  type="text"
                  placeholder="Buscar Compra"
                  value={searchTerm}
                  autoFocus
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className={styles.filterInput}
                  ref={inputRef}
                  aria-label="Buscar Compra"
                />
                {searchTerm ? (
                  <X
                    className={styles.clearIcon}
                    onClick={() => setSearchTerm('')}
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
          <table className={styles.comprasTable}>
            <thead>
              <tr>
                <th>Data da compra</th>
                <th>Descrição</th>
                <th>Total</th>
                <th>Ação</th>
              </tr>
            </thead>
            <tbody>
              {currentCompras.length > 0 ? (
                currentCompras.map((compra) => (
                  <tr key={compra.id}>
                    <td>{adjustDate(compra.created_at ?? '')}</td>
                    <td>{compra.descricaoCompra}</td>
                    <td>
                      {compra.totalCompra.toLocaleString('pt-BR', {
                        style: 'currency',
                        currency: 'BRL',
                      })}
                    </td>
                    <td className={styles.actionIcons}>
                    <OverlayTrigger
                      trigger={['hover', 'focus']}
                      placement="top"
                      overlay={
                        <Tooltip id={`tooltip-info-${compra.id}`} className={styles.customTooltip}>
                          Informações
                        </Tooltip>
                      }
                    >
                      <Link href={`/dashboard/compra/${compra.id}`}>
                        <Info
                          className={styles.iconInfo}
                          role="button"
                          aria-label={`Informações sobre compra ${compra.id}`}
                        />
                      </Link>
                    </OverlayTrigger>

                    <OverlayTrigger
                      trigger={['hover', 'focus']}
                      placement="top"
                      overlay={
                        <Tooltip id={`tooltip-plus-${compra.id}`} className={styles.customTooltip}>
                          Editar compra
                        </Tooltip>
                      }
                    >
                      <FilePenLine
                        className={styles.iconPlus}
                        role="button"
                        aria-label="Adicionar"
                        onClick={() => handleOpenEditPurchaseModal(compra)} 
                      />
                    </OverlayTrigger>

                    <OverlayTrigger
                        trigger={['hover', 'focus']}
                        placement="top"
                        overlay={
                          <Tooltip id={`tooltip-trash-${compra.id}`} className={styles.customTooltip}>
                            Deletar 
                          </Tooltip>
                        }
                      >
                        <Trash
                          className={styles.iconTrash}
                          role="button"
                          aria-label={`Deletar ${compra.id}`}
                          onClick={() => handleOpenModalDelete(compra.id)}
                        />
                      </OverlayTrigger>

                      
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className={styles.noRecords}>
                    Nenhuma compra encontrada
                  </td>
                </tr>
              )}
            </tbody>
            {currentCompras.length > 0 && (
              <tfoot>
              <tr className={styles.totalRow}>
                <td colSpan={2} style={{ textAlign: 'left', padding: '10px' }}>
                  TOTAL 
                </td>
                  <td colSpan={2} className={styles.totalValue}>
                    {somaAtual.toLocaleString('pt-BR', {
                      style: 'currency',
                      currency: 'BRL',
                    })}
                  </td>
              </tr>
            </tfoot>
            )}
          </table>
          </div>
          <div className={`${styles.pagination} ${currentCompras.length ? '' : styles.hidden}`}>
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
                  className={`${styles.pageNumber} ${currentPage === page ? styles.activePage : ''}`}
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
          </div>

          {/* Modal delete */}
          <DeleteModal
            showModalDelete={showModalDelete}
            handleCloseModalDelete={handleCloseModalDelete}
            handleConfirmDelete={handleConfirmDelete}
            modalTitle={modalTitle} // Passando o título dinâmico como prop
          />

          <CreatePurchaseModal
              show={showModal}
              isEdit={isEdit} 
              onClose={handleCloseCreatePurshasesModal} 
              selectedClient={selectedClient}
              selectedCompra={selectedCompra}
              descricaoCompra={descricaoCompra}
              totalCompra={totalCompra}
              created_at={created_at}
              tipoCompra={tipoCompra}
              setCreatedAt={setCreatedAt}
              setDescricaoCompra={setDescricaoCompra}
              setTotalCompra={setTotalCompra}
              setTipoCompra={setTipoCompra}
              dataCompra={dataCompra}
              rawValue={rawValue}
              setDataCompra={setDataCompra}
              setRawValue={setRawValue}
            />

          <ToastContainer />
        </>
      )}
    </div>
  );
}
