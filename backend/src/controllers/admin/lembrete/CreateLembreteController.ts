import { Request, Response } from 'express';
import { CreateLembreteService } from '../../../services/admin/lembrete/CreateLembreteService';

class CreateLembreteController {
    async handle(req: Request, res: Response) {
        const { dataCadastro, descricao } = req.body; // Obtém os dados do corpo da requisição
        const userId = req.user_id; // Obtém o ID do usuário autenticado a partir do middleware de autenticação

        const createLembreteService = new CreateLembreteService();

        try {
            // Executa o serviço para criar o lembrete
            const lembrete = await createLembreteService.execute({
                dataCadastro: new Date(dataCadastro), // Converte a data para o formato Date
                descricao,
                userId,
            });

            return res.json(lembrete); // Retorna o lembrete criado em formato JSON
        } catch (error) {
            return res.status(400).json({ error: error.message }); // Retorna erro, se ocorrer
        }
    }
}

export { CreateLembreteController };
