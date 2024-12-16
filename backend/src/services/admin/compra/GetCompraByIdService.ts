import prismaClient from "../../../prisma";

class GetCompraByIdService {
    async execute(id: string) {
        const compra = await prismaClient.compra.findUnique({
            where: { 
                id: id
            },
            include: {
                cliente: true, // Inclui detalhes do cliente   
                juros: true,  // Inclui os juros associados à compra
                pagamentos: true, // Inclui os pagamentos associados à compra
            }
        });

        if (!compra) {
            throw new Error("Compra não encontrada.");
        }

        return compra;
    }
}

export { GetCompraByIdService };
