import prismaClient from "../../../prisma";

class GetClienteApllicatedJurosTodayService {
  async execute() {
    // Obtém a data de hoje no formato correto
    const today = new Date().toISOString().split('T')[0];

    // Busca os clientes com juros aplicados hoje e notificação como false
    const clientsWithJuros = await prismaClient.juros.findMany({
      where: {
        created_at: {
          gte: new Date(`${today}T00:00:00.000Z`), // Início do dia
          lte: new Date(`${today}T23:59:59.999Z`), // Fim do dia
        },
      },
      select: {
        clienteId: true,
        cliente: {
          select: {
            nome: true, // Nome do cliente
          },
        },
        created_at: true, // Data de criação
        notification: true, // Campo notification que determina se foi lido ou não
      },
      distinct: ["clienteId"], // Garante que os IDs dos clientes sejam únicos
      orderBy: {
        notification: "asc", // Ordena pelo campo notification em ordem crescente (use "desc" para decrescente)
      },
    });
  
    // Função para formatar a data para o formato brasileiro (DD/MM/YYYY)
    const formatDate = (dateString: string) => {
      const date = new Date(dateString);
      const day = String(date.getDate()).padStart(2, '0');
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const year = date.getFullYear();
      return `${day}/${month}/${year}`;
    };

    // Transforma os dados no formato esperado
    const notifications = clientsWithJuros.map((item) => {
      return {
        id: item.clienteId, // ID do cliente
        title: item.cliente?.nome || "Cliente sem nome", // Nome do cliente
        description: "Juros aplicado(s) em compra(s)", // Descrição fixa
        date: formatDate(item.created_at.toISOString()), // Data formatada como DD/MM/YYYY
        status: item.notification ? 1 : 0, // Status baseado no campo notification (0: não lido, 1: lido)
        iconType: "bell", // Tipo de ícone
        link: `/dashboard/purchases/${item.clienteId}`, // Link para a página do cliente
      };
    });

    return notifications; // Retorna os dados no formato esperado
  }
}

export { GetClienteApllicatedJurosTodayService };
    