import { Request, Response } from 'express';
import { GetAllClientesService } from '../../../services/admin/client/GetAllClientsService';

class GetAllClientesController {
    async handle(req: Request, res: Response) {
        try {
            const getAllClientesService = new GetAllClientesService();
            const clientes = await getAllClientesService.execute();
            return res.json(clientes);
        } catch (error) {
            return res.status(500).json({ error: 'Erro ao obter clientes.' });
        }
    }
}

export { GetAllClientesController };
