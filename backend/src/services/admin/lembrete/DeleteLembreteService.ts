import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface DeleteLembreteRequest {
    id: string;
    userId: string;
}

class DeleteLembreteService {
    async execute({ id, userId }: DeleteLembreteRequest) {
        // Verifica se o lembrete existe
        const lembrete = await prisma.lembrete.findUnique({
            where: { id },
        });

        if (!lembrete) {
            throw new Error('Lembrete não encontrado.');
        }

        // Verifica se o usuário que está tentando excluir é o mesmo que criou o lembrete ou se é um admin
        if (lembrete.userId !== userId) {
            throw new Error('Você não tem permissão para excluir este lembrete.');
        }

        // Exclui o lembrete
        await prisma.lembrete.delete({
            where: { id },
        });

        return { message: 'Lembrete excluído com sucesso.' };
    }
}

export { DeleteLembreteService };
