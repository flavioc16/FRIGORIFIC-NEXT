import { Request, Response } from 'express';
import { GetClienteByIdService } from '../../../services/admin/client/GetClienteByIdService';

class GetClienteByIdController {
    async handle(req: Request, res: Response) {
        const { clienteId } = req.params;

        // Verifique se o clienteId é válido
        if (!clienteId || typeof clienteId !== 'string') {
            return res.status(400).json({ error: 'Cliente ID inválido' });
        }

        const getClienteByIdService = new GetClienteByIdService();

        try {
            const cliente = await getClienteByIdService.execute(clienteId);
            return res.json(cliente);
        } catch (error) {
            console.error('Erro ao buscar cliente:', error.message);
            return res.status(400).json({ error: error.message });
        }
    }
}

export { GetClienteByIdController };
