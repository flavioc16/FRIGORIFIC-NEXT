import prismaClient from "../../../prisma";

class DeleteClienteService {
    async execute(clienteId: string) {
        // Verifica se o cliente realmente existe
        const clienteExistente = await prismaClient.cliente.findUnique({
            where: { id: clienteId },
            include: { user: true } // Incluir o user relacionado, caso exista
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

        // Exclui o cliente primeiro
        await prismaClient.cliente.delete({
            where: { id: clienteId }
        });

        // Exclui o usuário associado (se existir) após excluir o cliente
        if (clienteExistente.user) {
            await prismaClient.user.delete({
                where: { id: clienteExistente.user.id }
            });
        }

        return { message: "Cliente e usuário excluídos com sucesso." };
    }
}

export { DeleteClienteService };
