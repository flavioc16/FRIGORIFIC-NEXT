import { NextFunction, Request, Response } from 'express';
import { verify } from 'jsonwebtoken';
import prismaClient from '../prisma';

interface PayLoad {
    sub: string;
    role: string;
}

export async function isAuthenticated(
    req: Request,
    res: Response,
    next: NextFunction
) {
    const authToken = req.headers.authorization;

    if (!authToken) {
        return res.status(401).json({ error: 'Token not provided' });
    }

    const [, token] = authToken.split(' ');

    try {
        const { sub, role } = verify(token, process.env.JWT_SECRET) as PayLoad;
        req.user_id = sub;
        req.role = role;

        if (role === 'USER') {
            const cliente = await prismaClient.cliente.findFirst({
                where: {
                    userId: sub
                }
            });

            if (!cliente) {
                return res.status(401).json({ error: 'Client not found',  });
            }

            req.cliente_id = cliente.id;
        }

        next();
    } catch (error) {
        console.error('Token verification failed:', error);
        return res.status(401).json({ error: 'Invalid token' });
    }
}
