import { Request, Response } from 'express';
import { GetTotalProdutosService } from '../../../services/admin/produto/GetTotalProdutosService'; // Serviço de contagem de produtos

class GetTotalProdutosController {
  async handle(req: Request, res: Response) {
    const getTotalProdutosService = new GetTotalProdutosService();

    try {
      const totalProdutos = await getTotalProdutosService.execute();

      return res.json(totalProdutos);
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }
}

export { GetTotalProdutosController };
