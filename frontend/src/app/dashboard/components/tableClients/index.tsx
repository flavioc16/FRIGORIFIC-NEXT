import { useState, useEffect, useRef } from 'react';
import { Search, X, ChevronLeft, ChevronRight, Plus, Info } from 'lucide-react';
import styles from './styles.module.scss';
import { useFocus } from '@/app/context/FocusContext';

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

export function TableClients({ clients, loading }: TableClientsProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [clientsPerPage, setClientsPerPage] = useState(10);

  const inputRef = useRef<HTMLInputElement>(null);
  const { isMenuInputFocused, setIsMenuInputFocused } = useFocus(); // Pegando o contexto

  const [mouseMoved, setMouseMoved] = useState(false);

  const applyFocus = () => {
    if (!isMenuInputFocused && inputRef.current && !mouseMoved) {
      inputRef.current.focus();
    }
  };
  
  useEffect(() => {
    const intervalId = setInterval(() => {
      applyFocus();
    }, 3000);
  
    return () => clearInterval(intervalId); // Limpa o intervalo ao desmontar o componente
  }, [isMenuInputFocused, mouseMoved]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isMenuInputFocused) {
        // Clear the search term only if the menu input is focused
        setSearchTerm('');
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isMenuInputFocused]); 


  useEffect(() => {
    const handleMouseMove = () => {
      setMouseMoved(true);
      setTimeout(() => setMouseMoved(false), 3000); // Reseta o estado após 3 segundos
    };
  
    window.addEventListener('mousemove', handleMouseMove);
  
    return () => window.removeEventListener('mousemove', handleMouseMove); // Limpa o evento ao desmontar o componente
  }, []);
  
  
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

  const filteredClients = clients.filter((client) =>
    client.nome.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
                >
                  <option value={10}>10</option>
                  <option value={50}>50</option>
                  <option value={100}>100</option>
                </select>
                <label htmlFor="resultsPerPage" className={styles.ppage}>
                  {' '}
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
                />
                {searchTerm ? (
                  <X className={styles.clearIcon} onClick={handleSearchClear} />
                ) : (
                  <Search className={styles.searchIcon} />
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
                        <Plus
                          className={styles.iconPlus}
                          onClick={() => console.log(`Adicionar ${client.nome}`)}
                        />
                        <Info
                          className={styles.iconInfo}
                          onClick={() => console.log(`Informações sobre ${client.nome}`)}
                        />
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
          <div className={`${styles.pagination} ${currentClients.length ? '' : styles.hidden}`}>
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              <ChevronLeft />
            </button>
            {generatePagination().map((page, index) =>
              typeof page === 'number' ? (
                <span
                  key={index}
                  className={`${styles.pageNumber} ${currentPage === page ? styles.activePage : ''}`}
                  onClick={() => handlePageChange(page)}
                >
                  {page}
                </span>
              ) : (
                <span key={index} className={styles.ellipsis}>
                  {page}
                </span>
              )
            )}
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              <ChevronRight />
            </button>
          </div>
        </>
      )}
    </div>
  );
}
