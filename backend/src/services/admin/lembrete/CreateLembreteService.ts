import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface CreateLembreteRequest {
    dataCadastro: Date;
    descricao: string;
    userId: string;
}

class CreateLembreteService {
    async execute({ dataCadastro, descricao, userId }: CreateLembreteRequest) {
        // Verifica se o usuário existe
        const userExists = await prisma.user.findUnique({
            where: { id: userId },
        });

        if (!userExists) {
            throw new Error('Usuário não encontrado.');
        }

        // Cria o novo lembrete
        const lembrete = await prisma.lembrete.create({
            data: {
                dataCadastro,
                descricao,
                userId,
            },
        });

        return lembrete;
    }
}

export { CreateLembreteService };
