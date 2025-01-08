import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

class GetAllLembretesService {
    async execute(userId: string) {
        // Verifica se o usuário existe
        const userExists = await prisma.user.findUnique({
            where: { id: userId },
        });

        if (!userExists) {
            throw new Error('Usuário não encontrado.');
        }

        // Busca todos os lembretes associados ao usuário
        const lembretes = await prisma.lembrete.findMany({
            orderBy: {
                dataCadastro: 'desc', // Ordena pelo campo dataCadastro de forma decrescente
            },
        });

        return lembretes;
    }
}

export { GetAllLembretesService };

