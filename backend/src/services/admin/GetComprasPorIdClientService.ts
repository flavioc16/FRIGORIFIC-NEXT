import prismaClient from "../../prisma";

class GetComprasPorIdService {
  async execute(clienteId: string) {
    // Buscar apenas compras com status 0 (não pagas ou restantes)
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
        user: false,
      },
      orderBy: [
        {
          created_at: 'asc', // Ordena pelas compras pela data de criação (cadastro)
        },
        {
          dataDaCompra: 'asc', // Se a data de compra for diferente, usa a ordem por data da compra
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
