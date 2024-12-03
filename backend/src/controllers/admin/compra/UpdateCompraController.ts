import { Request, Response } from "express";
import { UpdateCompraService } from "../../../services/admin/compra/UpdateCompraService";

class UpdateCompraController {
  async handle(req: Request, res: Response): Promise<Response> {
    const {
      id, 
      descricaoCompra,
      totalCompra,
      tipoCompra,
      statusCompra,
      created_at,
      dataDaCompra,
    } = req.body;

    const updateCompraService = new UpdateCompraService();

    try {
      const compraAtualizada = await updateCompraService.execute({
        id, // Passa o `id` vindo do corpo
        descricaoCompra,
        totalCompra,
        tipoCompra,
        statusCompra,
        created_at,
        dataDaCompra,
      });

      return res.json(compraAtualizada);
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  }
}

export { UpdateCompraController };
