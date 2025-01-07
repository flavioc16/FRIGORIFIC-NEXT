import { Request, Response } from "express";
import { GetClienteApllicatedJurosTodayService } from "../../../services/admin/juros/GetClienteApllicatedJurosTodayService";

class GetClienteApllicatedJurosTodayController {
  async handle(req: Request, res: Response) {
    const service = new GetClienteApllicatedJurosTodayService();

    try {
      const result = await service.execute();
      return res.json(result); // Retorna as notificações com detalhes do cliente
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }
}

export { GetClienteApllicatedJurosTodayController };
