import { Request, Response } from 'express';
import { DeleteClienteService } from '../../../services/admin/client/DeleteClienteService';
class DeleteClienteController {
    async handle(req: Request, res: Response) {
        const { clienteId } = req.params;

        const deleteClienteService = new DeleteClienteService();

        try {
            const result = await deleteClienteService.execute(clienteId);
            return res.json(result);
        } catch (error) {
            return res.status(400).json({ error: error.message });
        }
    }
}

export { DeleteClienteController };
