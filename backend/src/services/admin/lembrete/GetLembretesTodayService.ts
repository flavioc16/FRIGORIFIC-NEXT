import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

class GetLembretesTodayService {
    async execute(userId: string) {
        // Obtém a data de hoje no formato correto
        const today = new Date().toISOString().split("T")[0];

        // Buscar todos os lembretes criados hoje
        const lembretesHoje = await prisma.lembrete.findMany({
            where: {
                dataCadastro: {
                    gte: new Date(`${today}T00:00:00.000Z`), // Início do dia
                    lte: new Date(`${today}T23:59:59.999Z`), // Fim do dia
                },
            },
        });

        // Mapear os lembretes para o formato esperado pelo front-end
        const mappedLembretes = lembretesHoje.map((lembrete) => ({
            id: lembrete.id,
            title: "Lembrete para Hoje", // Título fixo, pode ser ajustado
            details: lembrete.descricao, // Descrição do lembrete
            dueDate: lembrete.dataCadastro, // Data de cadastro
            status: lembrete.notification, // Usa `notification` ou "Pendente" como status
            link: `/dashboard/reminders`, // Link fixo ou dinâmico, caso necessário
        }));

        return mappedLembretes;
    }
}

export { GetLembretesTodayService };
