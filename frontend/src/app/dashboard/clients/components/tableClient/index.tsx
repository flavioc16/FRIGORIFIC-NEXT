import { useState, useEffect, useRef, useMemo } from 'react';
import { Search, X, ChevronLeft, ChevronRight, Plus, UserPen, Trash } from 'lucide-react';
import styles from './styles.module.scss';
import stylesModal from './stylesModal.module.scss'
import { useFocus } from '@/app/context/FocusContext';
import ButtonAdd from '@/app/dashboard/components/buttonAdd';
import { api } from '@/services/api';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Modal, Tooltip, OverlayTrigger, Popover } from 'react-bootstrap';
import { getCookie } from 'cookies-next';

import { useOutsideClick } from '@/app/hooks/useOutsideClick';

export interface User {
  id: string;
  name: string;
  username: string;
  password: string;
  role: string;
  created_at: string;
  updated_at: string;
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
  user?: User;
}

interface ClientDelete {
  name: string;
  id: string;
}

interface TableClientsProps {
  clients: Client[];
  loading: boolean;
}

export function TableClients({ clients, loading }: TableClientsProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [clientsPerPage] = useState(10);
  const inputRef = useRef<HTMLInputElement>(null);
  const { isMenuInputFocused, setIsMenuInputFocused } = useFocus();

  const [showModal, setShowModal] = useState(false);
  const [showModalDelete, setShowModalDelete] = useState(false);
  const [nome, setNome] = useState<string | undefined>();
  const [email, setEmail] = useState<string | undefined>('email');
  const [telefone, setTelefone] = useState('');
  const [endereco, setEndereco] = useState<string | undefined>();
  const [referencia, setReferencia] = useState<string | undefined>();
  const [username, setUsername] = useState<string | undefined>();
  const [password, setPassword] = useState('');

  const [clientName, setClientName] = useState('');
  const [id, setClientId] = useState<string | null>(null);

  const [isEdit, setIsEdit] = useState(false); // Novo estado para controlar se é edição


  //const [infoVisible, setInfoVisible] = useState<string | null>(null);
  //const infoOptionsRef = useRef<HTMLDivElement>(null);

  //useOutsideClick(infoOptionsRef, () => setInfoVisible(null));

  const popoverContent = (
    <Popover id="popover-basic" className={styles.Popover}>
      <Popover.Header as="h3" className={styles.PopoverHeader}>
        Clique para cadastrar um cliente
      </Popover.Header>
      <Popover.Body className={styles.PopoverBody}>
        Adicione um novo cliente ao sistema para adicionar novas compras!
      </Popover.Body>
    </Popover>
  );

  const handleOpenCreateModal  = () => {
    setIsEdit(false); // Modo de cadastro
    setNome('');
    setEmail('');
    setTelefone('');
    setEndereco('');
    setReferencia('');
    setUsername('');
    setPassword('');
    setShowModal(true);
  };

  const handleOpenEditModal = (client: Client) => {
    setClientId(client.id);
    setIsEdit(true);
    setNome(client.nome || '');  // Valor padrão para evitar undefined
    setEmail(client.email || '');
    setTelefone(client.telefone || '');
    setEndereco(client.endereco || '');
    setReferencia(client.referencia || '');
    setUsername(client.user?.username || '');  // Verifica se o username existe na relação User
    setPassword(''); // Não preenche o password por segurança
    setShowModal(true);
  };

  const handleOpenModalDelete = (name: string, id: string) => {
    setClientName(name);
    setClientId(id);
    setShowModalDelete(true);
  };

  const handleCloseModalDelete = () => {
    setShowModalDelete(false);
    setClientName(''); 
    setClientId('');
  };
  

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
  
    try {
      const token = getCookie("token");
  
      if (!token) {
        toast.error("Token de autenticação não encontrado. Faça login novamente.");
        return;
      }
  
      // Cria o objeto clientData a partir dos estados
      const clientData = {
        nome,
        endereco,
        referencia,
        email,
        telefone,
        ...(isEdit 
          ? { 
              user: { // Estrutura para edição
                username,
                password, // Incluindo senha para atualização (se necessário)
              },
              id // Inclui o ID na edição
            }
          : { 
              username, // Estrutura para cadastro
              password  // Incluindo senha para cadastro
            }
        ),
      };
      
      if (isEdit) {
        if (!id) {
          throw new Error("ID do cliente não fornecida.");
        }
  
        const response = await api.put(`/clients`, clientData, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
  
         const updatedClientName = response.data.nome || "Cliente";
        
        toast.success(`Cliente ${updatedClientName} editado com sucesso.`);
        console.log("Cliente editado com sucesso:", response.data);

      } else {
        const response = await api.post("/clients", clientData, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const newClientName = response.data.cliente?.nome || "Novo cliente";
        
        toast.success(`Cliente ${newClientName} cadastrado com sucesso.`);
        console.log("Cliente cadastrado com sucesso:", response.data.nome);
      }
  
      // Reseta o formulário após a ação (cadastro ou edição)
      setNome('');
      setEmail('');
      setTelefone('');
      setEndereco('');
      setReferencia('');
      setUsername('');
      setPassword('');
  
      handleCloseModal(); // Fecha o modal ao terminar
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const errorMessage = error.response?.data?.error || (isEdit ? "Erro ao editar cliente." : "Erro ao cadastrar cliente.");
        toast.error(errorMessage);
        console.error("Erro ao processar cliente:", error.response?.data);
      } else {
        toast.error("Erro desconhecido.");
        console.error("Erro desconhecido:", error);
      }
    }
  };

  const handleConfirmDelete = async () => { 
    try {
      const token = getCookie('token'); // Obtém o token de autenticação
  
      if (!token) {
        toast.error('Token de autenticação não encontrado. Faça login novamente.');
        return;
      }
  
      // Envia a ID como um JSON no corpo da requisição DELETE
      const response = await api.delete(`/clients`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json', // Certifique-se de definir o tipo de conteúdo como JSON
        },
        data: {
          id: id, // Enviando a ID no corpo da requisição
        },
      });
  
      toast.success(`Cliente ${clientName} excluído com sucesso.`);
      console.log("Cliente excluído com sucesso:", response.data);
  
      handleCloseModalDelete(); // Fecha o modal ao terminar
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const errorMessage = error.response?.data?.error || "Erro ao excluir cliente.";
        toast.error(errorMessage);
        console.error("Erro ao excluir cliente:", error.response?.data);
      } else {
        toast.error("Erro desconhecido.");
        console.error("Erro desconhecido:", error);
      }
    }
  };



  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isMenuInputFocused) {
        setSearchTerm('');
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isMenuInputFocused]);

  const handleSearchClear = () => setSearchTerm('');

  const filteredClients = useMemo(() => {
    return clients.filter((client) =>
        // Verifica valores de nível superior do cliente
        Object.values(client).some(value => 
            typeof value === 'string' && value.toLowerCase().includes(searchTerm.toLowerCase())
        ) 
        // Verifica especificamente o username dentro de user
        || (client.user?.username && client.user.username.toLowerCase().includes(searchTerm.toLowerCase()))
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
            <ButtonAdd
              onClick={handleOpenCreateModal}
              label="Cadastrar Cliente"
              icon={<Plus style={{ width: '19px', height: '18px' }} />}
              iconStyle={{
                fontSize: '20px', // Ajusta o tamanho do ícone
                marginLeft: '4px', // Ajusta o espaçamento do ícone
                marginRight: '-4px', // Ajusta o espaçamento do ícone
                marginBottom:'3px'
              }}
              popover={popoverContent} // Passa o conteúdo do Popover
            />
              <div className={styles.searchContainer}>
                <input
                  type="text"
                  placeholder="Buscar Cliente"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className={styles.filterInput}
                  ref={inputRef}
                  aria-label="Buscar Cliente"
                  onFocus={() => setIsMenuInputFocused(true)}
                  onBlur={() => setIsMenuInputFocused(false)}
                />
                {searchTerm ? (
                  <X className={styles.clearIcon} onClick={handleSearchClear} role="button" aria-label="Limpar pesquisa" />
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
                  <th>Endereço</th>
                  <th>Referência</th>
                  <th>Email</th>
                  <th>Telefone</th>
                  <th>Username</th>
                  <th>Ação</th>
                </tr>
              </thead>
              <tbody>
                {currentClients.length > 0 ? (
                  currentClients.map((client) => (
                    <tr key={client.id}>
                      <td>{client.nome}</td>
                      <td>{client.endereco || ''}</td>
                      <td>{client.referencia || ''}</td>
                      <td>{client.email || ''}</td>
                      <td>{client.telefone}</td>
                      <td>{client.user?.username || ''}</td>
                      <td className={styles.actionIcons}>
                        {/* Tooltip para o ícone UserPen */}
                        <OverlayTrigger
                          trigger={['hover', 'focus']}
                          placement="top"
                          overlay={
                            <Tooltip id={`tooltip-user-${client.id}`} className={styles.customTooltip}>
                              Editar {client.nome}
                            </Tooltip>
                          }
                        >
                          <UserPen
                            className={styles.iconUser}
                            role="button"
                            aria-label={`Editar ${client.nome}`}
                            onClick={() => handleOpenEditModal(client)} 
                          />
                        </OverlayTrigger>


                        {/* Tooltip para o ícone Trash */}
                        <OverlayTrigger
                          trigger={['hover', 'focus']}
                          placement="top"
                          overlay={
                            <Tooltip id={`tooltip-trash-${client.id}`} className={styles.customTooltip}>
                              Deletar {client.nome}
                            </Tooltip>
                          }
                        >
                          <Trash
                            className={styles.iconTrash}
                            role="button"
                            aria-label={`Deletar ${client.nome}`}
                            onClick={() => handleOpenModalDelete(client.nome, client.id)}
                          />
                        </OverlayTrigger>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={8} className={styles.noRecords}>
                      Nenhum registro encontrado
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <div className={`${styles.pagination} ${currentClients.length ? '' : styles.hidden}`}>
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

          {/* Modal personalizado */}
          <Modal
            show={showModal}
            onHide={handleCloseModal}
            className={styles.customModal}
            size="lg"
          >
            <div className={styles.customModalHeader}>
              <h2>{isEdit ? 'Editar Cliente' : 'Preencha os dados do cliente'}</h2>
              <button onClick={handleCloseModal} className={styles.closeButton}>
                <X size={24} color="var(--white)" />
              </button>
            </div>
            <div className={styles.customModalBody}>
              <form onSubmit={handleSubmit}>
                <div className={styles.formGroup}>
                  <label htmlFor="clientNome" className={styles.customFormLabel}>Nome</label>
                  <input
                    id="clientNome"
                    type="text"
                    required
                    placeholder="Nome do cliente"
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                    autoFocus
                    className={styles.customFormControl}
                  />
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="clientEndereco" className={styles.customFormLabel}>Endereço</label>
                  <input
                    id="clientEndereco"
                    type="text"
                    required
                    placeholder="Endereço do cliente"
                    value={endereco}
                    onChange={(e) => setEndereco(e.target.value)}
                    className={styles.customFormControl}
                  />
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="clientReferencia" className={styles.customFormLabel}>Referência</label>
                  <input
                    id="clientReferencia"
                    placeholder="Referência do cliente"
                    type="text"
                    required
                    value={referencia}
                    onChange={(e) => setReferencia(e.target.value)}
                    className={styles.customFormControl}
                  />
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="clientEmail" className={styles.customFormLabel}>Email</label>
                  <input
                    id="clientEmail"
                    type="email"
                    required
                    placeholder="Email do cliente"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={styles.customFormControl}
                  />
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="clientTelefone" className={styles.customFormLabel}>Telefone</label>
                  <input
                    id="clientTelefone"
                    type="text"
                    required
                    placeholder="Telefone do cliente"
                    value={telefone}
                    onChange={(e) => setTelefone(e.target.value)}
                    className={styles.customFormControl}
                  />
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="clientUsername" className={styles.customFormLabel}>Usuario</label>
                  <input
                    id="clientUsername"
                    type="text"
                    placeholder="Nome de usuário do cliente"
                    value={username}
                    required
                    onChange={(e) => setUsername(e.target.value)}
                    className={styles.customFormControl}
                  />
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="clientPassword" className={styles.customFormLabel}>Senha</label>
                  <input
                    id="clientPassword"
                    type="password"
                    placeholder="Senha do cliente"
                    value={password}
                    
                    onChange={(e) => setPassword(e.target.value)}
                    className={styles.customFormControl}
                  />
                </div>

                <div className={styles.buttonContainer}>
                  <button type="submit" className={styles.customBtnPrimary}>
                    {isEdit ? 'Salvar Alterações' : 'Cadastrar'}
                  </button>
                  <button type="button" onClick={handleCloseModal} className={styles.customBtnSecondary}>
                    Fechar
                  </button>
                </div>
              </form>
            </div>
          
          </Modal>
          {/* Modal personalizado */}
          <Modal
            show={showModalDelete}
            onHide={handleCloseModalDelete}
            className={stylesModal.customModal}
            size="sm"
          >
            <div className={stylesModal.customModalHeader}>
              <h2>Deseja realmente excluir o cliente {clientName}?</h2>
              <button onClick={handleCloseModalDelete} className={stylesModal.closeButton}>
                <X size={24} color="var(--white)" /> {/* Ícone de fechar */}
              </button>
            </div>
            <div className={stylesModal.customModalBody}>
              <div className={stylesModal.buttonContainer}>
                <button onClick={handleConfirmDelete} className={stylesModal.customBtnPrimary}>
                  Excluir
                </button>
                <button onClick={handleCloseModalDelete} className={stylesModal.customBtnSecondary}>
                  Cancelar
                </button>
              </div>
            </div>
          </Modal>

          <ToastContainer />
        </>
      )}
    </div>
  );
}
