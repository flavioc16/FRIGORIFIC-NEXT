import prismaClient from "../../../prisma";

class GetCountClientsService {
    async execute() {
        // Contando o número de registros na tabela "cliente"
        const count = await prismaClient.cliente.count();
        return count;
    }
}

export { GetCountClientsService };
