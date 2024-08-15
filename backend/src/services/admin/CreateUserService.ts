import prismaClient from '../../prisma';
import bcrypt from 'bcryptjs'

interface UserRequest {
    name: string;
    username: string;
    password: string;
}

class CreateUserService {
    async execute({ name, username, password }: UserRequest) {
        
        // Verificando se enviou username
        if (!username) {
            throw new Error("Username incorrect");
        }

        // Verificando se já existe username
        const usernameAlreadyExists = await prismaClient.user.findFirst({
            where: {
                username: username
            }
        });

        if (usernameAlreadyExists) {
            throw new Error("Username already exists");
        }

        // Hashing da senha
        const hashedPassword = await bcrypt.hash(password, 10);

        // Criando o novo usuário
        const user = await prismaClient.user.create({
            data: {
                name: name,
                username: username,
                password: hashedPassword
        },  select: {
                id: true,
                name: true,
                username: true,
            }
        });

        return user;
    }
}

export { CreateUserService }
