import { Request, Response } from 'express';
import { GetTotalPagamentosDoDiaService } from '../../../services/admin/pagamento/GetTotalPagamentosDoDiaService';

class GetTotalPagamentosDoDiaController {
    async handle(req: Request, res: Response) {
        try {
            const getTotalPagamentosDoDiaService = new GetTotalPagamentosDoDiaService();
            const total = await getTotalPagamentosDoDiaService.execute();
            return res.json({ total });
        } catch (error) {
            return res.status(500).json({ error: 'Erro ao obter total dos pagamentos do dia.' });
        }
    }
}

export { GetTotalPagamentosDoDiaController };
