import { Request, Response } from 'express';
import { DeletePagamentoService } from '../../../services/admin/pagamento/DeletePagamentoService';

class DeletePagamentoController {
    async handle(request: Request, response: Response) {
        const { id } = request.params;

        const deletePagamentoService = new DeletePagamentoService();
        const pagamento = await deletePagamentoService.execute(id);

        return response.json(pagamento);
    }
}

export { DeletePagamentoController };