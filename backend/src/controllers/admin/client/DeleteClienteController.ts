import { Request, Response } from 'express';
import { DeleteClienteService } from '../../../services/admin/client/DeleteClienteService';

class DeleteClienteController {
    async handle(req: Request, res: Response) {
        const { id } = req.body; // Obtém a ID do corpo da requisição

        if (!id) {
            return res.status(400).json({ error: "ID do cliente não fornecido." });
        }

        const deleteClienteService = new DeleteClienteService();

        try {
            const result = await deleteClienteService.execute(id);
            return res.json(result);
        } catch (error) {
            return res.status(400).json({ error: error.message });
        }
    }
}

export { DeleteClienteController };
