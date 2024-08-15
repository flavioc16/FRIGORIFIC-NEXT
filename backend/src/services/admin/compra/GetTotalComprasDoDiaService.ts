import prismaClient from "../../../prisma";

class GetTotalComprasDoDiaService {
    async execute() {
        // Obtém a data atual
        const hoje = new Date();
        const inicioDoDia = new Date(hoje.setUTCHours(0, 0, 0, 0));
        const fimDoDia = new Date(hoje.setUTCHours(23, 59, 59, 999));

        // Calcula o valor total das compras do dia
        const totalCompras = await prismaClient.compra.aggregate({
            _sum: {
                totalCompra: true
            },
            where: {
                created_at: {
                    gte: inicioDoDia,
                    lte: fimDoDia
                },
                tipoCompra: 0 // Considerando que 0 é o status de não pago
            }
        });

        return totalCompras._sum.totalCompra || 0;
    }
}

export { GetTotalComprasDoDiaService };
