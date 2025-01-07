import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

class GetLembreteByIdService {
    async execute(lembreteId: string, userId: string) {
        // Verifica se o lembrete existe e pertence ao usuário autenticado
        const lembrete = await prisma.lembrete.findFirst({
            where: {
                id: lembreteId,
                userId, // Certifica-se de que o lembrete pertence ao usuário autenticado
            },
        });

        if (!lembrete) {
            throw new Error('Lembrete não encontrado ou você não tem permissão para visualizá-lo.');
        }

        return lembrete;
    }
}

export { GetLembreteByIdService };
