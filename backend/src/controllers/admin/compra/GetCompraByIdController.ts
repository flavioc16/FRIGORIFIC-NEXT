import { Request, Response } from 'express';
import { GetCompraByIdService } from '../../../services/admin/compra/GetCompraByIdService';

class GetCompraByIdController {
    async handle(req: Request, res: Response) {
        const { compraId } = req.params;

        const getCompraByIdService = new GetCompraByIdService();

        try {
            const compra = await getCompraByIdService.execute(compraId);
            return res.json(compra);
        } catch (error) {
            return res.status(400).json({ error: error.message });
        }
    }
}

export { GetCompraByIdController };
