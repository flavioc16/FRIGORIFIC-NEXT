import { Request, Response } from 'express';
import { CreateUserService } from '../../services/admin/CreateUserService';
class CreateUserController {
    async handle( req: Request, res: Response ){

        const { name, username, password } = req.body;

        const createUserService = new CreateUserService();

        const user = await createUserService.execute({
            name,
            username,
            password
        })

        return res.json(user) 
    }
}

export { CreateUserController }