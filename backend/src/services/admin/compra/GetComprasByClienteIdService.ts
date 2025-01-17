import prismaClient from "../../../prisma";

class GetComprasByClienteIdService {
    async execute(clienteId: string) {
        const compras = await prismaClient.compra.findMany({
            where: {
                clienteId: clienteId,
                statusCompra: 0, // 0 representa status não pago
            },
            orderBy: {
                dataDaCompra: 'asc', // Ordena pela data da compra em ordem crescente
            },
            select: {
                id: true,
                descricaoCompra: true,
                totalCompra: true,
                valorInicialCompra: true,
                tipoCompra: true,
                statusCompra: true,
                created_at: true,
                updated_at: true,
                dataDaCompra: true,
                dataVencimento: true,
                isVencida: true
            },
        });

        // Calcula o total das compras não pagas
        const somaTotalCompras = await prismaClient.compra.aggregate({
            _sum: {
                totalCompra: true,
            },
            where: {
                clienteId: clienteId,
                statusCompra: 0, // 0 representa status não pago
            },
        });

        return {
            compras,
            somaTotalCompras: somaTotalCompras._sum.totalCompra || 0,
        };
    }
}

export { GetComprasByClienteIdService };
