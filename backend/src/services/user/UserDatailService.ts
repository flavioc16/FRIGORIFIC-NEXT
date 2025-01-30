import prismaClient from "../../prisma";

class GetClienteByUserIdService {
  async execute(userId: string) {
    // Busca o cliente pelo userId usando o findFirst
    const cliente = await prismaClient.cliente.findFirst({
      where: {
        userId: userId,  // Filtra pelo campo userId
      },
    });

    if (!cliente) {
      throw new Error("Cliente não encontrado");
    }

    return cliente;
  }
}

export { GetClienteByUserIdService };
