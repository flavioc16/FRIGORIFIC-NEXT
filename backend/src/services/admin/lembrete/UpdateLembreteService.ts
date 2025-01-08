import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface UpdateLembreteRequest {
    id: string;
    dataCadastro: Date;
    descricao?: string;
    notification?: boolean;
}

class UpdateLembreteService {
    async execute({ id, descricao, notification, dataCadastro}: UpdateLembreteRequest) {
        // Verifica se o lembrete existe
        const lembrete = await prisma.lembrete.findUnique({
            where: { id },
        });

        if (!lembrete) {
            throw new Error('Lembrete não encontrado.');
        }

        const updatedLembrete = await prisma.lembrete.update({
            where: { id },
            data: {
                // Converte dataCadastro para um objeto Date válido ou mantém o valor existente
                dataCadastro: dataCadastro ??  lembrete.dataCadastro,
                descricao: descricao ?? lembrete.descricao, 
                notification: notification ?? lembrete.notification, 
            },
        });

        return updatedLembrete;
    }
}

export { UpdateLembreteService };
