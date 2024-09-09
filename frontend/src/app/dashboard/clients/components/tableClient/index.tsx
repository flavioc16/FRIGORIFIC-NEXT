import { useState, useEffect, useRef, useMemo } from 'react';
import { Search, X, ChevronLeft, ChevronRight, Plus, Info } from 'lucide-react';
import styles from './styles.module.scss';
import { useFocus } from '@/app/context/FocusContext';
import ButtonAdd from '@/app/dashboard/components/buttonAdd';
import { api } from '@/services/api';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Modal, Form, Popover } from 'react-bootstrap';
import { getCookie } from 'cookies-next';

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
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('email@defaut.com');
  const [telefone, setTelefone] = useState('');
  const [endereco, setEndereco] = useState('');
  const [referencia, setReferencia] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

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

  const handleOpenModal = () => {
    setNome(nome);
    setEmail(email);
    setTelefone(telefone);
    setEndereco(endereco);
    setReferencia(referencia);
    setUsername(username);
    setPassword(password);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    try {
      const token = getCookie("token");

      const newClient = {
        nome,
        email,
        telefone,
        endereco,
        referencia,
        username,
        password,
      };

      const response = await api.post("/clients", newClient, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      toast.success("Cliente cadastrado com sucesso.");
      console.log("Cliente cadastrado com sucesso:", response.data);
      setNome('');
      setEmail('email@defaut.com');
      setTelefone('');
      setEndereco('');
      setReferencia('');
      setUsername('');
      setPassword('');
      handleCloseModal();
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const errorMessage = error.response?.data?.error || "Erro ao cadastrar cliente.";
        toast.error(errorMessage);
        console.error("Erro ao cadastrar cliente:", error.response?.data);
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
            <ButtonAdd
              onClick={handleOpenModal}
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
                  <th>Nome</th>
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
                      <td>{client.user?.name || ''}</td>
                      <td>{client.user?.username || ''}</td>
                      <td className={styles.actionIcons}>
                        <Plus
                          className={styles.iconPlus}
                          onClick={() => {
                            handleOpenModal();
                          }}
                          role="button"
                          aria-label={`Adicionar ${client.nome}`}
                        />
                        <Info
                          className={styles.iconInfo}
                          onClick={() => {
                            handleOpenModal();
                          }}
                          role="button"
                          aria-label={`Informações sobre ${client.nome}`}
                        />
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
            size='lg'
          >
            <Modal.Header closeButton className={styles.customModalHeader}>
              <Modal.Title>Cadastrar Cliente</Modal.Title>
            </Modal.Header>
            <Modal.Body className={styles.customModalBody}>
              <Form onSubmit={handleSubmit}>
                <Form.Group controlId="clientNome">
                  <Form.Label className={styles.customFormLabel}>Nome</Form.Label>
                  <Form.Control
                    type="text"
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                    autoFocus
                    className={styles.customFormControl}
                  />
                </Form.Group>
                <Form.Group controlId="clientEmail">
                  <Form.Label className={styles.customFormLabel}>Email</Form.Label>
                  <Form.Control
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={styles.customFormControl}
                  />
                </Form.Group>
                <Form.Group controlId="clientTelefone">
                  <Form.Label className={styles.customFormLabel}>Telefone</Form.Label>
                  <Form.Control
                    type="text"
                    value={telefone}
                    onChange={(e) => setTelefone(e.target.value)}
                    className={styles.customFormControl}
                  />
                </Form.Group>
                <Form.Group controlId="clientEndereco">
                  <Form.Label className={styles.customFormLabel}>Endereço</Form.Label>
                  <Form.Control
                    type="text"
                    value={endereco}
                    onChange={(e) => setEndereco(e.target.value)}
                    className={styles.customFormControl}
                  />
                </Form.Group>
                <Form.Group controlId="clientReferencia">
                  <Form.Label className={styles.customFormLabel}>Referência</Form.Label>
                  <Form.Control
                    type="text"
                    value={referencia}
                    onChange={(e) => setReferencia(e.target.value)}
                    className={styles.customFormControl}
                  />
                </Form.Group>
                <Form.Group controlId="clientUsername">
                  <Form.Label className={styles.customFormLabel}>Username</Form.Label>
                  <Form.Control
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className={styles.customFormControl}
                  />
                </Form.Group>
                <Form.Group controlId="clientPassword">
                  <Form.Label className={styles.customFormLabel}>Password</Form.Label>
                  <Form.Control
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={styles.customFormControl}
                  />
                </Form.Group>
                <button type="submit" className={styles.customBtnPrimary}>
                  Cadastrar
                </button>
              </Form>
            </Modal.Body>
            <Modal.Footer className={styles.customModalFooter}>
              <button onClick={handleCloseModal} className={styles.customBtnSecondary}>
                Fechar
              </button>
            </Modal.Footer>
          </Modal>
          <ToastContainer />
        </>
      )}
    </div>
  );
}
