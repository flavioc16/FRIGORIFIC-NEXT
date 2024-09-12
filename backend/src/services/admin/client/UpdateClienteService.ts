import prismaClient from "../../../prisma";

interface ClienteRequest {
    id: string;
    nome?: string;
    endereco?: string;
    referencia?: string;
    email?: string;
    telefone?: string;
    user?: {
        name?: string;
        username?: string;
    };
}

class UpdateClienteService {
    async execute({ id, nome, endereco, referencia, email, telefone, user }: ClienteRequest) {
        // Verifica se o cliente existe
        const clienteExistente = await prismaClient.cliente.findUnique({
            where: { id },
            include: {
                user: true, // Inclui o usuário vinculado ao cliente
            },
        });

        if (!clienteExistente) {
            throw new Error("Cliente não encontrado");
        }

        // Atualiza o cliente com os novos dados
        const clienteAtualizado = await prismaClient.cliente.update({
            where: { id },
            data: {
                nome: nome || clienteExistente.nome,
                endereco: endereco || clienteExistente.endereco,
                referencia: referencia || clienteExistente.referencia,
                email: email || clienteExistente.email,
                telefone: telefone || clienteExistente.telefone,
            },
        });

        // Atualiza os dados do usuário associado, se houver
        if (user) {
            await prismaClient.user.update({
                where: { id: clienteExistente.userId },
                data: {
                    name: user.name || clienteExistente.user.name,
                    username: user.username || clienteExistente.user.username,
                },
            });
        }

        // Retorna o cliente atualizado junto com os dados do usuário
        const clienteComUsuarioAtualizado = await prismaClient.cliente.findUnique({
            where: { id },
            include: { user: true },
        });

        return clienteComUsuarioAtualizado;
    }
}

export { UpdateClienteService };
