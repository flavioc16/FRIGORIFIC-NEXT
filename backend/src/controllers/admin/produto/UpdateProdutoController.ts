import { Request, Response } from 'express';
import { UpdateProdutoService } from '../../../services/admin/produto/UpdateProdutoService'; // Serviço de atualização de produto

class UpdateProdutoController {
  async handle(req: Request, res: Response) {
    const { id } = req.params; // Pegue o ID do produto a partir dos parâmetros da requisição
    const { nome, descricao, precoAVista, precoAPrazo } = req.body; // Pegue os dados que vão ser atualizados

    const updateProdutoService = new UpdateProdutoService();

    try {
      const produtoAtualizado = await updateProdutoService.execute({
        id,
        nome,
        descricao,
        precoAVista,
        precoAPrazo,
      });

      return res.json(produtoAtualizado);
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }
}

export { UpdateProdutoController };
