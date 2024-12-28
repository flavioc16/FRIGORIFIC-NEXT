import prismaClient from "../../../prisma";

interface PagamentoRequest {
  valorPagamento: number;
  clienteId: string;
  userId: string;
}

class CreatePagamentoService {
  async execute({ valorPagamento, clienteId, userId }: PagamentoRequest) {
    // Verificar se cliente existe
    const clienteExiste = await prismaClient.cliente.findUnique({
      where: { id: clienteId },
    });

    if (!clienteExiste) throw new Error("Cliente não encontrado");

    // Verificar se usuário existe
    const userExiste = await prismaClient.user.findUnique({
      where: { id: userId },
    });

    if (!userExiste) throw new Error("Usuário não encontrado");

    // Busca todas as compras pendentes do cliente, ordenadas por data
    const compras = await prismaClient.compra.findMany({
      where: { clienteId, statusCompra: 0 },
      orderBy: { dataDaCompra: "asc" },
    });

    if (compras.length === 0) {
      throw new Error("Nenhuma compra pendente encontrada para este cliente.");
    }

    // Calcula o total pendente
    const totalPendente = compras.reduce((acc, compra) => acc + compra.totalCompra, 0);

    if (valorPagamento <= 0 || valorPagamento > totalPendente) {
      throw new Error("Valor do pagamento inválido.");
    }

    let valorRestante = valorPagamento;

    // Itera pelas compras para distribuir o valor do pagamento
    for (const compra of compras) {
      if (valorRestante <= 0) break;

      let valorParcial;

      if (valorRestante >= compra.totalCompra) {
        // Pagamento total da compra
        valorParcial = compra.totalCompra;

        await prismaClient.compra.update({
          where: { id: compra.id },
          data: {
            statusCompra: 1, // Marca como paga
          },
        });
      } else {
        // Pagamento parcial da compra
        valorParcial = valorRestante;

        await prismaClient.compra.update({
          where: { id: compra.id },
          data: {
            totalCompra: compra.totalCompra - valorParcial, // Reduz o valor da compra
          },
        });
      }

      // Registra o pagamento associado à compra
      await prismaClient.pagamento.create({
        data: {
          valorPagamento: valorParcial,
          cliente: { connect: { id: clienteId } },
          user: { connect: { id: userId } },
          compra: { connect: { id: compra.id } }, // Associa a compra ao pagamento
        },
      });

      // Deduz o valor parcial do valor restante
      valorRestante -= valorParcial;
    }

    return {
      mensagem: "Pagamento processado com sucesso.",
    };
  }
}

export { CreatePagamentoService };
