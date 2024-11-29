import prismaClient from "../../prisma";

class GetComprasPorIdService {
  async execute(clienteId: string) {
    // Buscar apenas compras com status 0 (não pagas ou restante)
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
      orderBy: {
        created_at: 'asc', // Ordena pelas compras pela data de compra (de forma crescente)
      },
    });

    console.log("Buscando compras não pagas para clienteId:", clienteId);

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
