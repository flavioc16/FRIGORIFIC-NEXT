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

        // Verificar se é um usuário do tipo 'USER' e se ele possui o cliente associado
        if (role === 'USER') {
            const cliente = await prismaClient.cliente.findFirst({
                where: {
                    userId: sub // Certifique-se de que 'userId' é o campo correto
                }
            });

            if (!cliente) {
                return res.status(401).json({ error: 'Client not found' });
            }

            req.cliente_id = cliente.id; // Adicionando o ID do cliente na requisição
        }

        next(); // Continua para o próximo middleware ou a rota
    } catch (error) {
        console.error('Token verification failed:', error);
        return res.status(401).json({ error: 'Invalid token' });
    }
}
