import React, { useState, useEffect, useRef } from 'react';
import { Search, X, ChevronLeft, ChevronRight, Plus, Info } from 'lucide-react';
import styles from './styles.module.scss';
import Button from '../buttonEdit';

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
  const [isFocusing, setIsFocusing] = useState(true);

  const intervalIdRef = useRef<NodeJS.Timeout | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
    if (isFocusing) resetFocusInterval();

    const handleMouseMove = () => resetFocusInterval();
    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      if (intervalIdRef.current) clearInterval(intervalIdRef.current);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [isFocusing]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setSearchTerm('');
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const resetFocusInterval = () => {
    if (intervalIdRef.current) clearInterval(intervalIdRef.current);
    intervalIdRef.current = setInterval(() => inputRef.current?.focus(), 3000);
  };

  const filteredClients = clients.filter((client) =>
    client.nome.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const indexOfLastClient = currentPage * clientsPerPage;
  const indexOfFirstClient = indexOfLastClient - clientsPerPage;
  const currentClients = filteredClients.slice(indexOfFirstClient, indexOfLastClient);
  const totalPages = Math.ceil(filteredClients.length / clientsPerPage);

  const handlePageChange = (pageNumber: number) => setCurrentPage(pageNumber);

  const handleClientsPerPageChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setClientsPerPage(Number(event.target.value));
    setCurrentPage(1);
    setIsFocusing(false);
  };

  const handleSelectFocus = (event: React.FocusEvent<HTMLSelectElement>) =>
    event.target.classList.add(styles.dropdownExpanded);
  const handleSelectBlur = (event: React.FocusEvent<HTMLSelectElement>) =>
    event.target.classList.remove(styles.dropdownExpanded);

  const handleSearchClear = () => setSearchTerm('');

  const hasRecords = filteredClients.length > 0;

  const generatePagination = (): (number | string)[] => {
    const pagination: (number | string)[] = [];
    const maxPagesToShow = 5; // Máximo de páginas a serem exibidas
    const firstPage = 1;
    const lastPage = totalPages;

    // Caso especial: se o total de páginas for menor ou igual ao número máximo de páginas a serem exibidas
    if (totalPages <= maxPagesToShow) {
        for (let i = 1; i <= totalPages; i++) {
            pagination.push(i);
        }
    } else {
        // Se a página atual estiver nas primeiras páginas
        if (currentPage <= maxPagesToShow - 2) {
            for (let i = 1; i <= maxPagesToShow; i++) {
                pagination.push(i);
            }
            pagination.push('...', lastPage);
        }
        // Se a página atual estiver nas últimas páginas
        else if (currentPage >= totalPages - (maxPagesToShow - 2)) {
            pagination.push(firstPage, '...');
            for (let i = totalPages - (maxPagesToShow - 1); i <= totalPages; i++) {
                pagination.push(i);
            }
        }
        // Se a página atual estiver no meio
        else {
            pagination.push(firstPage, '...');
            for (let i = currentPage - 1; i <= currentPage + 1; i++) {
                pagination.push(i);
            }
            pagination.push('...', lastPage);
        }
    }

    // Remove duplicatas e ajusta as reticências
    const filteredPagination: (number | string)[] = [];
    pagination.forEach((page, index) => {
        if (page === '...') {
            // Adiciona reticências somente se não for a última adição
            if (filteredPagination[filteredPagination.length - 1] !== '...') {
                filteredPagination.push(page);
            }
        } else {
            filteredPagination.push(page);
        }
    });

    // Remove reticências duplicadas consecutivas
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
                          onClick={() => console.log(`Adicionar ${client.nome}`)} // Ação do ícone Plus
                        />
                        <Info
                          className={styles.iconInfo}
                          onClick={() => console.log(`Informações sobre ${client.nome}`)} // Ação do ícone Info
                        />
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className={styles.noRecords}>
                      Nenhum registro encontrado
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <div className={`${styles.pagination} ${hasRecords ? '' : styles.hidden}`}>
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
                  className={`${styles.pageNumber} ${
                    currentPage === page ? styles.active : ''
                  }`}
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
          <Button />
        </>
      )}
    </div>
  );
}
