declare namespace Express {
    export interface Request {
        user_id: string;
        role: string;
        cliente_id?: string; // Adicionando a propriedade cliente_id
    }
}
