import { Request, Response } from 'express';
import { UpdateLembreteService } from '../../../services/admin/lembrete/UpdateLembreteService';

class UpdateLembreteController {
    async handle(req: Request, res: Response) {
        const { id } = req.params; // ID do lembrete vindo da URL
        const { descricao, notification, dataCadastro } = req.body; // Inclui dataCadastro no corpo da requisição

        const updateLembreteService = new UpdateLembreteService();

        try {
        
            const lembrete = await updateLembreteService.execute({
                id,
                descricao,
                notification,
                dataCadastro: dataCadastro ? new Date(dataCadastro) : undefined, // Converte para objeto Date ou mantém undefined
            });

            return res.json(lembrete);
        } catch (error) {
            return res.status(400).json({ error: error.message });
        }
    }
}

export { UpdateLembreteController };
