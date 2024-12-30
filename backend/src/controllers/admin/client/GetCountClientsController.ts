import { Request, Response } from 'express';
import { GetCountClientsService } from '../../../services/admin/client/GetCountClientsService';

class GetClientesCountController {
    async handle(req: Request, res: Response) {
        try {
            const getClientesCountService = new GetCountClientsService();
            const count = await getClientesCountService.execute();
            return res.json({ count }); // Retorna um objeto com a contagem de clientes
        } catch (error) {
            return res.status(500).json({ error: 'Erro ao obter a contagem de clientes.' });
        }
    }
}

export { GetClientesCountController };
