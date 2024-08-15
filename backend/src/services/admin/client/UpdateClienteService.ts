import prismaClient from "../../../prisma";

interface ClienteRequest {
    id: string;
    nome?: string;
    email?: string;
    telefone?: string;
}

class UpdateClienteService {
    async execute({ id, nome, email, telefone }: ClienteRequest) {
        // Verifica se o cliente existe
        const clienteExistente = await prismaClient.cliente.findUnique({
            where: { id },
        });

        if (!clienteExistente) {
            throw new Error("Cliente não encontrado");
        }

        // Atualiza o cliente com os novos dados
        const clienteAtualizado = await prismaClient.cliente.update({
            where: { id },
            data: {
                nome: nome || clienteExistente.nome,
                email: email || clienteExistente.email,
                telefone: telefone || clienteExistente.telefone,
            },
        });

        return clienteAtualizado;
    }
}

export { UpdateClienteService };
