import { Request, Response } from "express";
import { CountLembretesByTodayService } from "../../../services/admin/lembrete/CountLembretesByTodayService";

class CountLembretesByTodayController {
  async handle(req: Request, res: Response) {
    const service = new CountLembretesByTodayService();

    try {
      const result = await service.execute();
      return res.json(result); // Retorna o número de lembretes criados hoje
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }
}

export { CountLembretesByTodayController };
