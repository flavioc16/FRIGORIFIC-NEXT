import { Request, Response } from 'express';
import { GetAllComprasService } from '../../../services/admin/compra/GetAllComprasService';

class GetAllComprasController {
    async handle(req: Request, res: Response) {
        const clienteId = req.cliente_id; // Pega o ID do cliente a partir do middleware de autenticação

        const getAllComprasService = new GetAllComprasService();

        try {
            const compras = await getAllComprasService.execute(clienteId);
            return res.json(compras);
        } catch (error) {
            return res.status(400).json({ error: error.message });
        }
    }
}

export { GetAllComprasController };

