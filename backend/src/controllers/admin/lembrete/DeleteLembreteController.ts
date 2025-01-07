import { Request, Response } from 'express';
import { DeleteLembreteService } from '../../../services/admin/lembrete/DeleteLembreteService';

class DeleteLembreteController {
    async handle(req: Request, res: Response) {
        const { id } = req.params;
        const userId = req.user_id; // ID do usuário autenticado

        const deleteLembreteService = new DeleteLembreteService();

        try {
            const result = await deleteLembreteService.execute({
                id,
                userId,
            });

            return res.json(result);
        } catch (error) {
            return res.status(400).json({ error: error.message });
        }
    }
}

export { DeleteLembreteController };
