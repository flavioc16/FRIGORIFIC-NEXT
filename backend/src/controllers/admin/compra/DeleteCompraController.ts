import { Request, Response } from 'express';
import { DeleteCompraService } from '../../../services/admin/compra/DeleteCompraService'; // Caminho ajustado

class DeleteCompraController {
  async handle(req: Request, res: Response) {
    const { id } = req.body; // Obtém a ID da compra do corpo da requisição

    if (!id) {
      return res.status(400).json({ error: "ID da compra não fornecido." });
    }

    const deleteCompraService = new DeleteCompraService();

    try {
      const result = await deleteCompraService.execute(id);
      return res.json(result); // Retorna a mensagem de sucesso
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }
}

export { DeleteCompraController };
