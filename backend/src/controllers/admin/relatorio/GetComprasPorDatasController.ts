import { Request, Response } from "express";
import { GetComprasPorDatasService } from "../../../services/admin/relatorio/GetComprasPorDatasService";

class GetComprasPorDatasController {
  async handle(req: Request, res: Response) {
    const { dataInicio, dataFim } = req.query; // Receber as datas como query params

    const service = new GetComprasPorDatasService();

    const resultado = await service.execute(
      dataInicio?.toString(),
      dataFim?.toString()
    );

    return res.json(resultado);
  }
}

export { GetComprasPorDatasController };
