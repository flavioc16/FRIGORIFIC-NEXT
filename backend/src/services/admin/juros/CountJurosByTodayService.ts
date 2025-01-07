import prismaClient from "../../../prisma";

class CountJurosByTodayService {
  async execute() {
    // Obtém a data de hoje no formato correto
    const today = new Date().toISOString().split('T')[0];

    // Obtém IDs distintos de clientes com juros hoje onde notification = false
    const uniqueClients = await prismaClient.juros.findMany({
      where: {
        notification: false, // Apenas registros onde notification é false
        created_at: {
          gte: new Date(`${today}T00:00:00.000Z`), // Início do dia
          lte: new Date(`${today}T23:59:59.999Z`), // Fim do dia
        },
      },
      select: {
        clienteId: true, // Seleciona apenas o campo clienteId
      },
      distinct: ["clienteId"], // Garante IDs únicos
    });

    // Retorna o número de clientes distintos
    return { count: uniqueClients.length };
  }
}

export { CountJurosByTodayService };
