import prismaClient from "../../../prisma";

interface IRequest {
  id: string;
}

class UpdateNotificationStatusJurosService {
  async execute({ id }: IRequest) {
    // Verifica se o clienteId foi fornecido
    if (!id) {
      throw new Error("ID do cliente não fornecido.");
    }

    // Obtém a data de hoje
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0); // Remove hora, minutos, segundos e milissegundos

    // Verifica se existem juros adicionados hoje para o cliente específico
    const jurosHoje = await prismaClient.juros.findMany({
      where: {
        clienteId: id,
        created_at: {
          gte: hoje, // Data maior ou igual a hoje
        },
      },
    });

    // Se não houver registros de juros, lança um erro
    if (jurosHoje.length === 0) {
      throw new Error("Nenhum juros encontrado para o cliente no dia de hoje.");
    }

    // Atualiza o campo notification de todos os juros encontrados
    const jurosAtualizados = await prismaClient.juros.updateMany({
      where: {
        clienteId: id,
        created_at: {
          gte: hoje, // Data maior ou igual a hoje
        },
      },
      data: {
        notification: true, // Define notification como true
      },
    });

    return jurosAtualizados;
  }
}

export { UpdateNotificationStatusJurosService };
