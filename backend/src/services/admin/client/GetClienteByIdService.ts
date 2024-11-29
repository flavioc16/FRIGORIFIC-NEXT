import prismaClient from "../../../prisma";

class GetClienteByIdService {
    async execute(clienteId: string) {
        const cliente = await prismaClient.cliente.findUnique({
            where: {
                id: clienteId,
            }
        });

        if (!cliente) {
            throw new Error("Cliente não encontrado");
        }

        return cliente;
    }
}

export { GetClienteByIdService };
