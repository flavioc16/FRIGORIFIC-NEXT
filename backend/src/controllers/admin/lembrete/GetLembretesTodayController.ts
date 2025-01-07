import { Request, Response } from 'express';
import { GetLembretesTodayService } from '../../../services/admin/lembrete/GetLembretesTodayService';

class GetLembretesTodayController {
    async handle(req: Request, res: Response) {
        const userId = req.user_id; // ID do usuário autenticado

        const getLembretesTodayService = new GetLembretesTodayService();

        try {
            const lembretes = await getLembretesTodayService.execute(userId);
            return res.json(lembretes);
        } catch (error) {
            return res.status(400).json({ error: error.message });
        }
    }
}

export { GetLembretesTodayController };
