import { Request, Response } from 'express';
import { GetComprasPorIdService } from '../../services/admin/GetComprasPorIdClientService';

class GetComprasPorIdController {
    async handle(req: Request, res: Response) {
        const { clienteId } = req.params;

        const getComprasPorIdService = new GetComprasPorIdService();

        try {
            const result = await getComprasPorIdService.execute(clienteId);
            return res.json(result);
        } catch (error) {
            return res.status(400).json({ error: error.message });
        }
    }
}

export { GetComprasPorIdController };
