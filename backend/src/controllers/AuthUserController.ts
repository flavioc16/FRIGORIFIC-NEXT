import { Request, Response } from 'express';
import { AuthUserService } from '../services/AuthUserService';

class AuthUserController {
    async handle(req: Request, res: Response) {
        const { username, password } = req.body;
        
        try {
            const authUserService = new AuthUserService();
            const user = await authUserService.execute({ username, password });
            return res.json(user);
        } catch (error) {
            console.error(error);
            return res.status(401).json({ message: error.message || 'Erro ao autenticar o usuário' });
        }
    }
}

export { AuthUserController };
