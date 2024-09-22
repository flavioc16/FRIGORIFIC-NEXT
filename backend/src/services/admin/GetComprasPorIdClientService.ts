import prismaClient from "../../prisma";

class GetComprasPorIdService {
    async execute(clienteId: string) {
        // Verifica se há compras com tipoCompra 0 e statusCompra 0
        const comprasRestantes = await prismaClient.compra.findMany({
            where: {
                clienteId: clienteId,
                tipoCompra: 0, // Tipo de compra restante
                statusCompra: 0 // Não pago
            },
            include: {
                cliente:{
                    select:{
                        nome: true,
                    },
                },
                user: false
            }
        });

        console.log('Buscando compras para clienteId:', clienteId);

        if (comprasRestantes.length > 0) {
            // Se houver compras restantes, retorna apenas essas compras
            return {
                compras: comprasRestantes,
                somaTotalCompra: comprasRestantes.reduce((acc, compra) => acc + compra.totalCompra, 0)
            };
        } else {
            // Se não houver compras restantes, retorna todas as compras do cliente
            const compras = await prismaClient.compra.findMany({
                where: {
                    clienteId: clienteId,
                },
                include: {
                    cliente: true,
                    user: false
                }
            });

            const somaTotalCompra = compras.reduce((acc, compra) => acc + compra.totalCompra, 0);

            return {
                compras,
                somaTotalCompra
            };
        }
    }
}

export { GetComprasPorIdService };
