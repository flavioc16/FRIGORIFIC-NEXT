import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface UpdateLembreteRequest {
    id: string;
    descricao?: string;
    notification?: boolean;
    userId: string;
}

class UpdateLembreteService {
    async execute({ id, descricao, notification, userId }: UpdateLembreteRequest) {
        // Verifica se o lembrete existe
        const lembrete = await prisma.lembrete.findUnique({
            where: { id },
        });

        if (!lembrete) {
            throw new Error('Lembrete não encontrado.');
        }

        // Verifica se o usuário que está tentando atualizar é o mesmo que criou o lembrete ou se é um admin
        if (lembrete.userId !== userId) {
            throw new Error('Você não tem permissão para atualizar este lembrete.');
        }

        // Atualiza o lembrete
        const updatedLembrete = await prisma.lembrete.update({
            where: { id },
            data: {
                descricao: descricao ?? lembrete.descricao, // Atualiza se houver nova descrição, senão mantém a original
                notification: notification ?? lembrete.notification, // Atualiza se houver novo valor para notification
            },
        });

        return updatedLembrete;
    }
}

export { UpdateLembreteService };
