import { Request, Response } from "express";
import { UpdateCompraService } from "../../../services/admin/compra/UpdateCompraService";

class UpdateCompraController {
    async handle(req: Request, res: Response) {
        const { id } = req.params;
        const { descricaoCompra, totalCompra, tipoCompra, statusCompra } = req.body;

        const updateCompraService = new UpdateCompraService();

        try {
            const compraAtualizada = await updateCompraService.execute({
                id,
                descricaoCompra,
                totalCompra,
                tipoCompra,
                statusCompra,
            });

            return res.json(compraAtualizada);
        } catch (error) {
            return res.status(400).json({ error: error.message });
        }
    }
}

export { UpdateCompraController };
