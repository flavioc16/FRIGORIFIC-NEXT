import { Request, Response } from 'express';
import { CreateClienteService } from '../../../services/admin/client/CreateClienteService ';

class CreateClienteController {
    async handle(req: Request, res: Response) {
        const { nome, endereco, referencia,  email, telefone, username, password } = req.body;

        const createClienteService = new CreateClienteService();

        try {
            const { cliente } = await createClienteService.execute({
                nome,
                endereco,
                referencia,
                email,
                telefone,   
                username,
                password
            });

            return res.json({ cliente });
        } catch (err) {
            return res.status(400).json({ error: err.message });
        }
    }
}

export { CreateClienteController };
