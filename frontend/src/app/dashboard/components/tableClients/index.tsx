import React, { useState, useEffect, useRef } from 'react';
import { Search, ChevronLeft, ChevronRight } from 'lucide-react';
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
}

export function TableClients({ clients }: TableClientsProps) {
    const [searchTerm, setSearchTerm] = useState(''); // Estado para o termo de pesquisa
    const [currentPage, setCurrentPage] = useState(1); // Página atual
    const [clientsPerPage, setClientsPerPage] = useState(10); // Número de clientes por página
    const [isFocusing, setIsFocusing] = useState(true); // Estado para controlar o foco automático
    const inputRef = useRef<HTMLInputElement>(null); // Referência para o input

    // Função para filtrar os clientes com base no termo de pesquisa
    const filteredClients = clients.filter(client =>
        client.nome.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Paginação: calcular os clientes a serem exibidos na página atual
    const indexOfLastClient = currentPage * clientsPerPage;
    const indexOfFirstClient = indexOfLastClient - clientsPerPage;
    const currentClients = filteredClients.slice(indexOfFirstClient, indexOfLastClient);

    // Número total de páginas
    const totalPages = Math.ceil(filteredClients.length / clientsPerPage);

    // Função para mudar a página
    const handlePageChange = (pageNumber: number) => {
        setCurrentPage(pageNumber);
    };

    // Função para mudar o número de clientes por página
    const handleClientsPerPageChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setClientsPerPage(Number(event.target.value));
        setCurrentPage(1); // Reinicia a página para a primeira ao mudar o número de resultados por página
        setIsFocusing(false); // Desativa o foco automático
    };

    // Função para adicionar/remover a classe que expande o dropdown
    const handleSelectFocus = (event: React.FocusEvent<HTMLSelectElement>) => {
        event.target.classList.add(styles.dropdownExpanded);
    };

    const handleSelectBlur = (event: React.FocusEvent<HTMLSelectElement>) => {
        event.target.classList.remove(styles.dropdownExpanded);
    };

    useEffect(() => {
        if (isFocusing) {
            const intervalId = setInterval(() => {
                if (inputRef.current) {
                    inputRef.current.focus(); // Foco automático no input
                }
            }, 10000); // 10000 milissegundos = 10 segundos

            return () => clearInterval(intervalId); // Limpeza do intervalo ao desmontar o componente
        }
    }, [isFocusing]);

    return (
        <div className={styles.tableWrapper}>
            {/* Div para a borda horizontal */}
            <div className={styles.horizontalBorder}></div>
            <div className={styles.header}>
                <h1>CLIENTES CADASTRADOS</h1>
                {/* Contêiner para o campo de filtro e o seletor */}
                <div className={styles.headerControls}>
                    {/* Seletor para número de resultados por página */}
                    <div className={styles.resultsPerPage}>
                        <label htmlFor="resultsPerPage">Mostrar:</label>
                        <select
                            id="resultsPerPage"
                            value={clientsPerPage}
                            onChange={handleClientsPerPageChange}
                            onFocus={handleSelectFocus}
                            onBlur={handleSelectBlur}
                            className={styles.customSelect}
                        >
                            <option value={10}>10 resultados</option>
                            <option value={50}>50 resultados</option>
                            <option value={100}>100 resultados</option>
                        </select>
                    </div>
                    {/* Contêiner para o campo de filtro */}
                    <div className={styles.searchContainer}>
                        <input
                            type="text"
                            placeholder="Buscar Cliente"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className={styles.filterInput}
                            ref={inputRef}
                        />
                        <Search className={styles.searchIcon} /> {/* Ícone de lupa */}
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
                        {currentClients.map(client => (
                            <tr key={client.id}>
                                <td>{client.nome}</td>
                                <td>{client.referencia || ""}</td>
                                <td>{client.email || ""}</td>
                                <td>{client.telefone}</td>
                                <td>{client.endereco || ""}</td>
                                <td>{/* Ações para o cliente, se houver */}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <div className={styles.pagination}>
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
        </div>
    );
}
