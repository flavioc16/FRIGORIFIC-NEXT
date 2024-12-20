import prismaClient from "../../../prisma";

class GetCompraByIdService {
    async execute(id: string) {
        const compra = await prismaClient.compra.findUnique({
            where: { 
                id: id
            },
            include: {
                juros: true,  
                pagamentos: true,
            }
        });

        if (!compra) {
            throw new Error("Compra não encontrada.");
        }

        return compra;
    }
}

export { GetCompraByIdService };
