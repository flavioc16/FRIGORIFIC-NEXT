import { Request, Response } from "express";
import { GetComprasByClienteIdService } from "../../../services/admin/compra/GetComprasByClienteIdService";

class GetComprasByClienteIdController {
    async handle(req: Request, res: Response) {
        const { clienteId } = req.params; // Supõe que o `clienteId` seja passado na URL

        const service = new GetComprasByClienteIdService();

        try {
            const compras = await service.execute(clienteId);
            return res.json(compras); // Retorna as compras em formato JSON
        } catch (error) {
            return res.status(400).json({ error: error.message }); // Trata erros
        }
    }
}

export { GetComprasByClienteIdController };
