import prismaClient from "../../../prisma";

class DeleteClienteService {
    async execute(clienteId: string) {
        // Verifica se o cliente realmente existe
        const clienteExistente = await prismaClient.cliente.findUnique({
            where: { id: clienteId }
        });

        if (!clienteExistente) {
            throw new Error("Cliente não encontrado.");
        }

        // Verifica se o cliente possui compras
        const compras = await prismaClient.compra.findMany({
            where: { clienteId }
        });

        if (compras.length > 0) {
            throw new Error("Cliente possui compras e não pode ser excluído.");
        }

        // Caso não tenha compras, exclui o cliente
        await prismaClient.cliente.delete({
            where: { id: clienteId }
        });

        return { message: "Cliente excluído com sucesso." };
    }
}

export { DeleteClienteService };
