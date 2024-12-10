import { Request, Response } from 'express';
import { GetProdutoByIdService } from '../../../services/admin/produto/GetProdutoByIdService'; // Serviço de recuperação do produto por ID

class GetProdutoByIdController {
  async handle(req: Request, res: Response) {
    const { id } = req.params; // Pegue o ID do produto a partir dos parâmetros da requisição

    const getProdutoByIdService = new GetProdutoByIdService();

    try {
      const produto = await getProdutoByIdService.execute(id);

      return res.json(produto);
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }
}

export { GetProdutoByIdController };
