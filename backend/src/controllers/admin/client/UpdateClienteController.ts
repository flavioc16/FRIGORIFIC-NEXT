import { Request, Response } from "express";
import { UpdateClienteService } from "../../../services/admin/client/UpdateClienteService";
class UpdateClienteController {
    async handle(req: Request, res: Response) {
        const { id } = req.params;
        const { nome, email, telefone } = req.body;

        const updateClienteService = new UpdateClienteService();

        try {
            const cliente = await updateClienteService.execute({ id, nome, email, telefone });
            return res.json(cliente);
        } catch (error) {
            return res.status(400).json({ error: error.message });
        }
    }
}

export { UpdateClienteController };
