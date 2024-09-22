import { useState, useEffect, useRef, useMemo } from 'react';
import { Search, X, ChevronLeft, ChevronRight, Info } from 'lucide-react';
import styles from './styles.module.scss';
import Link from 'next/link';

export interface Compra {
  id: string;
  descricaoCompra: string;
  totalCompra: number;
  tipoCompra: number;
  statusCompra: number;
  created_at: string;
  updated_at: string;
  clienteId: string;
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

  const inputRef = useRef<HTMLInputElement>(null);

  const filteredCompras = useMemo(() => {
    return compras.filter((compra) =>
      compra.descricaoCompra.toLowerCase().includes(searchTerm.toLowerCase())
    );
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
        <div className={styles.loadingLineContainer}>
          <div className={styles.loadingLine} style={{ width: '100%', height: '25px' }}></div>
          <div className={styles.loadingLine} style={{ width: '200px', height: '25px' }}></div>
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
                  <th>Descrição</th>
                  <th>Total</th>
                  <th>Tipo</th>
                  <th>Status</th>
                  <th>Data de Criação</th>
                  <th>Ação</th>
                </tr>
              </thead>
              <tbody>
                {currentCompras.length > 0 ? (
                  currentCompras.map((compra) => (
                    <tr key={compra.id}>
                      <td>{compra.descricaoCompra}</td>
                      <td>{compra.totalCompra}</td>
                      <td>{compra.tipoCompra}</td>
                      <td>{compra.statusCompra}</td>
                      <td>{new Date(compra.created_at).toLocaleDateString()}</td>
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
                    <td colSpan={7} className={styles.noRecords}>
                      Nenhuma compra encontrada
                    </td>
                  </tr>
                )}
              </tbody>
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
