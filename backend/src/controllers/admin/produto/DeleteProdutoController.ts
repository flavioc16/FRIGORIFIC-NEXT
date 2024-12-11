import { Request, Response } from 'express';
import { DeleteProdutoService } from '../../../services/admin/produto/DeleteProdutoService'; // Serviço de exclusão do produto

class DeleteProdutoController {
  async handle(req: Request, res: Response) {
    const { id } = req.body; // Pegue o ID do produto a partir dos parâmetros da requisição

    const deleteProdutoService = new DeleteProdutoService();

    try {
      const response = await deleteProdutoService.execute(id);

      return res.json(response);
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }
}

export { DeleteProdutoController };
