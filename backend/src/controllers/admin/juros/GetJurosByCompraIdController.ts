import { Request, Response } from 'express';
import { GetJurosByCompraIdService } from '../../../services/admin/juros/GetJurosByCompraIdService';

class GetJurosByCompraIdController {
  async handle(req: Request, res: Response) {
    const { compraId } = req.body; // Pega o ID da compra da URL

    if (!compraId) {
      return res.status(400).json({ error: "O parâmetro 'compraId' é obrigatório." });
    }

    const getJurosByCompraIdService = new GetJurosByCompraIdService();

    try {
      const result = await getJurosByCompraIdService.execute(compraId);
      return res.json(result);
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }
}

export { GetJurosByCompraIdController };
