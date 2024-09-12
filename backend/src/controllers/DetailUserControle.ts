import { Request, Response } from 'express';
import { DetailUserService } from '../services/DetailUserService';

class DetailUserControle {
    async handle( req: Request, res: Response ){

        const user_id = req.user_id;

        const role = req.role;

        const detailUserService = new DetailUserService();

        const user = await detailUserService.execute(user_id, role);

        return res.json(user)

    }
}

export { DetailUserControle }