import prismaClient from "../../../prisma";

class GetAllComprasService {
    async execute(clienteId: string) {
        // Busca as compras não pagas do cliente
        const compras = await prismaClient.compra.findMany({
            where: {
                clienteId: clienteId,
                tipoCompra: 0, // 0 representa compras não pagas
                statusCompra: 0 // 0 representa status não pago
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
            }
        });

        // Calcula o total das compras não pagas
        const somaTotalCompras = await prismaClient.compra.aggregate({
            _sum: {
                totalCompra: true
            },
            where: {
                clienteId: clienteId,
                tipoCompra: 0, // 0 representa compras não pagas
                statusCompra: 0 // 0 representa status não pago
            }
        });

        return {
            compras,
            somaTotalCompras: somaTotalCompras._sum.totalCompra || 0
        };
    }
}

export { GetAllComprasService };
