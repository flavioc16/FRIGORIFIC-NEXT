import prismaClient from "../../../prisma";

class GetAllClientesService {
    async execute() {
        // Obtém todos os clientes
        const clientes = await prismaClient.cliente.findMany({
            include: {
                user: true
            },
            orderBy: {
                nome: 'asc' // Ordena pelo campo 'nome' de forma crescente
            }
        });

        // Remove a propriedade `role` de cada objeto `user`
        const clientesSemRole = clientes.map(cliente => {
            const { role, ...userWithoutRole } = cliente.user;
            return {
                ...cliente,
                user: userWithoutRole
            };
        });

        return clientesSemRole;
    }
}

export { GetAllClientesService };

