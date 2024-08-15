import prismaClient from "../../../prisma";

interface CompraRequest {
    id: string;
    descricaoCompra?: string;
    totalCompra?: number;
    tipoCompra?: number;
    statusCompra?: number;
}

class UpdateCompraService {
    async execute({ id, descricaoCompra, totalCompra, tipoCompra, statusCompra }: CompraRequest) {
        // Verifica se a compra existe
        const compraExistente = await prismaClient.compra.findUnique({
            where: { id },
        });

        if (!compraExistente) {
            throw new Error("Compra não encontrada");
        }

        // Atualiza a compra com os novos dados
        const compraAtualizada = await prismaClient.compra.update({
            where: { id },
            data: {
                descricaoCompra: descricaoCompra || compraExistente.descricaoCompra,
                totalCompra: totalCompra !== undefined ? totalCompra : compraExistente.totalCompra,
                tipoCompra: tipoCompra !== undefined ? tipoCompra : compraExistente.tipoCompra,
                statusCompra: statusCompra !== undefined ? statusCompra : compraExistente.statusCompra,
            },
        });

        return compraAtualizada;
    }
}

export { UpdateCompraService };
