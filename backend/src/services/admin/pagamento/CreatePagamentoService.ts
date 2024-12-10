import prismaClient from "../../../prisma";

interface PagamentoRequest {
  valorPagamento: number;
  clienteId: string;
  userId: string; // Adicionando o userId como parte da requisição
}

class CreatePagamentoService {
  async execute({ valorPagamento, clienteId, userId }: PagamentoRequest) {

    // Verificar se cliente existe
    const clienteExiste = await prismaClient.cliente.findUnique({
      where: { id: clienteId }
    });

    if (!clienteExiste) throw new Error("Cliente não encontrado");

    // Verificar se usuário existe
    const userExiste = await prismaClient.user.findUnique({
      where: { id: userId }
    });

    if (!userExiste) throw new Error("Usuário não encontrado");
    
    // Busca todas as compras do cliente com statusCompra 0 (não pagas), ordenadas por data
    const compras = await prismaClient.compra.findMany({
      where: { clienteId, statusCompra: 0 },
      orderBy: { created_at: "asc" }
    });

    // Calcula o total das compras pendentes
    const totalCompras = compras.reduce((acc, compra) => acc + compra.totalCompra, 0);

    // Verifica se o valor do pagamento é válido
    if (valorPagamento <= 0 || valorPagamento > totalCompras) {
      throw new Error("Valor do pagamento inválido");
    }

    let valorRestante = valorPagamento;

    // Cria o registro de pagamento com o user conectado
    const pagamento = await prismaClient.pagamento.create({
      data: {
        valorPagamento,
        cliente: { connect: { id: clienteId } },
        user: { connect: { id: userId } }
      }
    });

    // Itera sobre as compras e reduz o valor de cada uma até esgotar o valor do pagamento
    for (const compra of compras) {
      if (valorRestante <= 0) break;

      // Se o valor restante for maior ou igual ao valor da compra, marca a compra como paga
      if (valorRestante >= compra.totalCompra) {
        await prismaClient.compra.update({
          where: { id: compra.id },
          data: { 
            statusCompra: 1, // Marca a compra como paga
            pagamentoId: pagamento.id // Atualiza o pagamentoId com o pagamento criado
          }
        });
        valorRestante -= compra.totalCompra;
      } else {
        // Caso o valor restante seja menor, reduz a compra pela quantidade paga
        await prismaClient.compra.update({
          where: { id: compra.id },
          data: { 
            totalCompra: compra.totalCompra - valorRestante, // Atualiza o valor restante
            pagamentoId: pagamento.id // Atualiza o pagamentoId com o pagamento criado
          }
        });
        valorRestante = 0; // O pagamento foi totalmente utilizado
      }
    }

    return pagamento;
  }
}

export { CreatePagamentoService };
