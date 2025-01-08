import { Request, Response } from 'express';
import { UpdatePagamentoService } from '../../../services/admin/pagamento/UpdatePagamentoService';

class UpdatePagamentoController {
    async handle(request: Request, response: Response) {
        const { id } = request.params;
        const { valorPagamento } = request.body;

        const updatePagamentoService = new UpdatePagamentoService();
        const pagamento = await updatePagamentoService.execute(id, { valorPagamento });

        return response.json(pagamento);
    }
}

export { UpdatePagamentoController };