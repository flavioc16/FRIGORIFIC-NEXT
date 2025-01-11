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

        // Exclui o lembrete
        await prisma.lembrete.delete({
            where: { id },
        });

        return { message: 'Lembrete excluído com sucesso.' };
    }
}

export { DeleteLembreteService };
