import prismaClient from "../../../prisma";

class GetPaymentsEntreDatasService {
    async execute(dataInicio: string, dataFim: string) {
        const inicioDoDia = new Date(`${dataInicio}T00:00:00.000Z`);
        const fimDoDia = new Date(`${dataFim}T23:59:59.999Z`);

        const pagamentos = await prismaClient.pagamento.findMany({
            where: {
                created_at: {
                    gte: inicioDoDia,
                    lte: fimDoDia
                }
            },
            select: {
                id: true,
                created_at: true,
                valorPagamento: true,
                cliente: {
                    select: {
                        nome: true
                    }
                }
            }
        });

        const totalPagamentos = pagamentos.reduce((acc, pagamento) => {
            return acc + pagamento.valorPagamento;
        }, 0);

        return {
            pagamentos,
            totalPagamentos 
        };
    }
}

export { GetPaymentsEntreDatasService };