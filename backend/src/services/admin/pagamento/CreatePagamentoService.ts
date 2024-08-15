import prismaClient from "../../../prisma";

interface PagamentoRequest {
  valorPagamento: number;
  clienteId: string;
  userId: string;
}

class CreatePagamentoService {
  async execute({ valorPagamento, clienteId, userId }: PagamentoRequest) {
    // Busca de compras do cliente com tipoCompra 0 (compras originais)
    const compras = await prismaClient.compra.findMany({
      where: { clienteId, tipoCompra: 0, statusCompra: 0 }
    });

    // Calcula o total das compras usando o campo totalCompra
    const totalCompras = compras.reduce((acc, compra) => acc + compra.totalCompra, 0);
    console.log('Total das Compras:', totalCompras);

    // Verifica se o valor do pagamento está entre 0 e o total das compras
    if (valorPagamento <= 0 || valorPagamento > totalCompras) {
      throw new Error("Valor do pagamento inválido");
    }

    // Atualiza o status das compras existentes para '1' (Pago) 
    const updateResult = await prismaClient.compra.updateMany({
      where: {
        clienteId,
        tipoCompra: 0, // Considerando que 0 é o tipo de compra original
        statusCompra: 0 // Considerando que 0 é o status de não pago
      },
      data: {
        statusCompra: 1 // Atualiza para '1' (Pago)
      }
    });
    console.log('Resultado da Atualização das Compras:', updateResult);

    // Criação de pagamento
    const pagamento = await prismaClient.pagamento.create({
      data: {
        valorPagamento,
        cliente: { connect: { id: clienteId } },
        user: { connect: { id: userId } }
      }
    });

    // Criação de uma nova compra com a descrição de valor restante, se necessário
    if (valorPagamento < totalCompras) {
      const novoValorRestante = totalCompras - valorPagamento;
      await prismaClient.compra.create({
        data: {
          descricaoCompra: "Valor Restante",
          totalCompra: novoValorRestante,
          tipoCompra: 0, // Considera que 1 é o tipo de valor restante
          statusCompra: 0, // Considera que 0 é o status de não pago
          cliente: { connect: { id: clienteId } },
          user: { connect: { id: userId } }
        }
      });
    }

    return pagamento;
  }
}

export { CreatePagamentoService };
