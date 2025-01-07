import prismaClient from "../../../prisma";

class CountLembretesByTodayService {
  async execute() {
    // Obtém a data de hoje no formato correto
    const today = new Date().toISOString().split("T")[0];

    // Conta os lembretes criados hoje com base no campo dataCadastro
    const count = await prismaClient.lembrete.count({
      where: {
        notification: false,
        dataCadastro: {
          gte: new Date(`${today}T00:00:00.000Z`), // Início do dia
          lte: new Date(`${today}T23:59:59.999Z`), // Fim do dia
        },
      },
    });

    // Retorna o número de lembretes
    return { count };
  }
}

export { CountLembretesByTodayService };
