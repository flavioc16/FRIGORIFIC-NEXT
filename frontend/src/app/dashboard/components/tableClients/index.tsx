import React, { useState, useEffect, useRef } from 'react';
import { Search, X, ChevronLeft, ChevronRight } from 'lucide-react'; // Importa o ícone X
import styles from './styles.module.scss';

// Definição da interface Client
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

// Define a tipagem das props do componente
interface TableClientsProps {
    clients: Client[];
    loading: boolean; // Adicionando a propriedade loading
}

export function TableClients({ clients, loading }: TableClientsProps) {
    const [searchTerm, setSearchTerm] = useState(''); // Termo de busca
    const [currentPage, setCurrentPage] = useState(1); // Página atual
    const [clientsPerPage, setClientsPerPage] = useState(10); // Clientes por página
    const [isFocusing, setIsFocusing] = useState(true); // Controle de foco automático

    const intervalIdRef = useRef<NodeJS.Timeout | null>(null); // ID do intervalo de foco
    const inputRef = useRef<HTMLInputElement>(null); // Referência para o input de busca

    useEffect(() => {
        if (isFocusing) resetFocusInterval(); // Inicia o intervalo de foco automático

        const handleMouseMove = () => resetFocusInterval(); // Reinicia o intervalo ao mover o mouse
        window.addEventListener('mousemove', handleMouseMove);

        return () => {
            if (intervalIdRef.current) clearInterval(intervalIdRef.current); // Limpa o intervalo ao desmontar
            window.removeEventListener('mousemove', handleMouseMove); // Remove o listener do mouse
        };
    }, [isFocusing]);

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                setSearchTerm(''); // Limpa o campo de busca ao pressionar "Esc"
            }
        };

        window.addEventListener('keydown', handleKeyDown);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, []);

    const resetFocusInterval = () => {
        if (intervalIdRef.current) clearInterval(intervalIdRef.current); // Limpa o intervalo existente
        intervalIdRef.current = setInterval(() => inputRef.current?.focus(), 10000); // Foco automático a cada 10 segundos
    };

    const filteredClients = clients.filter(client =>
        client.nome.toLowerCase().includes(searchTerm.toLowerCase())
    );
    const indexOfLastClient = currentPage * clientsPerPage;
    const indexOfFirstClient = indexOfLastClient - clientsPerPage;
    const currentClients = filteredClients.slice(indexOfFirstClient, indexOfLastClient);
    const totalPages = Math.ceil(filteredClients.length / clientsPerPage);

    const handlePageChange = (pageNumber: number) => setCurrentPage(pageNumber);
    const handleClientsPerPageChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setClientsPerPage(Number(event.target.value));
        setCurrentPage(1); // Reinicia para a primeira página ao mudar o número de resultados
        setIsFocusing(false); // Desativa o foco automático
    };

    const handleSelectFocus = (event: React.FocusEvent<HTMLSelectElement>) => 
        event.target.classList.add(styles.dropdownExpanded);
    const handleSelectBlur = (event: React.FocusEvent<HTMLSelectElement>) => 
        event.target.classList.remove(styles.dropdownExpanded);

    const handleSearchClear = () => setSearchTerm(''); // Função para limpar o campo de busca

    const hasRecords = filteredClients.length > 0; // Verifica se há registros

    return (
        <div className={styles.tableWrapper}>
            {loading ? (
                <div className={styles.loadingSpinner}>
                    <div className={styles.spinner}></div>
                </div>
            ) : (
                <>
                    <div className={styles.horizontalBorder}></div>
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
                                <label htmlFor="resultsPerPages"> por página</label>
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
                                    <X
                                        className={styles.clearIcon}
                                        onClick={handleSearchClear} // Limpa o campo de pesquisa ao clicar no ícone "X"
                                    />
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
                                    <th>Email</th>
                                    <th>Telefone</th>
                                    <th>Endereço</th>
                                    <th>Ação</th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentClients.length > 0 ? (
                                    currentClients.map(client => (
                                        <tr key={client.id}>
                                            <td>{client.nome}</td>
                                            <td>{client.referencia || ""}</td>
                                            <td>{client.email || ""}</td>
                                            <td>{client.telefone}</td>
                                            <td>{client.endereco || ""}</td>
                                            <td>{/* Ações para o cliente, se houver */}</td>
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
                        {Array.from({ length: totalPages }, (_, index) => (
                            <span
                                key={index + 1}
                                className={`${styles.pageNumber} ${currentPage === index + 1 ? styles.active : ''}`}
                                onClick={() => handlePageChange(index + 1)}
                            >
                                {index + 1}
                            </span>
                        ))}
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
