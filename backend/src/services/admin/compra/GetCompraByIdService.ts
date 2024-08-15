import prismaClient from "../../../prisma";

class GetCompraByIdService {
    async execute(compraId: string) {
        const compra = await prismaClient.compra.findUnique({
            where: { 
                id: compraId
            },
            include: {
                cliente: true, // Inclui detalhes do cliente   
            }
        });

        if (!compra) {
            throw new Error("Compra não encontrada.");
        }

        return compra;
    }
}

export { GetCompraByIdService };
