import { Request, Response } from 'express';
import { CreatePagamentoService } from '../../../services/admin/pagamento/CreatePagamentoService';

class CreatePagamentoController {
    async handle(req: Request, res: Response) {
        const { valorPagamento, clienteId} = req.body;
        const userId = req.user_id; // Supondo que o user_id vem do middleware de autenticação

        const createPagamentoService = new CreatePagamentoService();

        try {
            const pagamento = await createPagamentoService.execute({ valorPagamento, clienteId, userId });
            return res.json(pagamento);
        } catch (error) {
            return res.status(400).json({ error: error.message });
        }
    }
}

export { CreatePagamentoController };
