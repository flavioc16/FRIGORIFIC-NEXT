import prismaClient from '../../../prisma';

interface CompraRequest {
    descricaoCompra: string;
    totalCompra: number;
    tipoCompra: number;
    statusCompra: number;
    clienteId: string;
    userId: string;
    dataDaCompra?: string; // Torne opcional
}

class CreateCompraService {
    async execute({ descricaoCompra, totalCompra, tipoCompra, statusCompra, clienteId, userId, dataDaCompra }: CompraRequest) {
        const compra = await prismaClient.compra.create({
            data: {
                descricaoCompra,
                totalCompra,
                tipoCompra,
                statusCompra,
                cliente: {
                    connect: { id: clienteId },
                },
                user: {
                    connect: { id: userId },
                },
                dataDaCompra: dataDaCompra ? new Date(dataDaCompra) : null, // Converta a dataDaCompra para Date ou defina como null
            },
        });

        return compra;
    }
}

export { CreateCompraService };
