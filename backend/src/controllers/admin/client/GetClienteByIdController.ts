import { Request, Response } from 'express';
import { GetClienteByIdService } from '../../../services/admin/client/GetClienteByIdService';

class GetClienteByIdController {
    async handle(req: Request, res: Response) {
        const { clienteId } = req.params;

        const getClienteByIdService = new GetClienteByIdService();

        try {
            const cliente = await getClienteByIdService.execute(clienteId);
            return res.json(cliente);
        } catch (error) {
            return res.status(400).json({ error: error.message });
        }
    }
}

export { GetClienteByIdController };
