import { Request, Response } from 'express';
import { GetPaymentsEntreDatasService } from '../../../services/admin/pagamento/GetPaymentsEntreDatasService';

class GetPaymentsEntreDatasController {
    async handle(req: Request, res: Response) {
        const { dataInicio, dataFim } = req.query;

        if (!dataInicio || !dataFim) {
            return res.status(400).json({ error: 'Data de início e data de fim são obrigatórias' });
        }

        const getPagamentosEntreDatasService = new GetPaymentsEntreDatasService();
        const resultado = await getPagamentosEntreDatasService.execute(
            dataInicio?.toString(),
            dataFim?.toString()
          );
      
          return res.json(resultado);
    }
}

export { GetPaymentsEntreDatasController };