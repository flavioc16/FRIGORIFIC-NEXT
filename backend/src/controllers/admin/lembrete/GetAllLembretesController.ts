import { Request, Response } from 'express';
import { GetAllLembretesService } from '../../../services/admin/lembrete/GetAllLembretesService';

class GetAllLembretesController {
    async handle(req: Request, res: Response) {
        const userId = req.user_id; // Pegue o ID do usuário autenticado a partir do middleware de autenticação

        const getAllLembretesService = new GetAllLembretesService();

        try {
            const lembretes = await getAllLembretesService.execute(userId);
            return res.json(lembretes);
        } catch (error) {
            return res.status(400).json({ error: error.message });
        }
    }
}

export { GetAllLembretesController };
