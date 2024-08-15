import prismaClient from "../../../prisma";

class GetClienteByIdService {
    async execute(clienteId: string) {
        const cliente = await prismaClient.cliente.findUnique({
            where: {
                id: clienteId,
            },
            include: {
                user: true,
                compras: true,
                _count:  true, 
                pagamentos: true,
            },
        });

        if (!cliente) {
            throw new Error("Cliente não encontrado");
        }

        return cliente;
    }
}

export { GetClienteByIdService };
