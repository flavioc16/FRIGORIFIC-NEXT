import { useState, useEffect, useRef, useMemo } from 'react';
import { Search, X, ChevronLeft, ChevronRight, Info } from 'lucide-react';
import styles from './styles.module.scss';
import Link from 'next/link';

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


interface TableComprasProps {
  compras: Compra[];
  loading: boolean;
  clienteNome: string | null; // Adicione esta prop
}

export function TableCompras({ compras, loading, clienteNome }: TableComprasProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [comprasPerPage, setComprasPerPage] = useState(10);
  const [somaAtual, setSomaAtual] = useState<number>(0);

  const inputRef = useRef<HTMLInputElement>(null);

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
          <h1>{clienteNome}</h1> {/* Exiba o nome do cliente aqui */}
            <div className={styles.headerControls}>
              <div className={styles.resultsPerPage}>
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
                      <Link href={`/dashboard/compra/${compra.id}`}>
                        <Info
                          className={styles.iconInfo}
                          role="button"
                          aria-label={`Informações sobre compra ${compra.id}`}
                        />
                      </Link>
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
        </>
      )}
    </div>
  );
}
