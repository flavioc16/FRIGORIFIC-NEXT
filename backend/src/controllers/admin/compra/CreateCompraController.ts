import { Request, Response } from 'express';
import { CreateCompraService } from '../../../services/admin/compra/CreateCompraService';

class CreateCompraController {
    async handle(req: Request, res: Response) {
        const { descricaoCompra, totalCompra, tipoCompra, statusCompra, clienteId, dataDaCompra, valorInicialCompra } = req.body;
        const userId = req.user_id; // Pegue o ID do usuário autenticado a partir do middleware de autenticação

        const createCompraService = new CreateCompraService();

        try {
            const compra = await createCompraService.execute({
                descricaoCompra,
                totalCompra,
                valorInicialCompra,
                tipoCompra,
                statusCompra,
                clienteId,
                userId,
                dataDaCompra, // Passe o campo dataDaCompra
            });

            return res.json(compra);
        } catch (error) {
            return res.status(400).json({ error: error.message });
        }
    }
}

export { CreateCompraController };
