import { Request, Response } from "express";
import { CountJurosByTodayService } from "../../../services/admin/juros/CountJurosByTodayService";

class CountJurosByTodayController {
  async handle(req: Request, res: Response) {
    const service = new CountJurosByTodayService();

    try {
      const result = await service.execute();
      return res.json(result); // Retorna o número de juros adicionados hoje
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }
}

export { CountJurosByTodayController };
