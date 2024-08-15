import prismaClient from "../../../prisma";

interface CompraRequest {
    descricaoCompra: string;
    totalCompra: number;
    tipoCompra: number;
    statusCompra: number;
    clienteId: string;
    userId: string;
}

class CreateCompraService {
    async execute({ descricaoCompra, totalCompra, tipoCompra, statusCompra, clienteId, userId}: CompraRequest) {
        const compra = await prismaClient.compra.create({
            data: {
                descricaoCompra,
                totalCompra,
                tipoCompra,
                statusCompra,
                cliente: {
                    connect: { id: clienteId }
                },
                user: {
                    connect: { id: userId }
                }
            }
        });

        return compra;
    }
}

export { CreateCompraService };

