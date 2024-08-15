import prismaClient from "../../../prisma";
import bcrypt from 'bcryptjs';

interface ClienteRequest {
    nome: string;
    email: string;
    telefone: string;
    username: string;
    password: string;
}

class CreateClienteService {
    async execute({ nome, email, telefone, username, password }: ClienteRequest) {
        if (!username) {
            throw new Error("Username is required");
        }

        const usernameAlreadyExists = await prismaClient.user.findFirst({
            where: {
                username: username
            }
        });

        if (usernameAlreadyExists) {
            throw new Error("Username already exists");
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await prismaClient.user.create({
            data: {
                name: nome,
                username: username,
                password: hashedPassword,
                role: "USER"
            },  select: {
                id: true,
                name: true,
                username: true,
                role: true
            }
        });

        const cliente = await prismaClient.cliente.create({
            data: {
                nome: nome,
                email: email,
                telefone: telefone,
                userId: user.id
            }, select:{
                id: true,
                nome: true,
                email: true,
                telefone: true
            }
        });

        return { cliente };
    }
}

export { CreateClienteService };
