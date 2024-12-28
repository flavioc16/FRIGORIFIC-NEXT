import prismaClient from "../../prisma";

class GetComprasPorIdService {
  async execute(clienteId: string) {
    // Buscar compras com status 0 (não pagas ou restantes), incluindo juros e pagamentos
    const comprasRestantes = await prismaClient.compra.findMany({
      where: {
        clienteId: clienteId,
        statusCompra: 0, // Apenas compras com status não pago
      },
      include: {
        cliente: {
          select: {
            nome: true,
          },
        },
        juros: true,         // Inclui os dados de juros, caso existam
        pagamentos: true,    // Inclui os dados de pagamentos, caso existam
      },
      orderBy: [
        {
          dataDaCompra: 'asc',
        },
      ],
    });

    // Calcular o valor total das compras restantes
    const somaTotalCompras = comprasRestantes.reduce(
      (acc, compra) => acc + compra.totalCompra,
      0
    );

    return {
      compras: comprasRestantes,
      somaTotalCompras,
    };
  }
}

export { GetComprasPorIdService };
