import { Request, Response } from "express";
import { UpdateNotificationStatusJurosService } from "../../../services/admin/juros/UpdateStatusNofiricationService";

class UpdateNotificationStatusJurosController {
  async handle(req: Request, res: Response) {
    const { id } = req.params; // O ID será fornecido como parâmetro na URL

    const service = new UpdateNotificationStatusJurosService();

    try {
      // Executa a atualização do status da notificação
      const updatedJuros = await service.execute({ id });

      return res.status(200).json(updatedJuros); // Retorna o registro de juros atualizado
    } catch (error) {
      return res.status(500).json({ error: error.message || "Erro ao atualizar o status da notificação." });
    }
  }
}

export { UpdateNotificationStatusJurosController };
