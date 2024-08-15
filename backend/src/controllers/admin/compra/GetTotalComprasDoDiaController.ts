import { Request, Response } from 'express';
import { GetTotalComprasDoDiaService } from '../../../services/admin/compra/GetTotalComprasDoDiaService';

class GetTotalComprasDoDiaController {
    async handle(req: Request, res: Response) {
        try {
            const getTotalComprasDoDiaService = new GetTotalComprasDoDiaService();
            const total = await getTotalComprasDoDiaService.execute();
            return res.json({ total });
        } catch (error) {
            return res.status(500).json({ error: 'Erro ao obter total das compras do dia.' });
        }
    }
}

export { GetTotalComprasDoDiaController };
