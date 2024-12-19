import prismaClient from "../prisma";
import { compare } from "bcryptjs";
import { sign } from 'jsonwebtoken';

interface AuthRequest {
    username: string;
    password: string;
}

class AuthUserService {
    async execute({ username, password }: AuthRequest) {
        // Busca o usuário no banco de dados
        const user = await prismaClient.user.findUnique({
            where: {
                username: username
            },
            include: {
                clientes: true  // Inclui os clientes relacionados ao usuário
            }
        });

        // Caso o usuário não seja encontrado, lança um erro
        if (!user) {
            throw new Error("Username ou passworld incorretos.");
        }

        // Verifica se a senha fornecida corresponde à senha armazenada no banco
        const passwordMatch = await compare(password, user.password);
        if (!passwordMatch) {
            throw new Error("passowrd incorrect.");
        }

        // Cria um token JWT com as informações do usuário
        const token = sign(
            {
                name: user.name,
                username: user.username,
                role: user.role
            },
            process.env.JWT_SECRET, // Verifique se o JWT_SECRET está configurado no ambiente
            {
                subject: user.id,
                expiresIn: '360d'
            }
        );

        // Retorna as informações do usuário, incluindo o token e os clientes
        return {
            id: user.id,
            name: user.name,
            username: user.username,
            role: user.role,
            token: token,
            client: user.clientes
        };
    }
}

export { AuthUserService };
