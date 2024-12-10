import { Request, Response } from 'express';
import { GetAllProdutosService } from '../../../services/admin/produto/GetAllProdutoService'; // Serviço de recuperação de todos os produtos

class GetAllProdutosController {
  async handle(req: Request, res: Response) {
    const getAllProdutosService = new GetAllProdutosService();

    try {
      const produtos = await getAllProdutosService.execute();

      return res.json(produtos);
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }
}

export { GetAllProdutosController };
