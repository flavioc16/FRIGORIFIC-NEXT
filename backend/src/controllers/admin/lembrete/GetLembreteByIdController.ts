import { Request, Response } from 'express';
import { GetLembreteByIdService } from '../../../services/admin/lembrete/GetLembreteByIdService';

class GetLembreteByIdController {
    async handle(req: Request, res: Response) {
        const { id } = req.params; // ID do lembrete passado na URL
        const userId = req.user_id; // ID do usuário autenticado

        const getLembreteByIdService = new GetLembreteByIdService();

        try {
            const lembrete = await getLembreteByIdService.execute(id, userId);
            return res.json(lembrete);
        } catch (error) {
            return res.status(400).json({ error: error.message });
        }
    }
}

export { GetLembreteByIdController };
