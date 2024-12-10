import { Request, Response } from 'express';
import { CreateProdutoService } from '../../../services/admin/produto/CreateProdutoService'; // Serviço para criação do produto

class CreateProdutoController {
    async handle(req: Request, res: Response) {
        const { nome, descricao, precoAVista, precoAPrazo } = req.body;
        
        const createProdutoService = new CreateProdutoService();

        try {
            const produto = await createProdutoService.execute({
                nome,
                descricao,
                precoAVista,
                precoAPrazo,
            });

            return res.json(produto);
        } catch (error) {
            return res.status(400).json({ error: error.message });
        }
    }
}

export { CreateProdutoController };
