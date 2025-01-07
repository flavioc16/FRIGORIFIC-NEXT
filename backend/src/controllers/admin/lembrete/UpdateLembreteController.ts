import { Request, Response } from 'express';
import { UpdateLembreteService } from '../../../services/admin/lembrete/UpdateLembreteService';

class UpdateLembreteController {
    async handle(req: Request, res: Response) {
        const { id } = req.params;
        const { descricao, notification } = req.body;
        const userId = req.user_id; // ID do usuário autenticado

        const updateLembreteService = new UpdateLembreteService();

        try {
            const lembrete = await updateLembreteService.execute({
                id,
                descricao,
                notification,
                userId,
            });

            return res.json(lembrete);
        } catch (error) {
            return res.status(400).json({ error: error.message });
        }
    }
}

export { UpdateLembreteController };
