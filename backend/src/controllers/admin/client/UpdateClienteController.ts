import { Request, Response } from "express";
import { UpdateClienteService } from "../../../services/admin/client/UpdateClienteService";

class UpdateClienteController {
    async handle(req: Request, res: Response) {
        
        const { id, nome, endereco, referencia, email, telefone, user } = req.body; // Pega os outros dados do corpo da requisição

        const updateClienteService = new UpdateClienteService();

        try {
            // Chama o serviço passando os dados do cliente e do usuário (se houver)
            const cliente = await updateClienteService.execute({
                id,
                nome,
                endereco,
                referencia,
                email,
                telefone,
                user
            });

            return res.json(cliente); // Retorna o cliente atualizado como resposta JSON
        } catch (error) {
            return res.status(400).json({ error: error.message });
        }
    }
}

export { UpdateClienteController };
