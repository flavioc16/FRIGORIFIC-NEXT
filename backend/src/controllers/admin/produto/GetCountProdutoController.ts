import { Request, Response } from 'express';
import { GetCountProdutoService } from '../../../services/admin/produto/GetCountProdutoService';

class GetProdutosCountController {
    async handle(req: Request, res: Response) {
        try {
            const getCountProductsService = new GetCountProdutoService();
            const count = await getCountProductsService.execute();
            return res.json({ count }); // Retorna um objeto com a contagem de produtos
        } catch (error) {
            return res.status(500).json({ error: 'Erro ao obter a contagem de produtos.' });
        }
    }
}

export { GetProdutosCountController };
